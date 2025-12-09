// lib/gallery.ts - Gallery Database Functions (UUID FIXED)
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
  id: string; // UUID
  name: string;
  description?: string;
  photo_count: number;
  project_id?: number;
  created_at: string;
  cover_image_url?: string;
  show_on_website?: boolean;
  is_featured?: boolean;
}

export interface Project {
  id: number;
  name: string;
}

export interface ProjectDetails {
  id: number;
  title: string;
}

export interface GalleryImage {
  id: string; // UUID
  album_id: string; // UUID
  title: string;
  url: string;
  thumbnail_url?: string;
  file_name: string;
  tags?: string;
  uploaded_at: string;
  caption?: string;
  display_order?: number;
  is_featured?: boolean;
}

export interface AlbumCategory {
  album_id: string; // UUID
  category_id: number;
}

export interface AlbumWithCategories extends GalleryAlbum {
  categories?: GalleryCategory[];
  images?: GalleryImage[];
  project_name?: string;
}

// Error response type
export interface GalleryError {
  success: false;
  error: string;
  details?: any;
}

export interface GallerySuccess<T> {
  success: true;
  data: T;
}

export type GalleryResult<T> = GallerySuccess<T> | GalleryError;

// ============================================================================
// PROJECT FUNCTIONS
// ============================================================================

export const getProjectsWithoutGalleryAlbums = async (): Promise<Project[]> => {
  try {
    const { data: existingAlbums, error: albumError } = await supabase
      .from('gallery_albums')
      .select('project_id')
      .not('project_id', 'is', null);

    if (albumError) {
      console.error('Error fetching existing album project IDs:', albumError);
      return [];
    }

    const projectIdsWithAlbums = existingAlbums.map(a => a.project_id).filter((id): id is number => id !== null);

    let query = supabase.from('projects')
      .select('id, title')
      .order('title', { ascending: true });

    if (projectIdsWithAlbums.length > 0) {
      query = query.not('id', 'in', `(${projectIdsWithAlbums.join(',')})`);
    }

    const { data: projectsData, error: projectError } = await query;

    if (projectError) {
      console.error('Error fetching projects without gallery albums:', projectError);
      return [];
    }

    const mappedProjects: Project[] = (projectsData || []).map((p: ProjectDetails) => ({
      id: p.id,
      name: p.title,
    }));

    return mappedProjects;
  } catch (error) {
    console.error('Unexpected error in getProjectsWithoutGalleryAlbums:', error);
    return [];
  }
};

export const getProjectById = async (projectId: number): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', projectId)
      .single();

    if (error || !data) {
      console.error('Error fetching project:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.title,
    };
  } catch (error) {
    console.error('Unexpected error in getProjectById:', error);
    return null;
  }
};

// ============================================================================
// CATEGORY FUNCTIONS
// ============================================================================

export const shiftCategoryOrders = async (startIndex: number, endIndex: number, increment: number): Promise<boolean> => {
  try {
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

export const decrementCategoryOrders = async (startIndex: number): Promise<boolean> => {
  try {
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

export const getGalleryCategoryIdByName = async (name: string): Promise<number | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', name) // Changed from .eq to .ilike for case-insensitive
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
  const { data: existingCategories } = await supabase
    .from('categories')
    .select('display_order')
    .eq('type', 'gallery')
    .eq('display_order', display_order);

  let finalDisplayOrder = display_order;
  if (existingCategories && existingCategories.length > 0) {
    const { data: maxData } = await supabase
      .from('categories')
      .select('display_order')
      .eq('type', 'gallery')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    finalDisplayOrder = maxData ? maxData.display_order + 1 : display_order;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name,
        description,
        type: 'gallery',
        display_order: finalDisplayOrder,
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
  if (updates.display_order !== undefined) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id, display_order')
      .eq('type', 'gallery')
      .eq('display_order', updates.display_order)
      .neq('id', id)
      .single();

    if (existing) {
      const { data: currentCategory } = await supabase
        .from('categories')
        .select('display_order')
        .eq('id', id)
        .single();

      if (currentCategory) {
        await supabase
          .from('categories')
          .update({ display_order: currentCategory.display_order })
          .eq('id', existing.id);
      }
    }
  }

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

  const albumsWithCategories = await Promise.all(
    albums.map(async (album) => {
      const categories = await getAlbumCategories(album.id);
      const coverImage = await getAlbumCoverImage(album.id);
      
      let project_name = undefined;
      if (album.project_id) {
        const project = await getProjectById(album.project_id);
        project_name = project?.name;
      }

      return {
        ...album,
        categories,
        cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
        project_name,
      };
    })
  );

  return albumsWithCategories;
};

export const getAlbumsByCategory = async (
  categoryId: number
): Promise<AlbumWithCategories[]> => {
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

  const { data: albums, error: albumError } = await supabase
    .from('gallery_albums')
    .select('*')
    .in('id', albumIds)
    .order('created_at', { ascending: false });

  if (albumError) {
    console.error('Error fetching albums:', albumError);
    return [];
  }

  const albumsWithCategories = await Promise.all(
    albums.map(async (album) => {
      const categories = await getAlbumCategories(album.id);
      const coverImage = await getAlbumCoverImage(album.id);
      
      let project_name = undefined;
      if (album.project_id) {
        const project = await getProjectById(album.project_id);
        project_name = project?.name;
      }

      return {
        ...album,
        categories,
        cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
        project_name,
      };
    })
  );

  return albumsWithCategories;
};

export const getAlbumById = async (
  albumId: string
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

  let project_name = undefined;
  if (album.project_id) {
    const project = await getProjectById(album.project_id);
    project_name = project?.name;
  }

  return {
    ...album,
    categories,
    images,
    cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
    project_name,
  };
};

export const createAlbum = async (
  name: string,
  description: string,
  categoryIds: number[],
  projectId?: number
): Promise<GalleryAlbum | null> => {
  const { data: album, error: albumError } = await supabase
    .from('gallery_albums')
    .insert([
      {
        name,
        description,
        photo_count: 0,
        project_id: projectId || null,
      },
    ])
    .select()
    .single();

  if (albumError || !album) {
    console.error('Error creating album:', albumError);
    return null;
  }

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
  albumId: string,
  name: string,
  description: string,
  categoryIds: number[],
  showOnWebsite?: boolean,
  isFeatured?: boolean
): Promise<GalleryResult<boolean>> => {
  try {
    const { data: album } = await supabase
      .from('gallery_albums')
      .select('project_id')
      .eq('id', albumId)
      .single();

    const updateData: { [key: string]: any } = {};
    
    if (!album?.project_id) {
      updateData.name = name;
      updateData.description = description;
    }
    
    if (showOnWebsite !== undefined) {
      updateData.show_on_website = showOnWebsite;
    }
    if (isFeatured !== undefined) {
      updateData.is_featured = isFeatured;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: albumError } = await supabase
        .from('gallery_albums')
        .update(updateData)
        .eq('id', albumId);

      if (albumError) {
        console.error('Error updating album:', albumError);
        return {
          success: false,
          error: 'Failed to update album',
          details: albumError,
        };
      }
    }

    const { error: deleteError } = await supabase
      .from('album_categories')
      .delete()
      .eq('album_id', albumId);

    if (deleteError) {
      console.error('Error deleting old category assignments:', deleteError);
      return {
        success: false,
        error: 'Failed to update categories',
        details: deleteError,
      };
    }

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
        return {
          success: false,
          error: 'Failed to assign new categories',
          details: insertError,
        };
      }
    }

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    console.error('Unexpected error in updateAlbum:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      details: error,
    };
  }
};

export const deleteAlbum = async (albumId: string): Promise<boolean> => {
  const images = await getAlbumImages(albumId);

  for (const image of images) {
    await deleteImage(image.id);
  }

  await supabase.from('album_categories').delete().eq('album_id', albumId);

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
  albumId: string
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
  albumId: string
): Promise<GalleryImage | null> => {
  // First, try to get the featured image
  const { data: featuredImage, error: featuredError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('album_id', albumId)
    .eq('is_featured', true)
    .limit(1)
    .single();

  // If featured image exists, return it
  if (featuredImage && !featuredError) {
    return featuredImage;
  }

  // Otherwise, get the first image by display_order
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
  albumId: string,
  title: string,
  caption?: string,
  tags?: string,
  displayOrder?: number
): Promise<GalleryImage | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${albumId}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);

  const { data: imageData, error: insertError } = await supabase
	  .from('gallery_images')
	  .insert([
		{
		  album_id: albumId,
		  title,
		  url: urlData.publicUrl,
		  file_name: fileName,
		  tags: tags || null, // Convert empty string to null
		  caption: caption || null,
		  display_order: displayOrder,
		},
	  ])
	  .select()
	  .single();

  if (insertError) {
    console.error('Error inserting image record:', insertError);
    return null;
  }

  await updateAlbumPhotoCount(albumId);

  return imageData;
};

export const updateImage = async (
  imageId: string,
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

export const updateImageMetadata = async (
  imageId: string,
  title: string,
  caption?: string,
  displayOrder?: number
): Promise<boolean> => {
  const updates: any = {
    title,
  };
  
  if (caption !== undefined) {
    updates.caption = caption || null;
  }
  
  if (displayOrder !== undefined) {
    updates.display_order = displayOrder;
  }

  const { error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', imageId);

  if (error) {
    console.error('Error updating image metadata:', error);
    return false;
  }

  return true;
};

export const setFeaturedImage = async (
  imageId: string,
  albumId: string
): Promise<boolean> => {
  await supabase
    .from('gallery_images')
    .update({ is_featured: false })
    .eq('album_id', albumId);

  const { error } = await supabase
    .from('gallery_images')
    .update({ is_featured: true })
    .eq('id', imageId);

  if (error) {
    console.error('Error setting featured image:', error);
    return false;
  }

  return true;
};

export const deleteImage = async (imageId: string): Promise<boolean> => {
  const { data: image, error: fetchError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', imageId)
    .single();

  if (fetchError || !image) {
    console.error('Error fetching image:', fetchError);
    return false;
  }

  const filePath = `${image.album_id}/${image.file_name}`;
  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting image from storage:', storageError);
  }

  const { error: dbError } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    console.error('Error deleting image from database:', dbError);
    return false;
  }

  await updateAlbumPhotoCount(image.album_id);

  return true;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAlbumCategories = async (
  albumId: string
): Promise<GalleryCategory[]> => {
  const { data: albumCategories, error: acError } = await supabase
    .from('album_categories')
    .select('category_id')
    .eq('album_id', albumId);

  if (acError || !albumCategories || albumCategories.length === 0) {
    return [];
  }

  const categoryIds = albumCategories.map((ac) => ac.category_id);

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .in('id', categoryIds);

  if (catError) {
    return [];
  }

  return categories || [];
};

const updateAlbumPhotoCount = async (albumId: string): Promise<void> => {
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

	export const getAlbumByProjectId = async (
	  projectId: number
	): Promise<AlbumWithCategories | null> => {
	  const { data: album, error } = await supabase
		.from('gallery_albums')
		.select('*')
		.eq('project_id', projectId)
		.single();

	  if (error || !album) {
		return null;
	  }

	  const categories = await getAlbumCategories(album.id);
	  const images = await getAlbumImages(album.id);
	  const coverImage = await getAlbumCoverImage(album.id);

	  let project_name = undefined;
	  if (album.project_id) {
		const project = await getProjectById(album.project_id);
		project_name = project?.name;
	  }

	  return {
		...album,
		categories,
		images,
		cover_image_url: coverImage?.url || coverImage?.thumbnail_url,
		project_name,
	  };
	};