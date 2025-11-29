// app/admin/gallery/page.tsx
'use client';

import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

type Section = 'organize-albums' | 'upload-photos' | 'delete-images';

export default function AdminGallery() {
  const [activeSection, setActiveSection] = useState<Section>('organize-albums');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [showNewAlbumField, setShowNewAlbumField] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Mock data - will be replaced with Supabase data later
  const albums = [
    {
      id: 1,
      name: 'Madurai Ring Road Bridge',
      photoCount: 45,
      lastUpdated: '2025-11-10',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Office Inauguration 2024',
      photoCount: 12,
      lastUpdated: '2024-03-22',
      color: 'amber'
    },
    {
      id: 3,
      name: 'Residential Township Phase I',
      photoCount: 98,
      lastUpdated: '2025-09-01',
      color: 'green'
    }
  ];

  const handleAlbumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAlbum(value);
    setShowNewAlbumField(value === 'new');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
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
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Photos uploaded! (This will be connected to Supabase)');
  };

  const getBorderColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-[#1e3a8a]',
      amber: 'border-[#fbbf24]',
      green: 'border-green-500'
    };
    return colors[color] || 'border-gray-300';
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-[#1e3a8a]',
      amber: 'text-[#fbbf24]',
      green: 'text-green-500'
    };
    return colors[color] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Gallery Management
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Control the visual content displayed on the website gallery.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
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
              onClick={() => setActiveSection('delete-images')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'delete-images'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Delete Images
            </button>
          </nav>
        </div>

        {/* Organize Albums Section */}
        {activeSection === 'organize-albums' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Album Organizer ({albums.length} Albums)
              </h3>
              <button
                onClick={() => setActiveSection('upload-photos')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
              >
                <i className="fas fa-upload mr-2"></i> Upload New Photos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className={`bg-gray-50 p-4 rounded-xl shadow-md border-t-4 ${getBorderColor(
                    album.color
                  )} flex flex-col justify-between`}
                >
                  <div>
                    <i className={`fas fa-folder-open text-3xl ${getIconColor(album.color)} mb-3`}></i>
                    <h4 className="font-bold text-lg text-gray-900">{album.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {album.photoCount} Photos | Last Updated: {album.lastUpdated}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="text-[#fbbf24] hover:text-[#f59e0b]" title="Edit Album Name">
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Delete Album (Caution)">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 ml-auto" title="View Album Content">
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              ))}

              {/* Create New Album Card */}
              <div className="bg-white p-4 rounded-xl shadow-md border-2 border-gray-300 border-dashed hover:border-[#1e3a8a] transition duration-300 flex items-center justify-center">
                <button className="text-gray-500 hover:text-[#1e3a8a] font-semibold">
                  <i className="fas fa-plus-circle text-2xl mr-2"></i> Create New Album
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Photos Section */}
        {activeSection === 'upload-photos' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Upload Images to Gallery</h3>
              <button
                onClick={() => setActiveSection('organize-albums')}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <label htmlFor="target-album" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Target Album
                </label>
                <select
                  id="target-album"
                  name="target-album"
                  value={selectedAlbum}
                  onChange={handleAlbumChange}
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                >
                  <option value="">-- Select an existing Album --</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id.toString()}>
                      {album.name}
                    </option>
                  ))}
                  <option value="new">-- Create New Album --</option>
                </select>
              </div>

              {showNewAlbumField && (
                <div>
                  <label htmlFor="new-album-name" className="block text-sm font-medium text-gray-700 mb-1">
                    New Album Name
                  </label>
                  <input
                    type="text"
                    id="new-album-name"
                    name="new-album-name"
                    placeholder="Enter name for the new project album"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Images to Upload (.jpg, .png)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#fbbf24] bg-yellow-50'
                      : 'border-gray-400 hover:border-[#1e3a8a] hover:bg-gray-50'
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
                    name="gallery-images[]"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <p className="text-gray-600 font-semibold mb-2">
                    <i className="fas fa-cloud-upload-alt text-4xl text-[#1e3a8a] mb-2"></i>
                  </p>
                  <p className="text-gray-600 font-semibold">
                    Drag & drop files here, or{' '}
                    <span className="text-[#fbbf24] underline cursor-pointer">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Max 10 files per upload. Max size 5MB each.</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    {selectedFiles.map((file, index) => (
                      <p key={index} className="text-green-700">
                        <i className="fas fa-check-circle mr-2"></i> {file.name} (
                        {(file.size / 1024).toFixed(2)} KB)
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300"
                >
                  Start Upload
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Images Section */}
        {activeSection === 'delete-images' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              Bulk Delete and Cleanup
            </h3>

            <p className="text-red-700 font-medium bg-red-50 p-3 rounded-lg border-l-4 border-red-500 mb-6">
              <i className="fas fa-exclamation-triangle mr-2"></i> Warning: Deleting photos is permanent. Please
              review carefully.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by Album Name or File Tag..."
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border p-4 rounded-lg bg-gray-50">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://placehold.co/150x100/94a3b8/FFFFFF?text=Photo+1"
                    className="w-full h-auto rounded-lg"
                    alt="Gallery Photo"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">bridge_p45.jpg</p>
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://placehold.co/150x100/a3e635/FFFFFF?text=Photo+2"
                    className="w-full h-auto rounded-lg"
                    alt="Gallery Photo"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">township_012.jpg</p>
                </div>

                <p className="col-span-full text-center text-sm text-gray-500 mt-4">
                  155 total images found. Select images above to delete them permanently.
                </p>
              </div>

              <div className="pt-4">
                <button
                  className="bg-red-600 text-white px-6 py-2.5 rounded-md font-bold text-lg hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Delete Selected (0)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Gallery Management Version.
        </footer>
      </div>
    </div>
  );
}