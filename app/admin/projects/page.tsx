// app/admin/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { supabase, Project, Client, Category } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

type Section = 'manage-projects' | 'add-project' | 'manage-categories';

export default function AdminProjects() {
  const [activeSection, setActiveSection] = useState<Section>('manage-projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [featuredCount, setFeaturedCount] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    status: 'in-progress',
    contract_value: '',
    clients_name: '',
    detailed_description: '',
    scope_of_work: '',
    summary: '',
    location: '',
    is_featured: false,
    show_on_website: true
  });

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    color_class: '#3b82f6',
    display_order: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:category_id (
            id,
            name,
            color_class
          ),
          clients:clients_name (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      
      // Count featured projects
      const featured = (data || []).filter(p => p.is_featured).length;
      setFeaturedCount(featured);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'project')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    
    // Check featured limit
    if (name === 'is_featured' && value === true && !editingProject) {
      if (featuredCount >= 3) {
        toast.error('Maximum 3 featured projects allowed!');
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check featured limit again before submit
    if (formData.is_featured && !editingProject?.is_featured && featuredCount >= 3) {
      toast.error('Maximum 3 featured projects allowed!');
      return;
    }

    // Parse scope of work (one line per item)
    const scopeArray = formData.scope_of_work
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const projectData = {
      title: formData.title,
      category_id: parseInt(formData.category_id),
      status: formData.status,
      contract_value: formData.contract_value,
      clients_name: formData.clients_name,
      detailed_description: formData.detailed_description,
      scope_of_work: scopeArray,
      summary: formData.summary || null,
      location: formData.location || null,
      is_featured: formData.is_featured,
      show_on_website: formData.show_on_website,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully!');
      }

      // Reset form and refresh
      setFormData({
        title: '',
        category_id: '',
        status: 'in-progress',
        contract_value: '',
        clients_name: '',
        detailed_description: '',
        scope_of_work: '',
        summary: '',
        location: '',
        is_featured: false,
        show_on_website: true
      });
      setEditingProject(null);
      fetchProjects();
      setActiveSection('manage-projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(`Failed to save project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category_id: project.category_id.toString(),
      status: project.status,
      contract_value: project.contract_value,
      clients_name: project.clients_name,
      detailed_description: project.detailed_description,
      scope_of_work: project.scope_of_work.join('\n'),
      summary: project.summary || '',
      location: project.location || '',
      is_featured: project.is_featured || false,
      show_on_website: project.show_on_website !== undefined ? project.show_on_website : true
    });
    setActiveSection('add-project');
  };

  const handleDelete = async (id: number) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

              if (error) throw error;
              toast.success('Project deleted successfully!');
              fetchProjects();
            } catch (error) {
              console.error('Error deleting project:', error);
              toast.error('Failed to delete project');
            }
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = {
      name: categoryFormData.name,
      description: categoryFormData.description || null,
      type: 'project',
      color_class: categoryFormData.color_class,
      display_order: parseInt(categoryFormData.display_order.toString()),
      is_active: true,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully!');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
        toast.success('Category created successfully!');
      }

      setCategoryFormData({
        name: '',
        description: '',
        color_class: '#3b82f6',
        display_order: 0
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(`Failed to save category: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      color_class: category.color_class,
      display_order: category.display_order
    });
  };

  const handleDeleteCategory = async (id: number) => {
    // Check if category is being used
    const projectsUsingCategory = projects.filter(p => p.category_id === id);
    if (projectsUsingCategory.length > 0) {
      toast.error(`Cannot delete category. ${projectsUsingCategory.length} project(s) are using it.`);
      return;
    }

    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this category?',
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

              if (error) throw error;
              toast.success('Category deleted successfully!');
              fetchCategories();
            } catch (error) {
              console.error('Error deleting category:', error);
              toast.error('Failed to delete category');
            }
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });
  };

  const moveCategoryOrder = async (categoryId: number, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    try {
      // Swap display_order values
      const currentCategory = categories[currentIndex];
      const targetCategory = categories[targetIndex];

      await supabase
        .from('categories')
        .update({ display_order: targetCategory.display_order })
        .eq('id', currentCategory.id);

      await supabase
        .from('categories')
        .update({ display_order: currentCategory.display_order })
        .eq('id', targetCategory.id);

      toast.success('Category order updated!');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category order:', error);
      toast.error('Failed to update category order');
    }
  };

  const reportingStats = {
    onSchedule: projects.filter(p => p.status === 'completed').length,
    atRisk: projects.filter(p => p.status === 'planned').length,
    completedThisYear: projects.filter(p => p.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Projects Management
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Add, edit, and track the status of all TTK infrastructure projects.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-projects')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-projects'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Edit Project Details
            </button>
            <button
              onClick={() => {
                setEditingProject(null);
                setFormData({
                  title: '',
                  category_id: '',
                  status: 'in-progress',
                  contract_value: '',
                  clients_name: '',
                  detailed_description: '',
                  scope_of_work: '',
                  summary: '',
                  location: '',
                  is_featured: false,
                  show_on_website: true
                });
                setActiveSection('add-project');
              }}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'add-project'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </button>
            <button
              onClick={() => setActiveSection('manage-categories')}
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

        {/* Manage Projects Section */}
        {activeSection === 'manage-projects' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Active & Completed Projects ({projects.length} Total)
              </h3>
              <button
                onClick={() => setActiveSection('add-project')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
              >
                <i className="fas fa-plus-circle mr-2"></i> Add New Project
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="px-6 py-3 relative">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.title}
                            {!project.show_on_website && (
                              <span className="ml-2 text-xs text-gray-500">(Hidden)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.category?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.clients?.name || project.clients_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : project.status === 'in-progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {project.is_featured && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                <i className="fas fa-star mr-1"></i> Featured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-[#1e3a8a] hover:text-blue-700"
                              title="Edit Details"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Project"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-sm text-gray-500 text-right">
                  Showing 1 to {projects.length} of {projects.length} total projects.
                </p>
              </>
            )}
          </div>
        )}

        {/* Add/Edit Project Section */}
        {activeSection === 'add-project' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                {editingProject ? 'Edit Project' : 'Add a New Project'}
              </h3>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setActiveSection('manage-projects');
                }}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label htmlFor="clients_name" className="block text-sm font-medium text-gray-700">
                    Client Name *
                  </label>
                  <select
                    id="clients_name"
                    name="clients_name"
                    value={formData.clients_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                    Project Category *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Current Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned/Upcoming</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contract_value" className="block text-sm font-medium text-gray-700">
                    Contract Value *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="text"
                      id="contract_value"
                      name="contract_value"
                      value={formData.contract_value}
                      onChange={handleInputChange}
                      placeholder="450 Cr"
                      required
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Madurai-Dindigul"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                  Project Summary (For Website)
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                ></textarea>
              </div>

              <div>
                <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700">
                  Detailed Description *
                </label>
                <textarea
                  id="detailed_description"
                  name="detailed_description"
                  value={formData.detailed_description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                ></textarea>
              </div>

              <div>
                <label htmlFor="scope_of_work" className="block text-sm font-medium text-gray-700">
                  Scope of Work (One per line) *
                </label>
                <textarea
                  id="scope_of_work"
                  name="scope_of_work"
                  value={formData.scope_of_work}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  placeholder="e.g., Excavation and foundation work.&#10;Construction of 4-lane flyover."
                ></textarea>
              </div>

              {/* Featured Toggle with Counter */}
              <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="flex items-center cursor-pointer flex-1">
                  <i className="fas fa-star text-amber-500 mr-2"></i>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Mark as Featured Project</span>
                    <p className="text-xs text-gray-600">Featured projects appear first and have a special badge</p>
                  </div>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Featured Projects:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    featuredCount >= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {featuredCount}/3
                  </span>
                </div>
              </div>

              {/* Show on Website Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  id="show_on_website"
                  name="show_on_website"
                  checked={formData.show_on_website}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="show_on_website" className="flex items-center cursor-pointer flex-1">
                  <i className="fas fa-globe text-blue-500 mr-2"></i>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Show on Website</span>
                    <p className="text-xs text-gray-600">Uncheck to hide this project from the public website</p>
                  </div>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300"
                >
                  {editingProject ? 'Update Project' : 'Save New Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Manage Categories Section */}
        {activeSection === 'manage-categories' && (
          <div className="space-y-6">
            {/* Add/Edit Category Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cat_name" className="block text-sm font-medium text-gray-700">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="cat_name"
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                      placeholder="e.g., Highways & Roads"
                    />
                  </div>

                  <div>
                    <label htmlFor="cat_color" className="block text-sm font-medium text-gray-700">
                      Category Color *
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="color"
                        id="cat_color"
                        name="color_class"
                        value={categoryFormData.color_class}
                        onChange={handleCategoryInputChange}
                        required
                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={categoryFormData.color_class}
                        onChange={(e) => setCategoryFormData({...categoryFormData, color_class: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cat_order" className="block text-sm font-medium text-gray-700">
                      Display Order *
                    </label>
                    <input
                      type="number"
                      id="cat_order"
                      name="display_order"
                      value={categoryFormData.display_order}
                      onChange={handleCategoryInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cat_description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="cat_description"
                    name="description"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Brief description of this category"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold shadow-md hover:bg-[#2558a7] transition duration-300"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryFormData({
                          name: '',
                          description: '',
                          color_class: '#3b82f6',
                          display_order: 0
                        });
                      }}
                      className="px-6 bg-gray-300 text-gray-700 py-2.5 rounded-md font-bold hover:bg-gray-400 transition duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Categories List */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Existing Categories ({categories.length})
              </h3>

              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: category.color_class }}
                      ></div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order: {category.display_order}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Move Up/Down buttons */}
                      <button
                        onClick={() => moveCategoryOrder(category.id, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded ${
                          index === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Move Up"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <button
                        onClick={() => moveCategoryOrder(category.id, 'down')}
                        disabled={index === categories.length - 1}
                        className={`p-2 rounded ${
                          index === categories.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Move Down"
                      >
                        <i className="fas fa-arrow-down"></i>
                      </button>

                      {/* Edit/Delete buttons */}
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded"
                        title="Edit Category"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Category"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No categories found. Add your first category above.
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Projects Management Version.
        </footer>
      </div>
    </div>
  );
}