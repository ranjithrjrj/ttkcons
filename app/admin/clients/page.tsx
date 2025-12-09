// app/admin/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

type Section = 'manage-clients' | 'add-client';

interface Client {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  projects_count: number;
  completed_count?: number;
  in_progress_count?: number;
  planned_count?: number;
  is_active: boolean;
  client_type: 'government' | 'private';
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
  color_class: string;
}

export default function AdminClients() {
  const [activeSection, setActiveSection] = useState<Section>('manage-clients');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string; logoUrl?: string } | null>(null);

  useEffect(() => {
    fetchClients();
    fetchCategories();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Fetch project counts by status for each client
      const clientsWithCounts = await Promise.all(
        (clientsData || []).map(async (client) => {
          // Get all projects for this client
          const { data: projects, error } = await supabase
            .from('projects')
            .select('status')
            .eq('clients_name', client.id);

          if (error) {
            console.error('Error fetching projects:', error);
            return {
              ...client,
              projects_count: 0,
              completed_count: 0,
              in_progress_count: 0,
              planned_count: 0
            };
          }

          const completed = projects?.filter(p => p.status === 'completed').length || 0;
          const inProgress = projects?.filter(p => p.status === 'in-progress').length || 0;
          const planned = projects?.filter(p => p.status === 'planned').length || 0;
          
          return {
            ...client,
            projects_count: projects?.length || 0,
            completed_count: completed,
            in_progress_count: inProgress,
            planned_count: planned
          };
        })
      );

      setClients(clientsWithCounts);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error(error.message || 'Error loading clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color_class')
        .eq('type', 'project')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `client-logos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('not found')) {
          toast.error('Storage bucket not found. Please check Supabase configuration.');
        } else if (uploadError.message.includes('policy')) {
          toast.error('Permission denied. Please check storage policies.');
        } else {
          toast.error(`Upload failed: ${uploadError.message}`);
        }
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);
      
      if (!publicUrl) {
        toast.error('Failed to generate public URL');
        return null;
      }

      toast.success('Logo uploaded successfully!');
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error(error.message || 'Error uploading logo. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    if (!selectedFile) {
      toast.error('Please select a logo image');
      return;
    }

    const loadingToast = toast.loading(editingClient ? 'Updating client...' : 'Adding client...');
    setLoading(true);

    try {
      let logoUrl = editingClient?.logo_url;

      // Upload new logo if selected
      if (selectedFile) {
        const newLogoUrl = await uploadLogo(selectedFile);
        
        if (!newLogoUrl) {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload logo.');
          setLoading(false);
          return;
        }

        // Delete old logo if editing and has old logo
        if (editingClient?.logo_url) {
          try {
            const urlParts = editingClient.logo_url.split('/storage/v1/object/public/public-assets/');
            if (urlParts.length > 1) {
              const filePath = urlParts[1];
              await supabase.storage.from('public-assets').remove([filePath]);
            }
          } catch (err) {
            console.error('Error deleting old logo:', err);
          }
        }

        logoUrl = newLogoUrl;
      }

      const clientData = {
        name: formData.get('client-name') as string,
        description: formData.get('description') as string || null,
        is_active: formData.get('status') === 'active',
        client_type: formData.get('client-type') as 'government' | 'private',
        category_id: formData.get('category') ? parseInt(formData.get('category') as string) : null,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      };

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id);

        if (error) throw error;
        toast.dismiss(loadingToast);
        toast.success('Client updated successfully! 🎉');
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([clientData]);

        if (error) throw error;
        toast.dismiss(loadingToast);
        toast.success('Client added successfully! 🎉');
      }
      
      setActiveSection('manage-clients');
      setLogoPreview('');
      setSelectedFile(null);
      setEditingClient(null);
      fetchClients();
      
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Error saving client.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setLogoPreview(client.logo_url || '');
    setSelectedFile(null);
    setActiveSection('add-client');
  };

  const confirmDelete = (id: string, name: string, logoUrl?: string) => {
    setClientToDelete({ id, name, logoUrl });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    const loadingToast = toast.loading('Deleting client...');
    setShowDeleteModal(false);

    try {
      setLoading(true);

      if (clientToDelete.logoUrl) {
        try {
          const urlParts = clientToDelete.logoUrl.split('/storage/v1/object/public/public-assets/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from('public-assets').remove([filePath]);
          }
        } catch (storageErr) {
          console.error('Error deleting logo:', storageErr);
        }
      }

      const { error } = await supabase.from('clients').delete().eq('id', clientToDelete.id);

      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success('Client deleted successfully!');
      setClientToDelete(null);
      fetchClients();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Error deleting client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1e3a8a',
            border: '2px solid #fbbf24',
            padding: '16px',
            fontWeight: '600',
          },
        }}
      />
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Clients Management</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage client information and logos displayed on the website.
            </p>
          </div>
        </header>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-clients')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-clients'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Clients
            </button>
            {activeSection === 'add-client' && (
              <button
                className="pb-4 px-1 border-b-2 border-[#fbbf24] text-[#1e3a8a] font-semibold text-sm"
              >
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </button>
            )}
          </nav>
        </div>

        {activeSection === 'manage-clients' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Client List ({clients.length} Total)
              </h3>
              <button
                onClick={() => {
                  setEditingClient(null);
                  setLogoPreview('');
                  setSelectedFile(null);
                  setActiveSection('add-client');
                }}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
              >
                <i className="fas fa-plus-circle mr-2"></i> Add New Client
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]"></i>
                <p className="mt-4 text-gray-600">Loading clients...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-users text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">No clients added yet.</p>
                <button
                  onClick={() => setActiveSection('add-client')}
                  className="mt-4 text-[#1e3a8a] hover:underline"
                >
                  Add your first client →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Logo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projects
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.logo_url ? (
                            <img
                              src={client.logo_url}
                              alt={`${client.name} logo`}
                              className="h-10 w-auto filter grayscale opacity-70"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                              <i className="fas fa-building text-gray-400"></i>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          {client.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{client.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.client_type === 'government' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {client.client_type === 'government' ? 'Government' : 'Private'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-900 mr-2">{client.projects_count}</span>
                              <span className="text-gray-500">Total</span>
                            </div>
                            {client.projects_count > 0 && (
                              <div className="text-xs space-y-0.5">
                                {client.completed_count! > 0 && (
                                  <div className="flex items-center text-green-600">
                                    <i className="fas fa-check-circle mr-1"></i>
                                    {client.completed_count} Completed
                                  </div>
                                )}
                                {client.in_progress_count! > 0 && (
                                  <div className="flex items-center text-yellow-600">
                                    <i className="fas fa-spinner mr-1"></i>
                                    {client.in_progress_count} In Progress
                                  </div>
                                )}
                                {client.planned_count! > 0 && (
                                  <div className="flex items-center text-blue-600">
                                    <i className="fas fa-clock mr-1"></i>
                                    {client.planned_count} Planned
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                          <button 
                            className="text-[#1e3a8a] hover:text-blue-700"
                            onClick={() => handleEdit(client)}
                            title="Edit Client"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => confirmDelete(client.id, client.name, client.logo_url)}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete Client"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'add-client' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button
                onClick={() => {
                  setActiveSection('manage-clients');
                  setLogoPreview('');
                  setSelectedFile(null);
                  setEditingClient(null);
                }}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    name="client-name"
                    required
                    defaultValue={editingClient?.name || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="e.g., National Highways Authority of India"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="client-type" className="block text-sm font-medium text-gray-700">
                      Client Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="client-type"
                      name="client-type"
                      required
                      defaultValue={editingClient?.client_type || 'government'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    >
                      <option value="government">Government / PSU</option>
                      <option value="private">Private Sector</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      defaultValue={editingClient?.category_id || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={editingClient?.is_active ? 'active' : 'active'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={editingClient?.description || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Brief description of the client relationship and work done..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    This description will appear in the client modal on the website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        {editingClient ? 'Change Logo' : 'Choose File'}
                      </label>
                      <input
                        type="file"
                        id="logo-upload"
                        name="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      {logoPreview && (
                        <div className="flex items-center">
                          <img src={logoPreview} alt="Logo preview" className="h-12 w-auto border rounded" />
                          <span className="ml-2 text-sm text-green-600">
                            <i className="fas fa-check-circle"></i> {selectedFile ? 'New logo selected' : 'Current logo'}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading || (!editingClient && !selectedFile)}
                      className="bg-[#1e3a8a] text-white px-6 py-2 rounded-md font-bold shadow-md hover:bg-[#2558a7] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          {editingClient ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          {editingClient ? 'Update Client' : 'Save Client'}
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {editingClient 
                      ? 'Leave empty to keep current logo. Recommended: PNG or SVG with transparent background, max 500KB'
                      : 'Recommended: PNG or SVG with transparent background, max 500KB'
                    }
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Clients Management Version.
        </footer>
      </div>

      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Client</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{clientToDelete.name}</strong>? This action cannot be undone and will also delete the client's logo.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClientToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}