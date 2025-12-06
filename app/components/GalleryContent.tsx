// app/components/GalleryContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  getAllAlbums,
  getGalleryCategories,
  getAlbumsByCategory,
  type AlbumWithCategories,
  type GalleryCategory,
  type GalleryImage,
} from '@/lib/gallery';

export default function GalleryContent() {
  const [filter, setFilter] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithCategories | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [albums, setAlbums] = useState<AlbumWithCategories[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<AlbumWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAlbums();
  }, [filter, albums]);

  const loadData = async () => {
    setLoading(true);
    const [albumsData, categoriesData] = await Promise.all([
      getAllAlbums(),
      getGalleryCategories(),
    ]);
    setAlbums(albumsData);
    setCategories(categoriesData);
    setLoading(false);
  };

  const filterAlbums = () => {
    if (filter === 'all') {
      setFilteredAlbums(albums);
    } else {
      const categoryId = parseInt(filter);
      const filtered = albums.filter((album) =>
        album.categories?.some((cat) => cat.id === categoryId)
      );
      setFilteredAlbums(filtered);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (selectedAlbum) {
        if (e.key === 'ArrowLeft') navigateCarousel(-1);
        if (e.key === 'ArrowRight') navigateCarousel(1);
      }
    };

    if (selectedAlbum) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [selectedAlbum, currentImageIndex]);

  const openModal = (album: AlbumWithCategories) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
  };

  const navigateCarousel = (direction: number) => {
    if (!selectedAlbum || !selectedAlbum.images) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = selectedAlbum.images.length - 1;
    if (newIndex >= selectedAlbum.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  const navigateToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            Our Complete Photo Gallery
          </h1>
          <p className="text-xl font-light max-w-2xl">
            Showcasing the quality of our work, the professionalism of our team, and the culture of TTK Constructions.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Filter by Category
          </h2>

          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`font-semibold py-2 px-6 rounded-md transition mb-2 ${
                filter === 'all'
                  ? 'bg-amber-500 text-[#1e3a8a]'
                  : 'bg-gray-300 text-gray-900 hover:bg-amber-500 hover:text-gray-900'
              }`}
            >
              All Images
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id.toString())}
                className={`font-semibold py-2 px-6 rounded-md transition mb-2 ${
                  filter === cat.id.toString()
                    ? 'bg-amber-500 text-[#1e3a8a]'
                    : 'bg-gray-300 text-gray-900 hover:bg-amber-500 hover:text-gray-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => openModal(album)}
                className="rounded-lg shadow-xl overflow-hidden bg-white cursor-pointer hover:shadow-2xl transition"
              >
                <img
                  src={album.cover_image_url || 'https://placehold.co/800x600/1e3a8a/fbbf24?text=No+Image'}
                  alt={album.name}
                  className="w-full h-48 object-cover hover:opacity-80 transition border-b-2 border-amber-500"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{album.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {album.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-amber-500 text-sm mt-2">
                    {album.photo_count} Photo{album.photo_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredAlbums.length === 0 && (
            <p className="text-center text-xl text-gray-500 mt-10">
              No albums found for this category. Please try a different filter.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedAlbum && selectedAlbum.images && selectedAlbum.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full h-[90vh] flex flex-col max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2 bg-gray-100 border-b">
              <button onClick={closeModal} className="text-gray-900 text-3xl hover:text-amber-500">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              {/* Main Image Area (Left Side - 3/4 width) */}
              <div className="md:w-3/4 flex flex-col bg-gray-200 relative p-2 md:p-4">
                <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                  <img
                    src={selectedAlbum.images[currentImageIndex].url}
                    alt={selectedAlbum.images[currentImageIndex].title}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  {selectedAlbum.images[currentImageIndex].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                      {selectedAlbum.images[currentImageIndex].caption}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateCarousel(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e3a8a] bg-opacity-70 text-white p-3 rounded-full hover:bg-[#1e3a8a]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateCarousel(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1e3a8a] bg-opacity-70 text-white p-3 rounded-full hover:bg-[#1e3a8a]"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="mt-4 flex overflow-x-auto justify-center space-x-2 p-2 bg-white rounded-md shadow-inner">
                  {selectedAlbum.images.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.thumbnail_url || img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => navigateToImage(idx)}
                      className={`w-20 h-16 object-cover cursor-pointer transition ${
                        idx === currentImageIndex ? 'border-4 border-amber-500 opacity-100' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar with Image List (Right Side - 1/4 width) */}
              <div className="md:w-1/4 flex flex-col bg-white overflow-hidden">
                {/* Album Info Header */}
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">{selectedAlbum.name}</h2>
                  <p className="text-sm text-gray-600">{selectedAlbum.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedAlbum.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedAlbum.images.length} image{selectedAlbum.images.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Vertical Image List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {selectedAlbum.images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => navigateToImage(idx)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                        idx === currentImageIndex
                          ? 'border-amber-500 shadow-lg'
                          : 'border-gray-300 hover:border-amber-400'
                      }`}
                    >
                      <img
                        src={img.thumbnail_url || img.url}
                        alt={img.title}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2 bg-white">
                        <p className="text-sm font-semibold text-gray-900 truncate">{img.title}</p>
                        {img.caption && (
                          <p className="text-xs text-gray-600 truncate">{img.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="p-4 border-t bg-gray-50">
                  <Link
                    href={selectedAlbum.categories?.some(cat => cat.name.includes('Project')) ? '/projects' : '/contact'}
                    className="block w-full text-center bg-blue-900 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800 transition"
                  >
                    {selectedAlbum.categories?.some(cat => cat.name.includes('Project'))
                      ? 'View Related Projects →'
                      : 'Contact Us →'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}