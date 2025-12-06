// app/admin/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import {
  getAllAlbums,
  getGalleryCategories,
  getAdminGalleryCategories,
  getGalleryCategoryIdByName,
  getProjectsWithoutGalleryAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  deleteImage,
  createGalleryCategory,
  deleteGalleryCategory,
  updateGalleryCategory,
  type AlbumWithCategories,
  type GalleryCategory,
  type Project,
} from '@/lib/gallery';

type Section = 'organize-albums' | 'upload-photos' | 'manage-categories' | 'edit-album';

// Custom Confirmation Component (replaces browser's confirm())
const ConfirmationDialog = ({ title, message, onConfirm, onClose }) => (
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

// Helper function to trigger the custom confirmation
const showConfirm = (title: string, message: string, onConfirm: () => void) => {
  confirmAlert({
    customUI: ({ onClose }) => (
      <ConfirmationDialog title={title} message={message} onConfirm={onConfirm} onClose={onClose} />
    ),
  });
};

export default function AdminGallery() {
  const [activeSection, setActiveSection] = useState<Section>('organize-albums');
  const [albums, setAlbums] = useState<AlbumWithCategories[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [selectedAlbumData, setSelectedAlbumData] = useState<AlbumWithCategories | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  // Album creation states
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumCategories, setNewAlbumCategories] = useState<number[]>([]);
  
  // States for project linking feature
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectSitesCategoryId, setProjectSitesCategoryId] = useState<number | null>(null);

  const [imageTitles, setImageTitles] = useState<{ [key: string]: string }>({});
  const [imageCaptions, setImageCaptions] = useState<{ [key: string]: string }>({});

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#1e3a8a');
  const [newCategoryOrder, setNewCategoryOrder] = useState(100); 

  // State for in-line category editing (for name/description/order)
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);

  // State for in-line color picker visibility and value
  const [colorEditing, setColorEditing] = useState<{ id: number; color: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const adminCategoriesData = await getAdminGalleryCategories();
      const projectsData = await getProjectsWithoutGalleryAlbums();
      const projectCatId = await getGalleryCategoryIdByName('Project Sites');

      const albumsData = await getAllAlbums();
      
      setAlbums(albumsData);
      setCategories(adminCategoriesData); 
      setAvailableProjects(projectsData); 
      setProjectSitesCategoryId(projectCatId); 

      // Set a smart default order based on the current highest order + 1
      const maxOrder = adminCategoriesData.reduce((max, cat) => Math.max(max, cat.display_order), 0);
      setNewCategoryOrder(maxOrder > 0 ? maxOrder + 1 : 100);

    } catch (e) {
      toast.error("Failed to load initial data.");
    } finally {
      setLoading(false);
    }
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum || selectedFiles.length === 0) {
      toast.error('Please select an album and at least one image.');
      return;
    }
    
    toast.promise(
      (async () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const title = imageTitles[file.name] || file.name;
          const caption = imageCaptions[file.name] || '';
          await uploadImage(file, selectedAlbum, title, caption, '', i);
        }
        setSelectedFiles([]);
        setImageTitles({});
        setImageCaptions({});
        setSelectedAlbum(null);
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
    
    // Pass selectedProjectId to the createAlbum function, converting null to undefined for the function signature
    toast.promise(
      createAlbum(newAlbumName, newAlbumDescription, newAlbumCategories, selectedProjectId || undefined)
        .then(async (album) => {
          if (album) {
            setNewAlbumName('');
            setNewAlbumDescription('');
            setNewAlbumCategories([]);
            setSelectedProjectId(null); // Clear project state
            await loadData(); // Reload data to update project list
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
  
  // Handler for the Project/Album Name dropdown
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // 1. Clear previous state for a clean slate
    setNewAlbumName('');
    setSelectedProjectId(null);
    // Unselect "Project Sites" category
    setNewAlbumCategories(prevCategories => 
      projectSitesCategoryId 
        ? prevCategories.filter(id => id !== projectSitesCategoryId) 
        : prevCategories
    );

    if (value === '') { 
      // User selected the default "-- Select an option --"
      return;
    }
    
    if (value === '0') {
        // User selected "Create Custom Album"
        toast.success("Creating a Custom Album. Enter the name below.", { duration: 2500 });
        return; 
    }

    // User selected a Project ID
    const projectId = Number(value);
    const selectedProject = availableProjects.find(p => p.id === projectId);

    if (selectedProject) {
      setNewAlbumName(selectedProject.name); // Set album name to project title
      setSelectedProjectId(projectId); // Set the project ID
      
      // Auto-select "Project Sites" category if available
      if (projectSitesCategoryId) {
        setNewAlbumCategories(prevCategories => {
          if (!prevCategories.includes(projectSitesCategoryId)) {
            return [...prevCategories, projectSitesCategoryId];
          }
          return prevCategories;
        });
        toast.success(`'${selectedProject.name}' selected. 'Project Sites' category auto-selected.`, { duration: 3000 });
      }
    }
  };


  const handleEditAlbum = async (albumId: number) => {
    setLoading(true);
    try {
      const albumData = await getAlbumById(albumId);
      if (albumData) {
        setSelectedAlbumData(albumData);
        setActiveSection('edit-album');
      } else {
        toast.error('Failed to fetch album data.');
      }
    } catch (e) {
      toast.error('An error occurred while preparing to edit the album.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlbum = async () => {
    if (!selectedAlbumData) return;

    toast.promise(
      (async () => {
        const categoryIds = selectedAlbumData.categories?.map(c => c.id) || [];
        const success = await updateAlbum(
          selectedAlbumData.id,
          selectedAlbumData.name,
          selectedAlbumData.description || '',
          categoryIds
        );
        if (success) {
          await loadData();
          setActiveSection('organize-albums');
          setSelectedAlbumData(null);
          return 'Album updated successfully!';
        } else {
          throw new Error('Update failed.');
        }
      })(),
      {
        loading: 'Saving album changes...',
        success: (message) => message,
        error: 'Error updating album.',
      }
    );
  };

  const handleDeleteAlbum = (albumId: number) => {
    showConfirm(
      'Delete Album',
      'Are you sure you want to delete this album? This will also delete all images in it.',
      async () => {
        toast.promise(
          deleteAlbum(albumId).then(async (success) => {
            if (success) {
              await loadData();
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

  const handleDeleteImage = (imageId: number) => {
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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }
    
    toast.promise(
      createGalleryCategory(
        newCategoryName,
        newCategoryDescription,
        newCategoryColor,
        newCategoryOrder 
      ).then(async (newCategory) => {
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
      updateGalleryCategory(
        editingCategory.id,
        {
          name: editingCategory.name,
          description: editingCategory.description || '',
          color_class: editingCategory.color_class,
          display_order: editingCategory.display_order
        }
      ).then(async (success) => {
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
      'Are you sure you want to delete this category? The display orders of other categories will be adjusted automatically.',
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

    // Perform the swap
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
          throw new Error('Failed to update one or more categories.');
        }
      })(),
      {
        loading: 'Moving category...',
        success: (message) => message,
        error: 'Error moving category. Please try again.',
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
              onClick={() => setActiveSection('organize-albums')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'organize-albums'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Organize Albums
            </button>
            <button
              onClick={() => setActiveSection('upload-photos')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'upload-photos'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Photos
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

        {/* --- START OF LOADING OVERLAY UPDATE --- */}
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-2xl border border-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
              <p className="mt-4 text-gray-700 font-semibold">Processing...</p>
            </div>
          </div>
        )}
        {/* --- END OF LOADING OVERLAY UPDATE --- */}

        {activeSection === 'organize-albums' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Album Organizer ({albums.length} Albums)</h3>
              <button
                onClick={() => setActiveSection('upload-photos')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition shadow-md"
              >
                <i className="fas fa-upload mr-2"></i> Upload New Photos
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800">Create New Album</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Project/Album Name Dropdown (Modified to include Custom option) */}
                <div>
                    <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">Select Project Link or Custom Album</label>
                    <select
                      id="project-select"
                      onChange={handleProjectSelect}
                      // Set value to '0' for custom album, or the project ID, or '' as default
                      value={selectedProjectId === null ? '0' : selectedProjectId || ''} 
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="" disabled>-- Select an option --</option>
                      <option value="0">Create Custom Album</option>
                      {availableProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} (Link to Project)
                        </option>
                      ))}
                    </select>
                </div>

                {/* Conditional Album Name Input */}
                <input
                  type="text"
                  placeholder={selectedProjectId !== null ? 'Album name automatically set by project' : 'Custom Album Name'}
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  // Input is disabled ONLY if a Project ID is selected
                  disabled={selectedProjectId !== null} 
                  className={`border border-gray-300 rounded-md p-2 ${selectedProjectId !== null ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                />
                
                {/* Album Description Input */}
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 col-span-2"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Categories (Multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {/* Filter categories to only active ones for assignment */}
                  {categories.filter(cat => cat.is_active).map((cat) => (
                    <label 
                      key={cat.id} 
                      className={`flex items-center space-x-2 cursor-pointer p-1 rounded transition ${
                        cat.id === projectSitesCategoryId && selectedProjectId !== null 
                          ? 'bg-yellow-100 font-bold' 
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newAlbumCategories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAlbumCategories([...newAlbumCategories, cat.id]);
                          } else {
                            // Prevent unselecting "Project Sites" if a project is selected
                            if (cat.id === projectSitesCategoryId && selectedProjectId !== null) {
                              toast.error(`Cannot unselect 'Project Sites' while a project is linked.`);
                              return;
                            }
                            setNewAlbumCategories(newAlbumCategories.filter(id => id !== cat.id));
                          }
                        }}
                        className="rounded"
                        // Disable checkbox for "Project Sites" if a project is selected
                        disabled={cat.id === projectSitesCategoryId && selectedProjectId !== null} 
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreateAlbum}
                className="mt-4 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#2558a7] transition disabled:opacity-50"
                disabled={!newAlbumName.trim() || newAlbumCategories.length === 0}
              >
                Create Album
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="bg-gray-50 p-4 rounded-xl shadow-md border-t-4 border-[#1e3a8a] flex flex-col justify-between">
                  {album.cover_image_url && (
                    <img src={album.cover_image_url} alt={album.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  )}
                  <div>
                    <i className="fas fa-folder-open text-3xl text-[#1e3a8a] mb-3"></i>
                    <h4 className="font-bold text-lg text-gray-900">{album.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{album.photo_count} Photos</p>
                    {album.project_id && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                            Linked to Project ID: {album.project_id}
                        </span>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {album.categories?.map((cat) => (
                        <span key={cat.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {/* Hide Edit button if album is linked to a project */}
                    {!album.project_id && (
                      <button onClick={() => handleEditAlbum(album.id)} className="text-[#fbbf24] hover:text-[#f59e0b]" title="Edit Album">
                        <i className="fas fa-pen"></i>
                      </button>
                    )}
                    <button onClick={() => handleDeleteAlbum(album.id)} className="text-red-600 hover:text-red-900" title="Delete Album">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'upload-photos' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Upload Images to Gallery</h3>
              <button onClick={() => setActiveSection('organize-albums')} className="text-gray-500 hover:text-red-600 transition">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <label htmlFor="target-album" className="block text-sm font-medium text-gray-700 mb-1">Select Target Album</label>
                <select
                  id="target-album"
                  value={selectedAlbum || ''}
                  onChange={(e) => setSelectedAlbum(Number(e.target.value))}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                >
                  <option value="">-- Select an Album --</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.name} ({album.photo_count} photos) {album.project_id ? '[Project Album]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images to Upload</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-[#fbbf24] bg-yellow-50' : 'border-gray-400 hover:border-[#1e3a8a] hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input type="file" id="file-upload" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <i className="fas fa-cloud-upload-alt text-4xl text-[#1e3a8a] mb-2"></i>
                  <p className="text-gray-600 font-semibold">
                    Drag & drop files here, or <span className="text-[#fbbf24] underline cursor-pointer">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB per image</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-4">
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
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!selectedAlbum || selectedFiles.length === 0}
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'edit-album' && selectedAlbumData && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Edit Album: {selectedAlbumData.name}</h3>
              <button
                onClick={() => {
                  setActiveSection('organize-albums');
                  setSelectedAlbumData(null);
                }}
                className="text-gray-500 hover:text-red-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
                <input
                  type="text"
                  value={selectedAlbumData.name}
                  onChange={(e) => setSelectedAlbumData({ ...selectedAlbumData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={selectedAlbumData.description || ''}
                  onChange={(e) => setSelectedAlbumData({ ...selectedAlbumData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {/* Filter categories to only active ones for assignment */}
                  {categories.filter(cat => cat.is_active).map((cat) => (
                    <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAlbumData.categories?.some(c => c.id === cat.id) || false}
                        onChange={(e) => {
                          const currentCategories = selectedAlbumData.categories || [];
                          const categoryToToggle = categories.find(c => c.id === cat.id);
                          if (!categoryToToggle) return;
                          
                          if (e.target.checked) {
                            setSelectedAlbumData({ ...selectedAlbumData, categories: [...currentCategories, categoryToToggle] });
                          } else {
                            setSelectedAlbumData({ ...selectedAlbumData, categories: currentCategories.filter(c => c.id !== cat.id) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleUpdateAlbum} className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2558a7] transition">
                Save Album Changes
              </button>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Album Images ({selectedAlbumData.images?.length || 0})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedAlbumData.images?.map((image) => (
                  <div key={image.id} className="relative group">
                    <img src={image.thumbnail_url || image.url} alt={image.title} className="w-full h-32 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                      <button onClick={() => handleDeleteImage(image.id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{image.title}</p>
                  </div>
                ))}
              </div>
              {(!selectedAlbumData.images || selectedAlbumData.images.length === 0) && (
                <p className="text-center text-gray-500 mt-4">No images in this album yet.</p>
              )}
            </div>
          </div>
        )}

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
                    placeholder="Display Order (e.g., 100)"
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
                  <button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory} 
                    className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#2558a7] transition"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                  {editingCategory && (
                    <button onClick={() => setEditingCategory(null)} 
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* CATEGORY LIST TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> 
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        {/* IN-LINE COLOR EDITOR */}
                        <div className="relative inline-block">
                          <button 
                              onClick={() => {
                                  // Toggle color editor
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
                        {/* ACTIVE / INACTIVE TOGGLE */}
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