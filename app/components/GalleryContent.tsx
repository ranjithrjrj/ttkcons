'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  url: string;
  caption: string;
}

interface GalleryProject {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  type: string;
  description: string;
  images: GalleryImage[];
}

const galleryData: GalleryProject[] = [
  {
    id: 1,
    title: 'NH 44 - Widening Progress',
    category: 'Project Sites',
    location: 'Krishnagiri, TN',
    date: 'October 2024',
    type: 'Pavement & Earthwork',
    description: 'A multi-image collection showcasing the different phases of highway widening, from earthwork to final PQC layer.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+PQC+Road+Casting', caption: 'Laying the Pavement Quality Concrete (PQC).' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Hot+Mix+Plant', caption: 'High-capacity Hot Mix Plant operations.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+3+%7C+Completed+Stretch', caption: 'The newly completed, smooth highway stretch.' },
    ],
  },
  {
    id: 2,
    title: 'Flyover Foundation Piling',
    category: 'Project Sites',
    location: 'Madurai Central',
    date: 'August 2024',
    type: 'Structural Piling',
    description: 'Visual documentation of deep piling and sub-structure erection for the urban flyover.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+Piling+Rig+Work', caption: 'The heavy piling rig in action at the pier location.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Pile+Cap+Formwork', caption: 'Preparation of the pile cap reinforcement and formwork.' },
    ],
  },
  {
    id: 7,
    title: 'TTK Head Office',
    category: 'Offices',
    location: 'Madurai',
    date: 'June 2023',
    type: 'Interiors, Welcome',
    description: 'A look inside our main operational hub, designed for efficiency and collaboration.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+Head+Office+Lobby', caption: 'The main reception area of the Head Office.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Conference+Room', caption: 'Our primary conference and client meeting room.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+3+%7C+Open+Office+Space', caption: 'The spacious and modern open office environment.' },
    ],
  },
  {
    id: 8,
    title: 'Team & Planning',
    category: 'Staff',
    location: 'Head Office',
    date: 'September 2024',
    type: 'Teamwork, Planning',
    description: 'Highlighting the talented individuals and collaborative spirit that drives our success.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+Project+Review+Team', caption: 'Senior management and engineers during a weekly review.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Site+Supervisor+in+Action', caption: 'A site supervisor performing a quality check on site.' },
    ],
  },
  {
    id: 9,
    title: 'Annual Safety Day',
    category: 'Events',
    location: 'Madurai Yard',
    date: 'May 2024',
    type: 'Company Culture, Training',
    description: 'Photos from our annual event dedicated to enhancing safety awareness and recognizing outstanding team members.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+Safety+Day+Address', caption: 'CEO addressing the team on safety protocols.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Award+Distribution', caption: 'Distributing "Best Safety Practice" awards.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+3+%7C+Team+Lunch', caption: 'Group photo during the event team lunch.' },
    ],
  },
  {
    id: 10,
    title: 'Equipment & QC Lab',
    category: 'Miscellaneous',
    location: 'Various',
    date: '2023-2024',
    type: 'Equipment, Logistics, Quality',
    description: 'A selection of important assets and behind-the-scenes quality control procedures.',
    images: [
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+1+%7C+Heavy+Machinery', caption: 'Our new fleet of excavators and dump trucks.' },
      { url: 'https://placehold.co/800x600/1e3a8a/fbbf24?text=Image+2+%7C+Quality+Control+Lab', caption: 'Engineers conducting material testing in the lab.' },
    ],
  },
];

const categories = ['all', 'Project Sites', 'Offices', 'Staff', 'Events', 'Miscellaneous'];

export default function GalleryContent() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProjects = filter === 'all' ? galleryData : galleryData.filter(p => p.category === filter);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (selectedProject) {
        if (e.key === 'ArrowLeft') navigateCarousel(-1);
        if (e.key === 'ArrowRight') navigateCarousel(1);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject, currentImageIndex]);

  const openModal = (project: GalleryProject) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const navigateCarousel = (direction: number) => {
    if (!selectedProject) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = selectedProject.images.length - 1;
    if (newIndex >= selectedProject.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  return (
    <>
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Filter by Category
          </h2>

          <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-semibold py-2 px-6 rounded-md transition mb-2 ${
                  filter === cat
                    ? 'bg-amber-500 text-[#1e3a8a]'
                    : 'bg-gray-300 text-gray-900 hover:bg-amber-500 hover:text-gray-900'
                }`}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => openModal(project)}
                className="rounded-lg shadow-xl overflow-hidden bg-white cursor-pointer hover:shadow-2xl transition"
              >
                <img
                  src={project.images[0].url}
                  alt={project.title}
                  className="w-full h-48 object-cover hover:opacity-80 transition border-b-2 border-amber-500"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-amber-500 text-sm">
                    {project.category} ({project.images.length} Photos)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-center text-xl text-gray-500 mt-10">
              No images found for this category. Please try a different filter.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
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
              <div className="md:w-3/4 flex flex-col bg-gray-200 relative p-2 md:p-4">
                <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                  <img
                    src={selectedProject.images[currentImageIndex].url}
                    alt={selectedProject.title}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                    {selectedProject.images[currentImageIndex].caption}
                  </div>
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
                  {selectedProject.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-16 object-cover cursor-pointer transition ${
                        idx === currentImageIndex ? 'border-3 border-amber-500 opacity-100' : 'opacity-70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="md:w-1/4 p-6 md:p-8 bg-white overflow-y-auto">
                <h2 className="text-3xl font-bold text-blue-900 mb-2">{selectedProject.title}</h2>
                <p className="text-amber-500 font-medium mb-4 border-b pb-2">
                  Category: {selectedProject.category}
                </p>

                <div className="space-y-3 mb-6 text-gray-700 text-sm">
                  <p>
                    <strong>Location:</strong> {selectedProject.location}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedProject.date}
                  </p>
                  <p>
                    <strong>Keywords:</strong> {selectedProject.type}
                  </p>
                </div>

                <p className="text-gray-600 mb-6 text-sm">{selectedProject.description}</p>

                <Link
                  href={selectedProject.category === 'Project Sites' ? '/projects' : '/contact'}
                  className="inline-block bg-blue-900 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800"
                >
                  {selectedProject.category === 'Project Sites'
                    ? 'View Related Projects →'
                    : 'Contact Us for Details →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}