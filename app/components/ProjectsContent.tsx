// components/ProjectsContent.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectModal from './ProjectModal';
import { supabase, Project, Category } from '@/lib/supabase';
import { X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProjectCard extends Project {
  image: string;
}

type SortField = 'alphabetical' | 'category' | 'status' | 'client' | null;
type SortDirection = 'asc' | 'desc';

export default function ProjectsContent() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Temporary filter state (for modal)
  const [tempCategoryFilters, setTempCategoryFilters] = useState<string[]>([]);
  const [tempStatusFilters, setTempStatusFilters] = useState<string[]>([]);
  const [tempClientFilters, setTempClientFilters] = useState<string[]>([]);
  const [tempSortField, setTempSortField] = useState<SortField>(null);
  const [tempSortDirection, setTempSortDirection] = useState<SortDirection>('asc');

  // Applied filter state
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [clientFilters, setClientFilters] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

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
        .eq('show_on_website', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProjects: ProjectCard[] = (data || []).map((project) => ({
        ...project,
        image: `https://placehold.co/600x400/1d4ed8/FFFFFF?text=${encodeURIComponent(project.title)}`,
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const uniqueClients = Array.from(new Set(projects.map(p => p.clients?.name || p.clients_name).filter(Boolean)));
  const usedCategoryIds = new Set(projects.map(p => p.category_id));
  const categoriesWithProjects = categories.filter(cat => usedCategoryIds.has(cat.id));
  const statuses = ['in-progress', 'completed', 'planned'];

  // Apply filters and search
  let filteredProjects = projects.filter((project) => {
    // Category filter
    if (categoryFilters.length > 0 && !categoryFilters.includes(project.category?.name || '')) {
      return false;
    }

    // Status filter
    if (statusFilters.length > 0 && !statusFilters.includes(project.status)) {
      return false;
    }

    // Client filter
    const projectClient = project.clients?.name || project.clients_name;
    if (clientFilters.length > 0 && !clientFilters.includes(projectClient || '')) {
      return false;
    }

    // Search filter
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.location?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Apply sorting
  if (sortField) {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      let compareA: string = '';
      let compareB: string = '';

      switch (sortField) {
        case 'alphabetical':
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case 'category':
          compareA = a.category?.name?.toLowerCase() || '';
          compareB = b.category?.name?.toLowerCase() || '';
          break;
        case 'status':
          compareA = a.status.toLowerCase();
          compareB = b.status.toLowerCase();
          break;
        case 'client':
          compareA = (a.clients?.name || a.clients_name || '').toLowerCase();
          compareB = (b.clients?.name || b.clients_name || '').toLowerCase();
          break;
      }

      if (sortDirection === 'asc') {
        return compareA.localeCompare(compareB);
      } else {
        return compareB.localeCompare(compareA);
      }
    });
  }

  const openFilterModal = () => {
    setTempCategoryFilters([...categoryFilters]);
    setTempStatusFilters([...statusFilters]);
    setTempClientFilters([...clientFilters]);
    setTempSortField(sortField);
    setTempSortDirection(sortDirection);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setCategoryFilters(tempCategoryFilters);
    setStatusFilters(tempStatusFilters);
    setClientFilters(tempClientFilters);
    setSortField(tempSortField);
    setSortDirection(tempSortDirection);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setTempCategoryFilters([]);
    setTempStatusFilters([]);
    setTempClientFilters([]);
    setTempSortField(null);
    setTempSortDirection('asc');
  };

  const clearAllFilters = () => {
    setCategoryFilters([]);
    setStatusFilters([]);
    setClientFilters([]);
    setSortField(null);
    setSortDirection('asc');
    setShowFilterModal(false);
  };

  const toggleTempFilter = (filterType: 'category' | 'status' | 'client', value: string) => {
    if (filterType === 'category') {
      if (tempCategoryFilters.includes(value)) {
        setTempCategoryFilters(tempCategoryFilters.filter(f => f !== value));
      } else {
        setTempCategoryFilters([...tempCategoryFilters, value]);
      }
    } else if (filterType === 'status') {
      if (tempStatusFilters.includes(value)) {
        setTempStatusFilters(tempStatusFilters.filter(f => f !== value));
      } else {
        setTempStatusFilters([...tempStatusFilters, value]);
      }
    } else if (filterType === 'client') {
      if (tempClientFilters.includes(value)) {
        setTempClientFilters(tempClientFilters.filter(f => f !== value));
      } else {
        setTempClientFilters([...tempClientFilters, value]);
      }
    }
  };

  const activeFilterCount = categoryFilters.length + statusFilters.length + clientFilters.length + (sortField ? 1 : 0);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'planned': 'Planned'
    };
    return labels[status] || status;
  };

  return (
    <>
      {/* Filter Bar */}
      <section className="bg-white py-8 border-b border-gray-200 shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Filter Button */}
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

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search by Project Name or Location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              
              {categoryFilters.map(cat => (
                <span key={cat} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {cat}
                  <button
                    onClick={() => setCategoryFilters(categoryFilters.filter(f => f !== cat))}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {statusFilters.map(status => (
                <span key={status} className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  {getStatusLabel(status)}
                  <button
                    onClick={() => setStatusFilters(statusFilters.filter(f => f !== status))}
                    className="ml-2 hover:text-yellow-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {clientFilters.map(client => (
                <span key={client} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {client}
                  <button
                    onClick={() => setClientFilters(clientFilters.filter(f => f !== client))}
                    className="ml-2 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {sortField && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Sort: {sortField} ({sortDirection})
                  <button
                    onClick={() => { setSortField(null); setSortDirection('asc'); }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Premium Modal */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Filters & Sort</h3>
                  <p className="text-sm text-gray-600 mt-1">Refine your project search</p>
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
              {/* Categories Filter */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-700 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Categories</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categoriesWithProjects.map(category => (
                    <button
                      key={category.id}
                      onClick={() => toggleTempFilter('category', category.name)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        tempCategoryFilters.includes(category.name)
                          ? 'text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                      style={tempCategoryFilters.includes(category.name) ? { backgroundColor: category.color_class } : {}}
                    >
                      {category.name}
                      {tempCategoryFilters.includes(category.name) && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-700 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Project Status</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => toggleTempFilter('status', status)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        tempStatusFilters.includes(status)
                          ? 'bg-blue-700 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      {getStatusLabel(status)}
                      {tempStatusFilters.includes(status) && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Filter */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-700 rounded-full mr-3"></div>
                  <h4 className="text-xl font-bold text-gray-900">Clients</h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueClients.map(client => (
                    <button
                      key={client}
                      onClick={() => toggleTempFilter('client', client)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        tempClientFilters.includes(client)
                          ? 'bg-blue-700 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      {client}
                      {tempClientFilters.includes(client) && (
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
                    { value: 'alphabetical', label: 'Alphabetical', icon: '🔤' },
                    { value: 'category', label: 'Category', icon: '📁' },
                    { value: 'status', label: 'Status', icon: '📊' },
                    { value: 'client', label: 'Client', icon: '🏢' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (tempSortField === option.value) {
                          setTempSortDirection(tempSortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setTempSortField(option.value as SortField);
                          setTempSortDirection('asc');
                        }
                      }}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        tempSortField === option.value
                          ? 'border-blue-700 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{option.label}</div>
                            {tempSortField === option.value && (
                              <div className="text-sm text-blue-700 font-medium">
                                {tempSortDirection === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
                              </div>
                            )}
                          </div>
                        </div>
                        {tempSortField === option.value && (
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
                {tempSortField && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Click again to toggle sort direction
                  </p>
                )}
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

      {/* Projects Grid */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-4">
            Selected Landmark Projects
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            A brief look at the scale and diversity of the government infrastructure contracts we have successfully delivered across South India.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects found matching your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="bg-white rounded-lg shadow-xl overflow-hidden transition duration-300 transform hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={`Image of ${project.title}`}
                        className="w-full h-[250px] object-cover transition-transform duration-400 hover:scale-105"
                      />
                      <span 
                        className="absolute top-3 right-3 text-sm font-bold px-3 py-1 rounded-full text-white shadow-md"
                        style={{ backgroundColor: project.category?.color_class || '#3b82f6' }}
                      >
                        {project.category?.name.toUpperCase()}
                      </span>
                      <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                        project.status === 'completed' ? 'bg-green-500' : 
                        project.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' :
                        'bg-blue-500'
                      } text-white`}>
                        {project.status.toUpperCase().replace('-', ' ')}
                      </span>
                      {project.is_featured && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                            <i className="fas fa-star mr-1 animate-pulse"></i>
                            FEATURED
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.summary || project.detailed_description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>
                          <strong className="text-blue-700">Value:</strong> {project.contract_value}
                        </span>
                        <span>
                          <strong className="text-blue-700">Client:</strong> {project.clients?.name || project.clients_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
                <button className="px-3 py-1 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150" disabled>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="px-4 py-1 text-sm font-bold text-blue-900 bg-amber-500 rounded-lg shadow-md">
                  1
                </span>
                <button className="px-3 py-1 text-gray-700 bg-white rounded-lg hover:bg-gray-200 transition duration-150">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 text-base font-semibold rounded-md shadow-lg bg-amber-500 text-[#1e3a8a] hover:bg-amber-600 transition-colors"
                >
                  Request Full Project Portfolio
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {selectedProjectId && (
        <ProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </>
  );
}