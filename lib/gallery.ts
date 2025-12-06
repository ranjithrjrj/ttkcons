// lib/gallery.ts - Gallery Database Functions
import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface GalleryCategory {
  id: number;
  name: string;
  description?: string;
  type: string;
  display_order: number;
  is_active: boolean;
  color_class: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryAlbum {
  id: number;
  name: string;
  description?: string;
  photo_count: number;
  project_id?: number;
  created_at: string;
  cover_image_url?: string;
}

export interface Project {
    id: number;
    name: string; // This 'name' field is mapped from the DB's 'title' column below.
}

export interface GalleryImage {
  id: number;
  album_id: number;
  title: string;
  url: string;
  thumbnail_url?: string;
  file_name: string;
  tags?: string;
  uploaded_at: string;
  caption?: string;
  display_order?: number;
}

export interface AlbumCategory {
  album_id: number;
  category_id: number;
}

export interface AlbumWithCategories extends GalleryAlbum {
  categories?: GalleryCategory[];
  images?: GalleryImage[];
}

// ============================================================================
// PROJECT FUNCTIONS
// ============================================================================

/**
 * Fetches all projects that DO NOT have an associated gallery album (project_id is null).
 */
export const getProjectsWithoutGalleryAlbums = async (): Promise<Project[]> => {
    // 1. Get all project_ids currently used by gallery_albums
    const { data: existingAlbums, error: albumError } = await supabase
        .from('gallery_albums')
        .select('project_id')
        .not('project_id', 'is', null);

    if (albumError) {
        console.error('Error fetching existing album project IDs:', albumError);
        return [];
    }

    const projectIdsWithAlbums = existingAlbums.map(a => a.project_id).filter((id): id is number => id !== null);

    // 2. Fetch projects whose id is NOT in the list
    let query = supabase.from('projects')
        // FIX: Select the actual column 'title' (instead of 'title as name')
        .select('id, title') 
        .order('title', { ascending: true }); // Order by the actual column 'title'

    if (projectIdsWithAlbums.length > 0) {
        // Filter out projects that are already linked to an album
        query = query.not('id', 'in', projectIdsWithAlbums); 
    }

    const { data: projectsData, error: projectError } = await query;

    if (projectError) {
        console.error('Error fetching projects without gallery albums:', projectError);
        return [];
    }
    
    // 3. MAP: Convert the fetched 'title' property to 'name' to match the Project interface
    const mappedProjects: Project[] = (projectsData || []).map((p: { id: number, title: string }) => ({
        id: p.id,
        name: p.title, // Map the database 'title' column to the TypeScript 'name' property
    }));

    return mappedProjects;
};

// ============================================================================
// CATEGORY FUNCTIONS
// ============================================================================

// Utility function to shift category display orders (re-included for completeness)
export const shiftCategoryOrders = async (startIndex: number, endIndex: number, increment: number): Promise<boolean> => {
  try {
    // Assuming 'shift_category_orders' is a stored database function (RPC)
    const { error } = await supabase.rpc('shift_category_orders', {
      start_index: startIndex,
      end_index: endIndex,
      inc_value: increment,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error shifting category orders:', error);
    return false;
  }
};

// Utility function to decrement category display orders (re-included for completeness)
export const decrementCategoryOrders = async (startIndex: number): Promise<boolean> => {
  try {
    // Assuming 'decrement_category_orders' is a stored database function (RPC)
    const { error } = await supabase.rpc('decrement_category_orders', {
      start_index: startIndex,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error decrementing category orders:', error);
    return false;
  }
};

// Fetches ONLY ACTIVE categories (for frontend/album assignment forms)
export const getGalleryCategories = async (): Promise<GalleryCategory[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'gallery')
    .eq('is_active', true) 
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery categories:', error);
    return [];
  }

  return data || [];
};

// Fetches ALL categories (for admin management list)
export const getAdminGalleryCategories = async (): Promise<GalleryCategory[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'gallery')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching ALL gallery categories for admin:', error);
    return [];
  }

  return data || [];
};

/**
 * Fetches the ID of a category given its name (used for auto-selection).
 */
export const getGalleryCategoryIdByName = async (name: string): Promise<number | null> => {
    const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .eq('type', 'gallery')
        .limit(1)
        .single();

    if (error || !data) {
        console.error(`Error fetching category ID for "${name}":`, error);
        return null;
    }

    return data.id;
};


export const createGalleryCategory = async (
  name: string,
  description: string,
  color_class: string,
  display_order: number
): Promise<GalleryCategory | null> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name,
        description,
        type: 'gallery',
        display_order,
        is_active: true,
        color_class,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating gallery category:', error);
    return null;
  }

  return data;
};

export const updateGalleryCategory = async (
  id: number,
  updates: Partial<GalleryCategory>
): Promise<boolean> => {
  const { error } = await supabase
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery category:', error);
    return false;
  }

  return true;
};

export const deleteGalleryCategory = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting gallery category:', error);
    return false;
  }

  return true;
};

// ============================================================================
// ALBUM FUNCTIONS
// ============================================================================

export const getAllAlbums = async (): Promise<AlbumWithCategories[]> => {
  const { data: albums, error: albumError } = await supabase
    .from('gallery_albums')
    .select('*')
    .order('created_at', { ascending: false });

  if (albumError) {
    console.error('Error fetching albums:', albumError);
    return [];
  }

  if (!albums || albums.length === 0) return [];

  // Fetch categories for each album
  const albumsWithCategories = await Promise.all(
    albums.map(async (album) => {
      const categories = await getAlbumCategories(album.id);
      const coverImage = await getAlbumCoverImage(album.id);
      
      return {
        ...album,
        categories,
        cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
      };
    })
  );

  return albumsWithCategories;
};

export const getAlbumsByCategory = async (
  categoryId: number
): Promise<AlbumWithCategories[]> => {
  // First get album IDs for this category
  const { data: albumCategories, error: acError } = await supabase
    .from('album_categories')
    .select('album_id')
    .eq('category_id', categoryId);

  if (acError || !albumCategories) {
    console.error('Error fetching album categories:', acError);
    return [];
  }

  const albumIds = albumCategories.map((ac) => ac.album_id);

  if (albumIds.length === 0) return [];

  // Fetch albums
  const { data: albums, error: albumError } = await supabase
    .from('gallery_albums')
    .select('*')
    .in('id', albumIds)
    .order('created_at', { ascending: false });

  if (albumError) {
    console.error('Error fetching albums:', albumError);
    return [];
  }

  // Fetch categories for each album
  const albumsWithCategories = await Promise.all(
    albums.map(async (album) => {
      const categories = await getAlbumCategories(album.id);
      const coverImage = await getAlbumCoverImage(album.id);
      
      return {
        ...album,
        categories,
        cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
      };
    })
  );

  return albumsWithCategories;
};

export const getAlbumById = async (
  albumId: number
): Promise<AlbumWithCategories | null> => {
  const { data: album, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('id', albumId)
    .single();

  if (error || !album) {
    console.error('Error fetching album:', error);
    return null;
  }

  const categories = await getAlbumCategories(albumId);
  const images = await getAlbumImages(albumId);
  const coverImage = await getAlbumCoverImage(albumId);

  return {
    ...album,
    categories,
    images,
    cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
  };
};

export const createAlbum = async (
  name: string,
  description: string,
  categoryIds: number[],
  projectId?: number 
): Promise<GalleryAlbum | null> => {
  // Create the album
  const { data: album, error: albumError } = await supabase
    .from('gallery_albums')
    .insert([
      {
        name,
        description,
        photo_count: 0,
        project_id: projectId || null, // Stores the project ID
      },
    ])
    .select()
    .single();

  if (albumError || !album) {
    console.error('Error creating album:', albumError);
    return null;
  }

  // Assign categories to the album
  if (categoryIds.length > 0) {
    const albumCategoryRecords = categoryIds.map((catId) => ({
      album_id: album.id,
      category_id: catId,
    }));

    const { error: acError } = await supabase
      .from('album_categories')
      .insert(albumCategoryRecords);

    if (acError) {
      console.error('Error assigning categories to album:', acError);
    }
  }

  return album;
};

export const updateAlbum = async (
  albumId: number,
  name: string,
  description: string,
  categoryIds: number[]
): Promise<boolean> => {
  // Update album info
  const { error: albumError } = await supabase
    .from('gallery_albums')
    .update({ name, description })
    .eq('id', albumId);

  if (albumError) {
    console.error('Error updating album:', albumError);
    return false;
  }

  // Delete existing category assignments
  const { error: deleteError } = await supabase
    .from('album_categories')
    .delete()
    .eq('album_id', albumId);

  if (deleteError) {
    console.error('Error deleting old category assignments:', deleteError);
    return false;
  }

  // Insert new category assignments
  if (categoryIds.length > 0) {
    const albumCategoryRecords = categoryIds.map((catId) => ({
      album_id: albumId,
      category_id: catId,
    }));

    const { error: insertError } = await supabase
      .from('album_categories')
      .insert(albumCategoryRecords);

    if (insertError) {
      console.error('Error inserting new category assignments:', insertError);
      return false;
    }
  }

  return true;
};

export const deleteAlbum = async (albumId: number): Promise<boolean> => {
  // First, delete all images in this album
  const images = await getAlbumImages(albumId);
  
  for (const image of images) {
    await deleteImage(image.id); 
  }

  // Delete category assignments
  await supabase.from('album_categories').delete().eq('album_id', albumId);

  // Delete the album
  const { error } = await supabase
    .from('gallery_albums')
    .delete()
    .eq('id', albumId);

  if (error) {
    console.error('Error deleting album:', error);
    return false;
  }

  return true;
};

// ============================================================================
// IMAGE FUNCTIONS
// ============================================================================

export const getAlbumImages = async (
  albumId: number
): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('album_id', albumId)
    .order('display_order', { ascending: true })
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching album images:', error);
    return [];
  }

  return data || [];
};

export const getAlbumCoverImage = async (
  albumId: number
): Promise<GalleryImage | null> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('album_id', albumId)
    .order('display_order', { ascending: true })
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const uploadImage = async (
  file: File,
  albumId: number,
  title: string,
  caption?: string,
  tags?: string,
  displayOrder?: number
): Promise<GalleryImage | null> => {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `gallery/${albumId}/${fileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('public-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('public-assets')
    .getPublicUrl(filePath);

  // Insert image record
  const { data: imageData, error: insertError } = await supabase
    .from('gallery_images')
    .insert([
      {
        album_id: albumId,
        title,
        url: urlData.publicUrl,
        file_name: fileName,
        tags,
        caption,
        display_order: displayOrder,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting image record:', insertError);
    return null;
  }

  // Update album photo count
  await updateAlbumPhotoCount(albumId);

  return imageData;
};

export const updateImage = async (
  imageId: number,
  title: string,
  caption?: string,
  tags?: string,
  displayOrder?: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('gallery_images')
    .update({ title, caption, tags, display_order: displayOrder })
    .eq('id', imageId);

  if (error) {
    console.error('Error updating image:', error);
    return false;
  }

  return true;
};

export const deleteImage = async (imageId: number): Promise<boolean> => {
  // Get image details first
  const { data: image, error: fetchError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', imageId)
    .single();

  if (fetchError || !image) {
    console.error('Error fetching image:', fetchError);
    return false;
  }

  // Delete from storage
  const filePath = `gallery/${image.album_id}/${image.file_name}`;
  const { error: storageError } = await supabase.storage
    .from('public-assets')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting image from storage:', storageError);
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    console.error('Error deleting image from database:', dbError);
    return false;
  }

  // Update album photo count
  await updateAlbumPhotoCount(image.album_id);

  return true;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAlbumCategories = async (
  albumId: number
): Promise<GalleryCategory[]> => {
  const { data: albumCategories, error: acError } = await supabase
    .from('album_categories')
    .select('category_id')
    .eq('album_id', albumId);

  if (acError || !albumCategories || albumCategories.length === 0) {
    return [];
  }

  const categoryIds = albumCategories.map((ac) => ac.category_id);

  // Still filter by is_active for album category display (public-facing)
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .in('id', categoryIds)
    .eq('is_active', true); 

  if (catError) {
    return [];
  }

  return categories || [];
};

const updateAlbumPhotoCount = async (albumId: number): Promise<void> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id', { count: 'exact' })
    .eq('album_id', albumId);

  if (error) {
    console.error('Error counting photos:', error);
    return;
  }

  const count = data?.length || 0;

  await supabase
    .from('gallery_albums')
    .update({ photo_count: count })
    .eq('id', albumId);
};