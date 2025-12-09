// app/components/GalleryContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import {
  getAllAlbums,
  getGalleryCategories,
  type AlbumWithCategories,
  type GalleryCategory,
} from '@/lib/gallery';

type SortOption = 'newest' | 'oldest' | 'most-photos' | 'alphabetical' | null;

export default function GalleryContent() {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithCategories | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [albums, setAlbums] = useState<AlbumWithCategories[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<AlbumWithCategories[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempCategoryFilters, setTempCategoryFilters] = useState<number[]>([]);
  const [tempSortOption, setTempSortOption] = useState<SortOption>(null);
  const [tempShowFeaturedOnly, setTempShowFeaturedOnly] = useState(false);

  // Applied filter states
  const [categoryFilters, setCategoryFilters] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [categoryFilters, sortOption, showFeaturedOnly, albums, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const [albumsData, categoriesData] = await Promise.all([
      getAllAlbums(),
      getGalleryCategories(),
    ]);
    
    // Filter to only show albums with show_on_website = true
    const visibleAlbums = albumsData.filter(album => album.show_on_website !== false);
    
    setAlbums(visibleAlbums);
    setCategories(categoriesData);
    setLoading(false);
  };

  const applyFiltersAndSort = () => {
    let result = [...albums];

    // Filter by featured
    if (showFeaturedOnly) {
      result = result.filter(album => album.is_featured === true);
    }

    // Filter by categories
    if (categoryFilters.length > 0) {
      result = result.filter(album =>
        album.categories?.some(cat => categoryFilters.includes(cat.id))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(album => 
        album.name.toLowerCase().includes(query) ||
        album.description?.toLowerCase().includes(query) ||
        album.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortOption) {
      result.sort((a, b) => {
        switch (sortOption) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'most-photos':
            return b.photo_count - a.photo_count;
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    } else {
      // Default: Featured first, then by date
      result.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    setFilteredAlbums(result);
  };

  const openFilterModal = () => {
    setTempCategoryFilters([...categoryFilters]);
    setTempSortOption(sortOption);
    setTempShowFeaturedOnly(showFeaturedOnly);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setCategoryFilters(tempCategoryFilters);
    setSortOption(tempSortOption);
    setShowFeaturedOnly(tempShowFeaturedOnly);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setTempCategoryFilters([]);
    setTempSortOption(null);
    setTempShowFeaturedOnly(false);
  };

  const clearAllFilters = () => {
    setCategoryFilters([]);
    setSortOption(null);
    setShowFeaturedOnly(false);
  };

  const toggleTempCategory = (categoryId: number) => {
    if (tempCategoryFilters.includes(categoryId)) {
      setTempCategoryFilters(tempCategoryFilters.filter(id => id !== categoryId));
    } else {
      setTempCategoryFilters([...tempCategoryFilters, categoryId]);
    }
  };

  const activeFilterCount = categoryFilters.length + (sortOption ? 1 : 0) + (showFeaturedOnly ? 1 : 0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showFilterModal) {
          setShowFilterModal(false);
        } else {
          closeModal();
        }
      } else if (selectedAlbum) {
        if (e.key === 'ArrowLeft') navigateCarousel(-1);
        if (e.key === 'ArrowRight') navigateCarousel(1);
      }
    };

    if (selectedAlbum || showFilterModal) {
      document.addEventListener('keydown', handleEscape);
      if (selectedAlbum) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!selectedAlbum) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [selectedAlbum, currentImageIndex, showFilterModal]);

  const openModal = async (album: AlbumWithCategories) => {
    // If images aren't loaded yet, fetch them
    if (!album.images || album.images.length === 0) {
      const { getAlbumById } = await import('@/lib/gallery');
      const fullAlbum = await getAlbumById(album.id);
      if (fullAlbum) {
        setSelectedAlbum(fullAlbum);
        setCurrentImageIndex(0);
      }
    } else {
      setSelectedAlbum(album);
      setCurrentImageIndex(0);
    }
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

  const getCategoryName = (catId: number) => {
    return categories.find(c => c.id === catId)?.name || '';
  };

  const getSortLabel = (sort: SortOption) => {
    const labels: Record<string, string> = {
      'newest': 'Newest First',
      'oldest': 'Oldest First',
      'most-photos': 'Most Photos',
      'alphabetical': 'A-Z'
    };
    return sort ? labels[sort] : '';
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

      {/* Filter Bar */}
      <section className="bg-white py-6 border-b border-gray-200 shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Button - Left */}
            <button
              onClick={openFilterModal}
              className="flex items-center space-x-2 px-6 py-2.5 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters & Sort</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-amber-500 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search Box - Right */}
            <input
              type="text"
              placeholder="Search albums by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              
              {showFeaturedOnly && (
                <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                  <i className="fas fa-star mr-1"></i> Featured Only
                  <button
                    onClick={() => setShowFeaturedOnly(false)}
                    className="ml-2 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <i className="fas fa-search mr-1"></i> "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {categoryFilters.map(catId => (
                <span key={catId} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {getCategoryName(catId)}
                  <button
                    onClick={() => setCategoryFilters(categoryFilters.filter(id => id !== catId))}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {sortOption && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Sort: {getSortLabel(sortOption)}
                  <button
                    onClick={() => setSortOption(null)}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Filters & Sort</h3>
                  <p className="text-sm text-gray-600 mt-1">Refine your gallery view</p>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-180px)]">
              {/* Featured Only Toggle */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Featured Albums</h4>
                </div>
                <button
                  onClick={() => setTempShowFeaturedOnly(!tempShowFeaturedOnly)}
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    tempShowFeaturedOnly
                      ? 'bg-amber-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-star text-xl"></i>
                    <span>Show Featured Albums Only</span>
                    {tempShowFeaturedOnly && <span>✓</span>}
                  </div>
                </button>
              </div>

              {/* Categories Filter */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-700 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Categories</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleTempCategory(category.id)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        tempCategoryFilters.includes(category.id)
                          ? 'text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                      style={tempCategoryFilters.includes(category.id) ? { backgroundColor: category.color_class } : {}}
                    >
                      {category.name}
                      {tempCategoryFilters.includes(category.id) && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-700 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Sort By</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { value: 'newest', label: 'Newest First', icon: '🆕' },
                    { value: 'oldest', label: 'Oldest First', icon: '📅' },
                    { value: 'most-photos', label: 'Most Photos', icon: '📸' },
                    { value: 'alphabetical', label: 'Alphabetical', icon: '🔤' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setTempSortOption(option.value as SortOption)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        tempSortOption === option.value
                          ? 'border-blue-700 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{option.label}</div>
                          </div>
                        </div>
                        {tempSortOption === option.value && (
                          <div className="text-blue-700">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl font-bold hover:from-blue-800 hover:to-blue-900 transition-all shadow-lg transform hover:scale-105"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Photo Albums
          </h2>

          {filteredAlbums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No albums found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => openModal(album)}
                  className="relative rounded-lg shadow-xl overflow-hidden bg-white cursor-pointer hover:shadow-2xl transition group"
                >
                  {/* Featured Ribbon */}
                  {album.is_featured && (
                    <div className="absolute top-0 left-0 z-10">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 shadow-lg">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-star text-sm animate-pulse"></i>
                          <span className="text-xs font-bold">FEATURED</span>
                        </div>
                      </div>
                      <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-orange-600"></div>
                    </div>
                  )}

                  <img
                    src={album.cover_image_url || 'https://placehold.co/800x600/1e3a8a/fbbf24?text=No+Image'}
                    alt={album.name}
                    className="w-full h-48 object-cover group-hover:opacity-80 transition border-b-2 border-amber-500"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{album.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {album.categories?.map((cat) => (
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
                    <p className="text-amber-500 text-sm mt-2 flex items-center">
                      <i className="fas fa-images mr-1"></i>
                      {album.photo_count} Photo{album.photo_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
              {/* Main Image Area */}
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
                  onClick={(e) => { e.stopPropagation(); navigateCarousel(-1); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#1e3a8a] bg-opacity-70 text-white p-3 rounded-full hover:bg-[#1e3a8a] z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateCarousel(1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1e3a8a] bg-opacity-70 text-white p-3 rounded-full hover:bg-[#1e3a8a] z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="mt-4 flex overflow-x-auto justify-center space-x-2 p-2 bg-white rounded-md shadow-inner">
                  {selectedAlbum.images.map((img, idx) => (
                    <img
                      key={img.id}
                      src={img.thumbnail_url || img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={(e) => { e.stopPropagation(); navigateToImage(idx); }}
                      className={`w-20 h-16 object-cover cursor-pointer transition ${
                        idx === currentImageIndex ? 'border-4 border-amber-500 opacity-100' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:w-1/4 flex flex-col bg-white overflow-hidden">
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

                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {selectedAlbum.images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={(e) => { e.stopPropagation(); navigateToImage(idx); }}
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