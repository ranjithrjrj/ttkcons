// components/ProjectModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, Project, GalleryImage } from '@/lib/supabase';

interface ProjectModalProps {
  projectId: number;
  onClose: () => void;
}

export default function ProjectModal({ projectId, onClose }: ProjectModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectImages();
  }, [projectId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('overflow-hidden');
    };
  }, [onClose]);

  const fetchProjectDetails = async () => {
    try {
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
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectImages = async () => {
    try {
      // First, get albums linked to this project via project_id
      const { data: albums, error: albumError } = await supabase
        .from('gallery_albums')
        .select('id')
        .eq('project_id', projectId);

      if (albumError) throw albumError;

      if (albums && albums.length > 0) {
        // Get images from those albums
        const albumIds = albums.map(a => a.id);
        const { data: galleryImages, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .in('album_id', albumIds)
          .order('uploaded_at', { ascending: false });

        if (imagesError) throw imagesError;
        setImages(galleryImages || []);
      } else {
        // No albums found for this project
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching project images:', error);
      setImages([]);
    }
  };

  if (loading || !project) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[9999] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Use gallery images if available, otherwise use placeholders
  const displayImages = images.length > 0
    ? images.map(img => ({
        url: img.url,
        caption: img.title,
      }))
    : [
        {
          url: `https://placehold.co/900x400/a9e7f8/1e3a8a?text=${encodeURIComponent(project.title + ' - Image 1')}`,
          caption: 'Project image placeholder',
        },
        {
          url: `https://placehold.co/900x400/a9e7f8/1e3a8a?text=${encodeURIComponent(project.title + ' - Image 2')}`,
          caption: 'Project image placeholder',
        },
        {
          url: `https://placehold.co/900x400/a9e7f8/1e3a8a?text=${encodeURIComponent(project.title + ' - Image 3')}`,
          caption: 'Project image placeholder',
        },
      ];

  const changeSlide = (direction: number) => {
    const newIndex = currentSlide + direction;
    if (newIndex >= 0 && newIndex < displayImages.length) {
      setCurrentSlide(newIndex);
    } else if (newIndex < 0) {
      setCurrentSlide(displayImages.length - 1);
    } else {
      setCurrentSlide(0);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-s z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-blue-900">{project.title}</h2>
              {project.is_featured && (
                <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
                  <i className="fas fa-star mr-1"></i>
                  FEATURED PROJECT
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Image Carousel */}
          <div className="mt-4 relative rounded-lg overflow-hidden shadow-2xl">
            <div className="relative">
              <img
                src={displayImages[currentSlide].url}
                alt={displayImages[currentSlide].caption}
                className="w-full h-auto min-h-[350px] object-cover"
              />
              
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => changeSlide(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => changeSlide(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 mb-8 text-center text-md text-gray-700 italic border-b pb-4">
            <p>{displayImages[currentSlide].caption}</p>
            {displayImages.length > 1 && (
              <p className="text-sm text-gray-500 mt-2">
                Image {currentSlide + 1} of {displayImages.length}
              </p>
            )}
          </div>

          {/* Project Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Category</div>
              <div className="text-gray-700">{project.category?.name}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Status</div>
              <div className="text-gray-700 capitalize">{project.status.replace('-', ' ')}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Contract Value</div>
              <div className="text-gray-700">{project.contract_value}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Client</div>
              <div className="text-gray-700">{project.clients?.name || project.clients_name}</div>
            </div>
          </div>

          {project.location && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-amber-500 pb-1">
                Location
              </h3>
              <p className="text-gray-600">{project.location}</p>
            </div>
          )}

          {/* Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-amber-500 pb-1">
            Detailed Description
          </h3>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{project.detailed_description}</p>

          {/* Scope of Work */}
          {project.scope_of_work && project.scope_of_work.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-amber-500 pb-1">
                Scope of Work
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {project.scope_of_work.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}