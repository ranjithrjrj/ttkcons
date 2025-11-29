'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectImage {
  url_text: string;
  caption: string;
}

interface ProjectDetails {
  title: string;
  category: string;
  status: string;
  value: string;
  client: string;
  description: string;
  scope: string[];
  images: ProjectImage[];
}

const projectData: Record<number, ProjectDetails> = {
  1: {
    title: 'NH-44 Corridor Upgradation',
    category: 'Highways & Roads',
    status: 'Completed',
    value: '₹450 Crores',
    client: 'National Highways Authority of India (NHAI)',
    description: 'This landmark project involved the comprehensive widening and modernization of a critical 45 km segment of National Highway 44. The work converted the existing four-lane road into a six-lane configuration, drastically improving connectivity and reducing travel time between major cities.',
    scope: [
      'Major Earthwork and cutting',
      'Laying of new bituminous concrete and pavement construction',
      'Construction of service roads and drainage systems',
      'Installation of advanced toll collection systems and signage',
      'Construction of minor bridges and culverts.',
    ],
    images: [
      { url_text: 'NH+44+Expansion+Completed+Stretch', caption: 'The newly inaugurated six-lane corridor ensuring faster traffic flow and safety.' },
      { url_text: 'NH+44+Construction+Phase+Earthwork', caption: 'Heavy earthwork and road base preparation in progress using a fleet of modern construction machinery.' },
      { url_text: 'NH+44+New+Toll+Plaza+Structure', caption: 'The modern, automated toll plaza structure nearing final completion.' },
    ],
  },
  2: {
    title: 'Chennai Rail Over Bridge (ROB)',
    category: 'Rail & Bridges',
    status: 'Completed',
    value: '₹185 Crores',
    client: 'Tamil Nadu State PWD',
    description: 'A vital urban infrastructure project, this 1.2 km long Rail Over Bridge was built to eliminate a high-traffic level crossing near Chennai Central. It required precise engineering to minimize disruption to one of the busiest railway lines in South India.',
    scope: [
      'Deep piling and foundation work within confined urban space',
      'Casting and launching of pre-stressed concrete girders',
      'Construction of approach ramps and retaining walls',
      'Utility shifting and traffic management planning.',
    ],
    images: [
      { url_text: 'Chennai+ROB+Bridge+Completed', caption: 'The completed Rail Over Bridge (ROB) alleviating traffic congestion near Chennai Central.' },
      { url_text: 'ROB+Girder+Launching', caption: 'Precision lifting and launching of pre-stressed concrete girders over the busy railway lines.' },
      { url_text: 'Heavy+Traffic+Flow+on+New+ROB', caption: 'View of the smooth traffic flow on the new bridge during peak hours.' },
    ],
  },
  3: {
    title: 'Major Irrigation Canal Lining',
    category: 'Water Resources',
    status: 'Completed',
    value: '₹88 Crores',
    client: 'Water Resources Department (WRD)',
    description: 'A crucial agricultural project focused on water conservation. The lining of 28 km of the main canal system in the Thanjavur region prevents significant seepage loss, ensuring reliable water supply to thousands of acres of farmland.',
    scope: [
      'Canal de-silting and embankment reinforcement',
      'Placement of impermeable concrete lining (C.C.)',
      'Construction of head and cross regulators',
      'Slope stabilization and erosion control measures.',
    ],
    images: [
      { url_text: 'Thanjavur+Canal+Lining', caption: 'Completed section of the main canal with concrete lining to prevent water seepage.' },
      { url_text: 'Canal+Section+Before+Lining', caption: 'The original canal bed before lining work commenced.' },
      { url_text: 'Water+Flow+After+Project+Completion', caption: 'Reliable and efficient water flow after the project\'s successful handover.' },
    ],
  },
  4: {
    title: 'Eastern State Bypass Road',
    category: 'Highways & Roads',
    status: 'Ongoing',
    value: '₹210 Crores',
    client: 'State Highways Department',
    description: 'This project involves constructing a 22 km new alignment bypass road to divert heavy commercial traffic away from a congested city centre. The project includes complex intersection design to ensure high-speed, safe traffic flow. Currently 65% complete.',
    scope: [
      'Land development and site clearance (Phase 1)',
      'Construction of elevated road sections and minor interchanges',
      'Pavement construction using advanced asphalt technology',
      'Installation of intelligent traffic systems (ITS).',
    ],
    images: [
      { url_text: 'Bypass+Road+Under+Construction', caption: 'Ongoing pavement laying work on the 22km bypass road alignment.' },
      { url_text: 'Aerial+View+of+New+Alignment', caption: 'Aerial shot showing the new road cutting across the landscape.' },
      { url_text: 'Bridge+Pillars+Construction+WIP', caption: 'Construction of bridge pillars for an elevated section of the bypass.' },
    ],
  },
  5: {
    title: 'Coimbatore City Flyover Project',
    category: 'Bridges & Structures',
    status: 'Ongoing',
    value: '₹320 Crores',
    client: 'City Municipal Corporation',
    description: 'An ambitious multi-level flyover project designed to ease congestion at the city\'s main intersection. It utilizes a three-tier design to separate arterial, local, and turning traffic, providing long-term relief to commuters.',
    scope: [
      'Detailed geotechnical investigation and deep foundation work',
      'Segmental box girder construction and launching',
      'Ramp construction and surface finishing',
      'Safety barrier installation and lighting.',
    ],
    images: [
      { url_text: 'Coimbatore+Flyover+WIP', caption: 'Overhead view of the congested intersection requiring the three-tier solution.' },
      { url_text: 'Piling+Work+at+Intersection', caption: 'Deep piling work in progress at the foundation stage of the flyover.' },
      { url_text: 'Three+Tier+Flyover+Design+Mockup', caption: 'Computer-generated mockup illustrating the final design of the multi-level structure.' },
    ],
  },
  6: {
    title: 'Port Railway Yard Expansion',
    category: 'Railways',
    status: 'Completed',
    value: '₹112 Crores',
    client: 'Southern Railway',
    description: 'This strategic project involved the doubling and electrification of a 15 km dedicated railway siding, significantly boosting the cargo handling capacity of the major port and streamlining rail logistics.',
    scope: [
      'Precision track laying and ballast installation',
      'Overhead Equipment (OHE) erection for electrification',
      'Integration of new signalling and telecommunication systems',
      'Development of the rail yard and maintenance platforms.',
    ],
    images: [
      { url_text: 'Railway+Yard+Electrification', caption: 'Erection of Overhead Equipment (OHE) for the newly electrified track section.' },
      { url_text: 'Track+Laying+Process', caption: 'Specialized equipment laying the final stretch of rail track.' },
      { url_text: 'Completed+Yard+View', caption: 'An aerial view of the completed, fully functional rail yard adjacent to the port.' },
    ],
  },
};

interface ProjectModalProps {
  projectId: number;
  onClose: () => void;
}

export default function ProjectModal({ projectId, onClose }: ProjectModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const project = projectData[projectId];

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

  if (!project) return null;

  const changeSlide = (direction: number) => {
    const newIndex = currentSlide + direction;
    if (newIndex >= 0 && newIndex < project.images.length) {
      setCurrentSlide(newIndex);
    } else if (newIndex < 0) {
      setCurrentSlide(project.images.length - 1);
    } else {
      setCurrentSlide(0);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <h2 className="text-3xl font-extrabold text-blue-900">{project.title}</h2>
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
                src={`https://placehold.co/900x400/a9e7f8/1e3a8a?text=${project.images[currentSlide].url_text}`}
                alt={project.images[currentSlide].caption}
                className="w-full h-auto min-h-[350px] object-cover"
              />
              
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
            </div>
          </div>

          <div className="mt-2 mb-8 text-center text-md text-gray-700 italic border-b pb-4">
            <p>{project.images[currentSlide].caption}</p>
          </div>

          {/* Project Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Category</div>
              <div className="text-gray-700">{project.category}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Status</div>
              <div className="text-gray-700">{project.status}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Contract Value</div>
              <div className="text-gray-700">{project.value}</div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-bold text-blue-700">Client</div>
              <div className="text-gray-700">{project.client}</div>
            </div>
          </div>

          {/* Description */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-amber-500 pb-1">
            Detailed Description
          </h3>
          <p className="text-gray-600 mb-6">{project.description}</p>

          {/* Scope of Work */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-amber-500 pb-1">
            Scope of Work
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {project.scope.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}