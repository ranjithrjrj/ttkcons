// app/admin/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

type Section = 'manage-clients' | 'add-client' | 'edit-client';

interface Client {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  projects_count: number;
  is_active: boolean;
  client_type: 'government' | 'private';
}

export default function AdminClients() {
  const [activeSection, setActiveSection] = useState<Section>('manage-clients');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string; logoUrl?: string } | null>(null);

  // Fetch clients from Supabase
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error(error.message || 'Error loading clients. Please try again.');
    } finally {
      setLoading(false);
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

      console.log('Uploading logo to path:', filePath);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Try to upload directly without checking buckets first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // Provide specific error messages
        if (uploadError.message.includes('not found')) {
          toast.error('Storage bucket not found. Please check Supabase configuration.');
        } else if (uploadError.message.includes('policy')) {
          toast.error('Permission denied. Please check storage policies.');
        } else {
          toast.error(`Upload failed: ${uploadError.message}`);
        }
        return null;
      }

      console.log('Upload successful:', uploadData);

      // Generate public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);
      
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
    
    // Validate logo
    if (!selectedFile) {
      toast.error('Please select a logo image');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Adding client...');
    setLoading(true);

    try {
      // Upload logo first
      console.log('Starting logo upload...');
      const logoUrl = await uploadLogo(selectedFile);
      
      if (!logoUrl) {
        toast.dismiss(loadingToast);
        toast.error('Failed to upload logo. Please check console for details.');
        setLoading(false);
        return;
      }

      console.log('Logo uploaded, URL:', logoUrl);

      // Prepare client data
      const clientData = {
        name: formData.get('client-name') as string,
        description: formData.get('description') as string || null,
        projects_count: parseInt(formData.get('projects-count') as string) || 0,
        is_active: formData.get('status') === 'active',
        client_type: formData.get('client-type') as 'government' | 'private',
        logo_url: logoUrl,
      };

      console.log('Inserting client data:', clientData);

      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();

      if (error) {
        console.error('Database error:', error);
        toast.dismiss(loadingToast);
        toast.error(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('Client created successfully:', data);
      
      toast.dismiss(loadingToast);
      toast.success('Client added successfully! 🎉');
      
      setActiveSection('manage-clients');
      setLogoPreview('');
      setSelectedFile(null);
      fetchClients();
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Error adding client. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setLogoPreview(client.logo_url || '');
    setActiveSection('edit-client');
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingClient) return;

    const formData = new FormData(e.currentTarget);
    const loadingToast = toast.loading('Updating client...');
    setLoading(true);

    try {
      let logoUrl = editingClient.logo_url;

      // Upload new logo if selected
      if (selectedFile) {
        console.log('Uploading new logo...');
        const newLogoUrl = await uploadLogo(selectedFile);
        
        if (!newLogoUrl) {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload new logo.');
          setLoading(false);
          return;
        }

        // Delete old logo if exists
        if (editingClient.logo_url) {
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
        projects_count: parseInt(formData.get('projects-count') as string) || 0,
        is_active: formData.get('status') === 'active',
        client_type: formData.get('client-type') as 'government' | 'private',
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id);

      if (error) throw error;

      toast.dismiss(loadingToast);
      toast.success('Client updated successfully! 🎉');
      
      setActiveSection('manage-clients');
      setLogoPreview('');
      setSelectedFile(null);
      setEditingClient(null);
      fetchClients();
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Error updating client.');
    } finally {
      setLoading(false);
    }
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

      // Delete logo from storage if it exists
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

      // Delete from database
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
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Clients Management</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage client information and logos displayed on the website.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
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
            <button
              onClick={() => {
                setEditingClient(null);
                setLogoPreview('');
                setSelectedFile(null);
                setActiveSection('add-client');
              }}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'add-client'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add New Client
            </button>
            {activeSection === 'edit-client' && (
              <button
                className="pb-4 px-1 border-b-2 border-[#fbbf24] text-[#1e3a8a] font-semibold text-sm"
              >
                Edit Client
              </button>
            )}
          </nav>
        </div>

        {/* Manage Clients Section */}
        {activeSection === 'manage-clients' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Client List ({clients.length} Total)
              </h3>
              <button
                onClick={() => setActiveSection('add-client')}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-[#1e3a8a] hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-bold text-lg text-gray-900">{client.name}</h4>
                          {client.is_active ? (
                            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                          {client.client_type === 'government' && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Govt
                            </span>
                          )}
                        </div>
                        {client.description && (
                          <p className="text-sm text-gray-600 mb-2">{client.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          <i className="fas fa-project-diagram mr-1"></i>
                          {client.projects_count} Projects
                        </p>
                      </div>
                      {client.logo_url && (
                        <img
                          src={client.logo_url}
                          alt={`${client.name} logo`}
                          className="h-12 w-auto ml-4 filter grayscale opacity-70"
                        />
                      )}
                    </div>
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                      <button 
                        className="flex-1 text-[#1e3a8a] hover:bg-blue-50 py-2 rounded transition"
                        onClick={() => handleEdit(client)}
                      >
                        <i className="fas fa-edit mr-1"></i> Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(client.id, client.name, client.logo_url)}
                        className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded transition"
                        disabled={loading}
                      >
                        <i className="fas fa-trash-alt mr-1"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add New Client Section */}
        {activeSection === 'add-client' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Add New Client</h3>
              <button
                onClick={() => {
                  setActiveSection('manage-clients');
                  setLogoPreview('');
                  setSelectedFile(null);
                }}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    name="client-name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="e.g., National Highways Authority of India"
                  />
                </div>

                <div>
                  <label htmlFor="client-type" className="block text-sm font-medium text-gray-700">
                    Client Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="client-type"
                    name="client-type"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="government">Government / PSU</option>
                    <option value="private">Private Sector</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Government clients appear in the "Principal Government Clientele" section
                  </p>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="active">Active (Visible on website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Brief description of the client relationship and work done..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    This description will appear in the client modal on the website
                  </p>
                </div>

                <div>
                  <label htmlFor="projects-count" className="block text-sm font-medium text-gray-700">
                    Number of Projects Completed
                  </label>
                  <input
                    type="number"
                    id="projects-count"
                    name="projects-count"
                    min="0"
                    defaultValue="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Displayed as "{'{count}'} Projects Completed" on the website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Choose File
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
                          <i className="fas fa-check-circle"></i> Logo selected
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended: PNG or SVG with transparent background, max 500KB
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    'Save Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Clients Management Version.
        </footer>
      </div>

      {/* Edit Client Section */}
      {activeSection === 'edit-client' && editingClient && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-blue-600">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Edit Client</h3>
              <button
                onClick={() => {
                  setActiveSection('manage-clients');
                  setEditingClient(null);
                  setLogoPreview('');
                  setSelectedFile(null);
                }}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="edit-client-name" className="block text-sm font-medium text-gray-700">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-client-name"
                    name="client-name"
                    required
                    defaultValue={editingClient.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label htmlFor="edit-client-type" className="block text-sm font-medium text-gray-700">
                    Client Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-client-type"
                    name="client-type"
                    required
                    defaultValue={editingClient.client_type}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="government">Government / PSU</option>
                    <option value="private">Private Sector</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    defaultValue={editingClient.is_active ? 'active' : 'inactive'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="active">Active (Visible on website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    rows={3}
                    defaultValue={editingClient.description || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="edit-projects-count" className="block text-sm font-medium text-gray-700">
                    Number of Projects Completed
                  </label>
                  <input
                    type="number"
                    id="edit-projects-count"
                    name="projects-count"
                    min="0"
                    defaultValue={editingClient.projects_count}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Logo (Optional - leave empty to keep current)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="edit-logo-upload"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Change Logo
                    </label>
                    <input
                      type="file"
                      id="edit-logo-upload"
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
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Updating...
                    </>
                  ) : (
                    'Update Client'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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