// app/admin/gallery/page.tsx - COMPLETE CODE WITH IMAGE LIST MANAGEMENT
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import {
  getAllAlbums,
  getAdminGalleryCategories,
  getGalleryCategoryIdByName,
  getProjectsWithoutGalleryAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  deleteImage,
  updateImageMetadata,
  setFeaturedImage,
  createGalleryCategory,
  deleteGalleryCategory,
  updateGalleryCategory,
  type AlbumWithCategories,
  type GalleryCategory,
  type Project,
} from '@/lib/gallery';

type Section = 'album-list' | 'manage-album' | 'add-album' | 'manage-categories';

type ConfirmationDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmationDialog = ({ title, message, onConfirm, onClose }: ConfirmationDialogProps) => (
  <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-w-sm">
    <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600 mb-6">{message}</p>
    <div className="flex justify-end space-x-3">
      <button 
        onClick={onClose} 
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        Cancel
      </button>
      <button 
        onClick={() => { onConfirm(); onClose(); }} 
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        Confirm
      </button>
    </div>
  </div>
);

const showConfirm = (title: string, message: string, onConfirm: () => void) => {
  confirmAlert({
    customUI: ({ onClose }) => (
      <ConfirmationDialog title={title} message={message} onConfirm={onConfirm} onClose={onClose} />
    ),
  });
};

export default function AdminGallery() {
  const [activeSection, setActiveSection] = useState<Section>('album-list');
  const [albums, setAlbums] = useState<AlbumWithCategories[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedAlbumData, setSelectedAlbumData] = useState<AlbumWithCategories | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add Album states
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumCategories, setNewAlbumCategories] = useState<number[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectSitesCategoryId, setProjectSitesCategoryId] = useState<number | null>(null);

  // Image upload states
  const [imageTitles, setImageTitles] = useState<{ [key: string]: string }>({});
  const [imageCaptions, setImageCaptions] = useState<{ [key: string]: string }>({});
  
  // *** NEW: Image editing states ***
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageTitle, setEditingImageTitle] = useState('');
  const [editingImageCaption, setEditingImageCaption] = useState('');

  // Category management states
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#1e3a8a');
  const [newCategoryOrder, setNewCategoryOrder] = useState(100);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [colorEditing, setColorEditing] = useState<{ id: number; color: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  setLoading(true);
  try {
    const [albumsData, adminCategoriesData, projectsData, projectCatId] = await Promise.all([
      getAllAlbums(),
      getAdminGalleryCategories(),
      getProjectsWithoutGalleryAlbums(),
      getGalleryCategoryIdByName('Project Sites'),
    ]);
    
    setAlbums(albumsData);
    setCategories(adminCategoriesData);
    setAvailableProjects(projectsData);
    setProjectSitesCategoryId(projectCatId);

    const maxOrder = adminCategoriesData.reduce((max, cat) => Math.max(max, cat.display_order), 0);
    setNewCategoryOrder(maxOrder > 0 ? maxOrder + 1 : 100);
  } catch (e) {
    toast.error("Failed to load data.");
  } finally {
    setLoading(false);
  }
};

  const handleSelectAlbum = async (albumId: string) => {
    setLoading(true);
    try {
      const albumData = await getAlbumById(albumId);
      if (albumData) {
        setSelectedAlbumData(albumData);
        setActiveSection('manage-album');
      } else {
        toast.error('Failed to load album data.');
      }
    } catch (e) {
      toast.error('Error loading album.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setActiveSection('album-list');
    setSelectedAlbumData(null);
    setSelectedFiles([]);
    setImageTitles({});
    setImageCaptions({});
    setEditingImageId(null); // Reset editing state
  };
  
  // *** FUNCTION: Update Image Metadata and Order ***
  const handleUpdateImageMetadataAndOrder = async (
    imageId: string, 
    newTitle: string, 
    newCaption: string, 
    newOrder: number | undefined // display_order is now handled here
  ) => {
    toast.promise(
        updateImageMetadata(imageId, newTitle, newCaption, newOrder)
            .then(async (success) => {
                if (success) {
                    if (selectedAlbumData) {
                        // Reload album data to reflect changes
                        const updatedAlbum = await getAlbumById(selectedAlbumData.id);
                        setSelectedAlbumData(updatedAlbum);
                    }
                    setEditingImageId(null);
                    return 'Image metadata and order updated!';
                } else {
                    throw new Error('Update failed.');
                }
            }),
        {
            loading: 'Saving image changes...',
            success: (message) => message,
            error: 'Error updating image metadata.',
        }
    );
  };
  
  // *** FUNCTION: Move Image Up/Down ***
  const handleMoveImage = async (imageId: string, direction: 'up' | 'down') => {
      if (!selectedAlbumData || !selectedAlbumData.images) return;
  
      // Sort images by display_order for consistent ordering display
      const sortedImages = [...selectedAlbumData.images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      
      const currentIndex = sortedImages.findIndex(img => img.id === imageId);
      if (currentIndex === -1) return;
  
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Check boundaries
      if (targetIndex < 0 || targetIndex >= sortedImages.length) {
          toast(`Image is already at the ${direction === 'up' ? 'top' : 'bottom'}.`, { icon: '✋' });
          return;
      }
  
      const currentImage = sortedImages[currentIndex];
      const targetImage = sortedImages[targetIndex];
      
      // Swap display_order values
      const newOrderForCurrent = targetImage.display_order;
      const newOrderForTarget = currentImage.display_order;
  
      toast.promise(
          (async () => {
              // Batch updates for both images to swap their order
              const success1 = await updateImageMetadata(currentImage.id, currentImage.title, currentImage.caption || '', newOrderForCurrent);
              const success2 = await updateImageMetadata(targetImage.id, targetImage.title, targetImage.caption || '', newOrderForTarget);
              
              if (!success1 || !success2) {
                  throw new Error('One or both image order updates failed.');
              }
              
              // Reload the album data
              const updatedAlbum = await getAlbumById(selectedAlbumData.id);
              setSelectedAlbumData(updatedAlbum);
              // No need to call loadData() for entire app, just the album is enough
              
              return `Image moved ${direction} successfully!`;
          })(),
          {
              loading: 'Reordering images...',
              success: (message) => message,
              error: 'Error reordering images.',
          }
      );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      const titles: { [key: string]: string } = {};
      const captions: { [key: string]: string } = {};
      files.forEach((file) => {
        titles[file.name] = file.name.replace(/\.[^/.]+$/, '');
        captions[file.name] = '';
      });
      setImageTitles(titles);
      setImageCaptions(captions);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      const titles: { [key: string]: string } = {};
      const captions: { [key: string]: string } = {};
      files.forEach((file) => {
        titles[file.name] = file.name.replace(/\.[^/.]+$/, '');
        captions[file.name] = '';
      });
      setImageTitles(titles);
      setImageCaptions(captions);
    }
  };

  const handleUploadImages = async () => {
    if (!selectedAlbumData || selectedFiles.length === 0) {
      toast.error('Please select images to upload.');
      return;
    }

    toast.promise(
      (async () => {
        // Calculate the starting order for new images
        const maxExistingOrder = selectedAlbumData.images?.reduce((max, img) => Math.max(max, img.display_order || 0), 0) || 0;
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const title = imageTitles[file.name] || file.name;
          const caption = imageCaptions[file.name] || '';
          // Set initial order sequentially after the last existing image
          const initialOrder = maxExistingOrder + i + 1; 
          
          // Assuming uploadImage signature is: (file, albumId, title, caption, isFeatured, displayOrder)
          await uploadImage(file, selectedAlbumData.id, title, caption, undefined, initialOrder);
        }
        setSelectedFiles([]);
        setImageTitles({});
        setImageCaptions({});
        
        // Reload album data
        const updatedAlbum = await getAlbumById(selectedAlbumData.id);
        setSelectedAlbumData(updatedAlbum);
        await loadData();
        
        return `Successfully uploaded ${selectedFiles.length} images!`;
      })(),
      {
        loading: 'Uploading images...',
        success: (message) => message,
        error: 'Error uploading images. Please try again.',
      }
    );
  };

  const handleCreateAlbum = async () => {
  if (!newAlbumName.trim()) {
    toast.error('Please enter a name for the album.');
    return;
  }
  if (newAlbumCategories.length === 0) {
    toast.error('Please select at least one category.');
    return;
  }

  toast.promise(
    createAlbum(newAlbumName, newAlbumDescription, newAlbumCategories, selectedProjectId || undefined)
      .then(async (album) => {
        if (album) {
          setNewAlbumName('');
          setNewAlbumDescription('');
          setNewAlbumCategories([]);
          setSelectedProjectId(null);
          await loadData();
          setActiveSection('album-list');
          return 'Album created successfully!';
        } else {
          throw new Error('Album creation failed.');
        }
      }),
    {
      loading: 'Creating album...',
      success: (message) => message,
      error: 'Error creating album. Please try again.',
    }
  );
};

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
	  const value = e.target.value;
	  
	  // Clear everything first
	  setNewAlbumName('');
	  setSelectedProjectId(null);
	  setNewAlbumCategories([]);

	  if (value === '') return;
	  
	  if (value === '0') {
		toast.success("Creating a Custom Album. Enter the name below.", { duration: 2500 });
		return;
	  }

	  const projectId = Number(value);
	  const selectedProject = availableProjects.find(p => p.id === projectId);

	  if (selectedProject) {
		setNewAlbumName(selectedProject.name);
		setSelectedProjectId(projectId);
		
		// IMPORTANT: Auto-select Project Sites category for project-linked albums
		if (projectSitesCategoryId) {
		  setNewAlbumCategories([projectSitesCategoryId]); // This ensures it's selected
		  toast.success(`'${selectedProject.name}' selected. 'Project Sites' category auto-selected.`, { duration: 3000 });
		} else {
		  toast.error('Could not find "Project Sites" category. Please select categories manually.');
		}
	  }
	};

  const handleUpdateAlbum = async () => {
  if (!selectedAlbumData) return;

  toast.promise(
    (async () => {
      const categoryIds = selectedAlbumData.categories?.map(c => c.id) || [];
      const result = await updateAlbum(
        selectedAlbumData.id,
        selectedAlbumData.name,
        selectedAlbumData.description || '',
        categoryIds,
        selectedAlbumData.show_on_website,
        selectedAlbumData.is_featured
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      await loadData();
      const updatedAlbum = await getAlbumById(selectedAlbumData.id);
      setSelectedAlbumData(updatedAlbum);
      return 'Album updated successfully!';
    })(),
    {
      loading: 'Saving album changes...',
      success: (message) => message,
      error: (err) => err.message || 'Error updating album.',
    }
  );
};

  const handleDeleteAlbum = (albumId: string) => {
    showConfirm(
      'Delete Album',
      'Are you sure you want to delete this album? This will also delete all images in it.',
      async () => {
        toast.promise(
          deleteAlbum(albumId).then(async (success) => {
            if (success) {
              await loadData();
              handleBackToList();
              return 'Album deleted successfully!';
            } else {
              throw new Error('Deletion failed.');
            }
          }),
          {
            loading: 'Deleting album...',
            success: (message) => message,
            error: 'Error deleting album.',
          }
        );
      }
    );
  };

  const handleDeleteImage = (imageId: string) => {
    showConfirm(
      'Delete Image',
      'Are you sure you want to delete this image?',
      async () => {
        toast.promise(
          deleteImage(imageId).then(async (success) => {
            if (success) {
              if (selectedAlbumData) {
                const updatedAlbum = await getAlbumById(selectedAlbumData.id);
                setSelectedAlbumData(updatedAlbum);
              }
              await loadData();
              return 'Image deleted successfully!';
            } else {
              throw new Error('Deletion failed.');
            }
          }),
          {
            loading: 'Deleting image...',
            success: (message) => message,
            error: 'Error deleting image.',
          }
        );
      }
    );
  };

  // Category management functions (same as before)
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }
    
    toast.promise(
      createGalleryCategory(newCategoryName, newCategoryDescription, newCategoryColor, newCategoryOrder)
        .then(async (newCategory) => {
          if (newCategory) {
            setNewCategoryName('');
            setNewCategoryDescription('');
            setNewCategoryColor('#1e3a8a');
            setShowNewCategoryForm(false);
            await loadData();
            return 'Category created successfully!';
          } else {
            throw new Error('Category creation failed.');
          }
        }),
      {
        loading: 'Creating category...',
        success: (message) => message,
        error: 'Error creating category. Please try again.',
      }
    );
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }
    
    toast.promise(
      updateGalleryCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description || '',
        color_class: editingCategory.color_class,
        display_order: editingCategory.display_order
      }).then(async (success) => {
        if (success) {
          setEditingCategory(null);
          await loadData();
          return 'Category updated successfully!';
        } else {
          throw new Error('Update failed.');
        }
      }),
      {
        loading: 'Saving category changes...',
        success: (message) => message,
        error: 'Error updating category.',
      }
    );
  };

  const handleToggleActive = (category: GalleryCategory) => {
    const newStatus = !category.is_active;
    const action = newStatus ? 'activate' : 'deactivate';
    
    showConfirm(
      `${newStatus ? 'Activate' : 'Deactivate'} Category`,
      `Are you sure you want to ${action} the category: ${category.name}?`,
      async () => {
        toast.promise(
          updateGalleryCategory(category.id, { is_active: newStatus })
            .then(async (success) => {
              if (success) {
                await loadData();
                return `Category '${category.name}' ${action}d successfully.`;
              } else {
                throw new Error('Status update failed.');
              }
            }),
          {
            loading: 'Updating status...',
            success: (message) => message,
            error: 'Error updating category status.',
          }
        );
      }
    );
  };

  const handleUpdateColor = (categoryId: number, newColor: string) => {
    const currentCategory = categories.find(c => c.id === categoryId);
    if (currentCategory && currentCategory.color_class === newColor) {
      setColorEditing(null);
      return;
    }
    
    showConfirm(
      'Update Category Color',
      `Are you sure you want to change the color for category: ${currentCategory?.name}?`,
      async () => {
        toast.promise(
          updateGalleryCategory(categoryId, { color_class: newColor })
            .then(async (success) => {
              if (success) {
                setColorEditing(null);
                await loadData();
                return 'Category color updated successfully!';
              } else {
                throw new Error('Color update failed.');
              }
            }),
          {
            loading: 'Updating color...',
            success: (message) => message,
            error: 'Error updating category color.',
          }
        );
      }
    );
  };

  const handleDeleteCategory = (categoryId: number) => {
    showConfirm(
      'Delete Category',
      'Are you sure you want to delete this category?',
      async () => {
        toast.promise(
          deleteGalleryCategory(categoryId).then(async (success) => {
            if (success) {
              await loadData();
              return 'Category deleted successfully!';
            } else {
              throw new Error('Deletion failed.');
            }
          }),
          {
            loading: 'Deleting category...',
            success: (message) => message,
            error: 'Error deleting category.',
          }
        );
      }
    );
  };

  const handleMoveCategory = async (categoryId: number, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedCategories.findIndex(c => c.id === categoryId);

    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sortedCategories.length - 1)) {
      toast('Category is already at the extreme end.', { icon: '✋' });
      return;
    }

    const neighborIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const neighbor = sortedCategories[neighborIndex];

    if (!neighbor) return;

    const newOrderForCategory = neighbor.display_order;
    const newOrderForNeighbor = category.display_order;

    toast.promise(
      (async () => {
        const success1 = await updateGalleryCategory(categoryId, { display_order: newOrderForCategory });
        const success2 = await updateGalleryCategory(neighbor.id, { display_order: newOrderForNeighbor });

        if (success1 && success2) {
          await loadData();
          return `Category '${category.name}' moved ${direction}.`;
        } else {
          throw new Error('Failed to update categories.');
        }
      })(),
      {
        loading: 'Moving category...',
        success: (message) => message,
        error: 'Error moving category.',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-300 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Gallery Management</h1>
          <p className="text-lg text-gray-600 mt-1">Control the visual content displayed on the website gallery.</p>
        </header>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveSection('album-list');
                setSelectedAlbumData(null);
              }}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'album-list'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Albums ({albums.length})
            </button>
            <button
              onClick={() => {
                setActiveSection('manage-categories');
                setEditingCategory(null);
                setShowNewCategoryForm(false);
              }}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-categories'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Categories
            </button>
          </nav>
        </div>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 flex flex-col items-center">
              <img
                src="/favicon.ico"
                alt="Loading Logo"
                className="h-16 w-16 object-contain mb-4 animate-pulse" 
              />
              <p className="mt-4 text-gray-700 font-semibold text-lg">Processing...</p>
              <p className="text-sm text-gray-500">Please wait a moment</p>
            </div>
          </div>
        )}

        {/* ALBUM LIST */}
        {activeSection === 'album-list' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">All Albums</h3>
              <button
                onClick={() => setActiveSection('add-album')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition shadow-md"
              >
                <i className="fas fa-plus mr-2"></i> Add New Album
              </button>
            </div>

            {albums.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">No albums yet. Create your first album to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => handleSelectAlbum(album.id)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#fbbf24] cursor-pointer transition group"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 flex-shrink-0 mr-4">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <i className="fas fa-image text-gray-400 text-2xl"></i>
                        </div>
                      )}
                    </div>

                    {/* Album Info */}
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#1e3a8a]">
                        {album.name}
                      </h4>
                      {album.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{album.description}</p>
                      )}
                      
                      {/* Functional Status Tags (Visibility, Featured, Project Link) */}
					  <div className="flex items-center gap-3 mt-2 flex-wrap">
					  <span className="text-xs text-gray-500">
						<i className="fas fa-images mr-1"></i>
						{album.photo_count} Photos
					  </span>
					  
					  {album.show_on_website !== false && (
						<span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
						  <i className="fas fa-eye"></i> Visible
						</span>
					  )}
					  
					  {album.is_featured && (
						<span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
						  <i className="fas fa-star"></i> Featured
						</span>
					  )}
					  
					  {album.project_id && album.project_name && (
						<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
						  🔗 {album.project_name}
						</span>
					  )}
					</div> 
					
					{/* Categories Tags (Separated below) */}
					{album.categories && album.categories.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-2"> 
						  <span className="text-xs font-semibold text-gray-600 mr-1">Categories:</span>
						  {album.categories.map((cat) => (
							<span
							  key={cat.id}
							  className="text-xs px-2 py-1 rounded"
							  style={{ 
								backgroundColor: `${cat.color_class}20`,
								color: cat.color_class 
							  }}
							>
							  {cat.name}
							</span>
						  ))}
						</div>
					)}
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0 ml-4">
                      <i className="fas fa-chevron-right text-gray-400 group-hover:text-[#fbbf24]"></i>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MANAGE ALBUM */}
        {activeSection === 'manage-album' && selectedAlbumData && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-[#1e3a8a] transition"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">{selectedAlbumData.name}</h3>
                  {selectedAlbumData.project_name && (
                    <p className="text-sm text-blue-600 mt-1">🔗 Linked to: {selectedAlbumData.project_name}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateAlbum}
				  className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2558a7] transition"
				  title="Save changes"
                >
                  <i className="fas fa-save mr-2"></i> Save Changes
                </button>
                <button
                  onClick={() => handleDeleteAlbum(selectedAlbumData.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  <i className="fas fa-trash mr-2"></i> Delete Album
                </button>
              </div>
            </div>

            {/* Album Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Album Name</label>
                <input
                  type="text"
                  value={selectedAlbumData.name}
                  onChange={(e) => setSelectedAlbumData({ ...selectedAlbumData, name: e.target.value })}
                  disabled={!!selectedAlbumData.project_id}
                  className={`w-full border border-gray-300 rounded-md p-2 ${selectedAlbumData.project_id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={selectedAlbumData.description || ''}
                  onChange={(e) => setSelectedAlbumData({ ...selectedAlbumData, description: e.target.value })}
                  disabled={!!selectedAlbumData.project_id}
                  className={`w-full border border-gray-300 rounded-md p-2 ${selectedAlbumData.project_id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="mb-8">
			  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
			  <div className="flex flex-wrap gap-2">
				{categories.filter(cat => cat.is_active).map((cat) => {
				  const isProjectSitesCategory = cat.id === projectSitesCategoryId;
				  const isProjectLinked = !!selectedAlbumData.project_id;
				  const isChecked = selectedAlbumData.categories?.some(c => c.id === cat.id) || false;
				  const isDisabled = isProjectLinked && isProjectSitesCategory; // Only disable Project Sites for project-linked albums
				  
				  return (
					<label 
					  key={cat.id} 
					  className={`flex items-center space-x-2 p-2 border rounded-lg transition ${
						isChecked ? 'border-[#fbbf24] bg-yellow-50' : 'border-gray-300'
					  } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[#1e3a8a]'}`}
					>
					  <input
						type="checkbox"
						checked={isChecked}
						onChange={(e) => {
						  const currentCategories = selectedAlbumData.categories || [];
						  const categoryToToggle = categories.find(c => c.id === cat.id);
						  if (!categoryToToggle) return;
						  
						  if (e.target.checked) {
							setSelectedAlbumData({ 
							  ...selectedAlbumData, 
							  categories: [...currentCategories, categoryToToggle] 
							});
						  } else {
							// Prevent unchecking Project Sites for project-linked albums
							if (isDisabled) {
							  toast.error("Cannot remove 'Project Sites' category from project-linked albums.");
							  return;
							}
							setSelectedAlbumData({ 
							  ...selectedAlbumData, 
							  categories: currentCategories.filter(c => c.id !== cat.id) 
							});
						  }
						}}
						disabled={isDisabled}
						className="rounded"
					  />
					  <span className="text-sm">{cat.name}</span>
					  {isProjectLinked && isProjectSitesCategory && (
						<i className="fas fa-lock text-xs text-gray-500" title="Locked for project-linked albums"></i>
					  )}
					</label>
				  );
				})}
			  </div>
			  <p className="text-xs text-gray-500 mt-2">
				{selectedAlbumData.project_id 
				  ? "Project-linked albums must keep the 'Project Sites' category, but you can add additional categories."
				  : "Select one or more categories for this album."}
			  </p>
			</div>
			
			{/* Show on Website & Featured Album Toggles */}
			<div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
			  <div className="border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
				  <div>
					<h5 className="font-semibold text-gray-900">Show on Website</h5>
					<p className="text-xs text-gray-500 mt-1">Display this album on the public gallery page</p>
				  </div>
				  <label className="relative inline-flex items-center cursor-pointer">
					<input 
					  type="checkbox" 
					  checked={selectedAlbumData.show_on_website === true} 
					  onChange={(e) => {
						setSelectedAlbumData({ 
						  ...selectedAlbumData, 
						  show_on_website: e.target.checked 
						});
					  }}
					  className="sr-only peer" 
					/>
					<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
				  </label>
				</div>
			  </div>

			  <div className="border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
				  <div>
					<h5 className="font-semibold text-gray-900">Featured Album</h5>
					<p className="text-xs text-gray-500 mt-1">Highlight this album prominently on the gallery page</p>
				  </div>
				  <label className="relative inline-flex items-center cursor-pointer">
					<input 
					  type="checkbox" 
					  checked={selectedAlbumData.is_featured === true} 
					  onChange={(e) => {
						setSelectedAlbumData({ 
						  ...selectedAlbumData, 
						  is_featured: e.target.checked 
						});
					  }}
					  className="sr-only peer" 
					/>
					<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fbbf24]"></div>
				  </label>
				</div>
			  </div>
			</div>

            {/* Image Upload Section */}
            <div className="border-t pt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Upload Images to Album</h4>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${
                  isDragging ? 'border-[#fbbf24] bg-yellow-50' : 'border-gray-400 hover:border-[#1e3a8a] hover:bg-gray-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                <i className="fas fa-cloud-upload-alt text-4xl text-[#1e3a8a] mb-2"></i>
                <p className="text-gray-600 font-semibold">
                  Drag & drop files here, or <span className="text-[#fbbf24] underline cursor-pointer">click to browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Max 5MB per image</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-4 mb-6">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="border border-gray-300 p-4 rounded-lg">
                      <p className="font-semibold text-sm text-gray-700 mb-2">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Image Title *</label>
                          <input
                            type="text"
                            value={imageTitles[file.name] || ''}
                            onChange={(e) => setImageTitles({ ...imageTitles, [file.name]: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Caption (Optional)</label>
                          <input
                            type="text"
                            value={imageCaptions[file.name] || ''}
                            onChange={(e) => setImageCaptions({ ...imageCaptions, [file.name]: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleUploadImages}
                    className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition"
                  >
                    Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </div>

            {/* Album Images List (Updated Section) */}
            <div className="border-t pt-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    Album Images ({selectedAlbumData.images?.length || 0}) - Management List
                </h4>
                
                {selectedAlbumData.images && selectedAlbumData.images.length > 0 ? (
                    <div className="space-y-3">
                        {[...selectedAlbumData.images]
                            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                            .map((image, index, array) => {
                                const isEditing = editingImageId === image.id;

                                return (
                                    <div 
                                        key={image.id} 
                                        className={`flex items-start p-4 border rounded-lg transition shadow-sm ${image.is_featured ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
                                    >
                                        {/* Reorder Buttons (Move Up/Down) */}
                                        <div className="flex flex-col items-center mr-4 mt-2">
                                            <button
                                                onClick={() => handleMoveImage(image.id, 'up')}
                                                disabled={index === 0 || isEditing}
                                                className={`p-1 rounded-full ${index === 0 || isEditing ? 'text-gray-300' : 'text-[#1e3a8a] hover:bg-gray-100'} transition`}
                                                title="Move Up"
                                            >
                                                <i className="fas fa-chevron-up text-xs"></i>
                                            </button>
                                            <span className="text-xs font-bold text-gray-600 my-1">{index + 1}</span>
                                            <button
                                                onClick={() => handleMoveImage(image.id, 'down')}
                                                disabled={index === array.length - 1 || isEditing}
                                                className={`p-1 rounded-full ${index === array.length - 1 || isEditing ? 'text-gray-300' : 'text-[#1e3a8a] hover:bg-gray-100'} transition`}
                                                title="Move Down"
                                            >
                                                <i className="fas fa-chevron-down text-xs"></i>
                                            </button>
                                        </div>
                                        
                                        {/* Thumbnail */}
                                        <div className="w-24 h-24 flex-shrink-0 mr-4 relative">
                                            <img 
                                                src={image.thumbnail_url || image.url} 
                                                alt={image.title} 
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            {image.is_featured && (
                                                <div className="absolute top-0 left-0 bg-amber-500 text-white px-1 py-0.5 rounded-br-md text-xs font-bold">
                                                    <i className="fas fa-star"></i>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Metadata (Title/Caption) - Inline Edit */}
                                        <div className="flex-grow mr-4">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editingImageTitle}
                                                        onChange={(e) => setEditingImageTitle(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold"
                                                        placeholder="Title"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingImageCaption}
                                                        onChange={(e) => setEditingImageCaption(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md p-1.5 text-xs text-gray-600"
                                                        placeholder="Caption (Optional)"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <h5 className="text-sm font-semibold text-gray-900 line-clamp-1">{image.title}</h5>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{image.caption || 'No caption'}</p>
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex flex-col space-y-2 flex-shrink-0 w-24">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateImageMetadataAndOrder(
                                                            image.id, 
                                                            editingImageTitle, 
                                                            editingImageCaption, 
                                                            image.display_order // Keep current order when saving inline edit
                                                        )}
                                                        disabled={!editingImageTitle.trim()}
                                                        className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <i className="fas fa-check"></i> Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingImageId(null)}
                                                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-300"
                                                    >
                                                        <i className="fas fa-times"></i> Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingImageId(image.id);
                                                            setEditingImageTitle(image.title);
                                                            setEditingImageCaption(image.caption || '');
                                                        }} 
                                                        className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-700"
                                                    >
                                                        <i className="fas fa-pen mr-1"></i> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            toast.promise(
                                                                setFeaturedImage(image.id, selectedAlbumData.id).then(async (success) => {
                                                                    if (success) {
                                                                        const updatedAlbum = await getAlbumById(selectedAlbumData.id);
                                                                        setSelectedAlbumData(updatedAlbum);
                                                                        return 'Featured image updated!';
                                                                    } else {
                                                                        throw new Error('Failed to set featured image.');
                                                                    }
                                                                }),
                                                                {
                                                                    loading: 'Setting featured image...',
                                                                    success: (message) => message,
                                                                    error: 'Error setting featured image.',
                                                                }
                                                            );
                                                        }}
                                                        className={`px-2 py-1 rounded-md text-xs font-medium transition ${image.is_featured ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                                        title="Set as featured image"
                                                        disabled={isEditing}
                                                    >
                                                        <i className={`fas fa-star ${image.is_featured ? '' : 'mr-1'}`}></i> {image.is_featured ? 'Featured' : 'Set Featured'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteImage(image.id)} 
                                                        className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:bg-red-700"
                                                        disabled={isEditing}
                                                    >
                                                        <i className="fas fa-trash mr-1"></i> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No images in this album yet. Upload some images above!
                    </p>
                )}
            </div>
            {/* End of Album Images List (Updated Section) */}

          </div>
        )}

        {/* ADD ALBUM */}
        {activeSection === 'add-album' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSection('album-list')}
                  className="text-gray-600 hover:text-[#1e3a8a] transition"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <h3 className="text-2xl font-semibold text-gray-800">Create New Album</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Album Type
                </label>
                <select
                  id="project-select"
                  onChange={handleProjectSelect}
                  value={selectedProjectId === null ? '0' : selectedProjectId || ''}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="" disabled>-- Select an option --</option>
                  <option value="0">Create Custom Album</option>
                  <optgroup label="Link to Project">
                    {availableProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Album Name *</label>
                <input
                  type="text"
                  placeholder={selectedProjectId !== null ? 'Album name automatically set by project' : 'Enter album name'}
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  disabled={selectedProjectId !== null}
                  className={`border border-gray-300 rounded-md p-2 w-full ${
                    selectedProjectId !== null ? 'bg-gray-200 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Enter album description"
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories * (Select at least one)</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(cat => cat.is_active).map((cat) => (
                    <label 
                      key={cat.id} 
                      className={`flex items-center space-x-2 cursor-pointer p-2 border rounded-lg transition ${
                        newAlbumCategories.includes(cat.id) 
                          ? 'border-[#fbbf24] bg-yellow-50' 
                          : 'border-gray-300 hover:border-[#1e3a8a]'
                      } ${cat.id === projectSitesCategoryId && selectedProjectId !== null ? 'font-bold' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={newAlbumCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAlbumCategories([...newAlbumCategories, cat.id]);
                          } else {
                            if (cat.id === projectSitesCategoryId && selectedProjectId !== null) {
                              toast.error(`Cannot unselect 'Project Sites' while a project is linked.`);
                              return;
                            }
                            setNewAlbumCategories(newAlbumCategories.filter(id => id !== cat.id));
                          }
                        }}
                        className="rounded"
                        disabled={cat.id === projectSitesCategoryId && selectedProjectId !== null}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateAlbum}
                  disabled={!newAlbumName.trim() || newAlbumCategories.length === 0}
                  className="flex-1 bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2558a7] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-check mr-2"></i> Create Album
                </button>
                <button
                  onClick={() => {
                    setActiveSection('album-list');
                    setNewAlbumName('');
                    setNewAlbumDescription('');
                    setNewAlbumCategories([]);
                    setSelectedProjectId(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MANAGE CATEGORIES */}
        {activeSection === 'manage-categories' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Manage Gallery Categories</h3>
              <button
                onClick={() => {
                  setShowNewCategoryForm(!showNewCategoryForm);
                  setEditingCategory(null);
                }}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition"
              >
                <i className="fas fa-plus mr-2"></i>
                {showNewCategoryForm ? 'Cancel' : 'Add New Category'}
              </button>
            </div>

            {(showNewCategoryForm || editingCategory) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <h4 className="font-bold text-lg mb-3">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={editingCategory ? editingCategory.name : newCategoryName}
                    onChange={(e) => editingCategory 
                      ? setEditingCategory({ ...editingCategory, name: e.target.value })
                      : setNewCategoryName(e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 col-span-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Display Order"
                    value={editingCategory ? editingCategory.display_order : newCategoryOrder}
                    onChange={(e) => {
                      const order = parseInt(e.target.value, 10) || 0;
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, display_order: order });
                      } else {
                        setNewCategoryOrder(order);
                      }
                    }}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="color"
                    value={editingCategory ? editingCategory.color_class : newCategoryColor}
                    onChange={(e) => editingCategory 
                      ? setEditingCategory({ ...editingCategory, color_class: e.target.value })
                      : setNewCategoryColor(e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 h-10"
                  />
                </div>
                <div className='mt-4'>
                  <textarea
                    placeholder="Description (Optional)"
                    value={editingCategory ? editingCategory.description || '' : newCategoryDescription}
                    onChange={(e) => editingCategory 
                      ? setEditingCategory({ ...editingCategory, description: e.target.value })
                      : setNewCategoryDescription(e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 w-full"
                    rows={2}
                  />
                </div>
                <div className='mt-4 flex space-x-2'>
                  <button 
                    onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                    className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#2558a7] transition"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                  {editingCategory && (
                    <button 
                      onClick={() => setEditingCategory(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat, index) => (
                    <tr key={cat.id} className={editingCategory?.id === cat.id ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                        <div className="text-xs text-gray-500">{cat.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{cat.display_order}</span>
                          <div className='flex flex-col space-y-1'>
                            <button
                              onClick={() => handleMoveCategory(cat.id, 'up')}
                              disabled={index === 0}
                              className={`p-0.5 rounded ${index === 0 ? 'text-gray-300' : 'text-blue-500 hover:bg-gray-100'}`}
                              title="Move Up"
                            >
                              <i className="fas fa-chevron-up text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleMoveCategory(cat.id, 'down')}
                              disabled={index === categories.length - 1}
                              className={`p-0.5 rounded ${index === categories.length - 1 ? 'text-gray-300' : 'text-blue-500 hover:bg-gray-100'}`}
                              title="Move Down"
                            >
                              <i className="fas fa-chevron-down text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => {
                              if(colorEditing?.id === cat.id) {
                                setColorEditing(null);
                              } else {
                                setColorEditing({ id: cat.id, color: cat.color_class });
                              }
                            }}
                            className="w-6 h-6 rounded-full inline-block border-2 border-gray-300 shadow cursor-pointer transition transform hover:scale-110" 
                            style={{ backgroundColor: cat.color_class }}
                            title="Click to change color"
                          ></button>
                          {colorEditing?.id === cat.id && (
                            <div className="absolute z-10 p-2 bg-white border border-gray-300 rounded-lg shadow-xl mt-1 -left-16 transform -translate-x-1/2">
                              <input 
                                type="color" 
                                value={colorEditing.color} 
                                onChange={(e) => setColorEditing({ ...colorEditing, color: e.target.value })}
                                className="w-20 h-10 cursor-pointer p-0"
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => handleUpdateColor(cat.id, colorEditing.color)}
                                  className="text-xs px-2 py-1 bg-[#1e3a8a] text-white rounded hover:bg-[#2558a7]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setColorEditing(null)}
                                  className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={cat.is_active} 
                            onChange={() => handleToggleActive(cat)} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1e3a8a]"></div>
                          <span className={`ml-3 text-sm font-medium ${cat.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {cat.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setShowNewCategoryForm(false);
                          }}
                          className="text-[#fbbf24] hover:text-[#f59e0b] mr-3"
                          title="Edit"
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <p className="text-center text-gray-500 mt-8">No categories found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}