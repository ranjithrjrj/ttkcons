'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProjectModal from './ProjectModal';

interface ProjectCard {
  id: number;
  title: string;
  description: string;
  value: string;
  client: string;
  category: string;
  status: string;
  image: string;
  categoryColor: string;
}

const projectsData: ProjectCard[] = [
  {
    id: 1,
    title: 'NH-44 Corridor Upgradation',
    description: 'Widening of a 45 km stretch of National Highway 44 (the North-South Corridor) to a six-lane configuration in the Madurai-Dindigul section.',
    value: '₹450 Cr',
    client: 'NHAI',
    category: 'Highways & Roads',
    status: 'COMPLETED',
    image: 'https://placehold.co/600x400/1d4ed8/FFFFFF?text=NH+44+Expansion',
    categoryColor: 'cat-highway',
  },
  {
    id: 2,
    title: 'Chennai Rail Over Bridge (ROB)',
    description: 'Construction of a critical 1.2 km long Rail Over Bridge to decongest traffic near the Chennai Central railway lines, facilitating smoother city flow.',
    value: '₹185 Cr',
    client: 'State PWD',
    category: 'Rail & Metro',
    status: 'COMPLETED',
    image: 'https://placehold.co/600x400/ef4444/FFFFFF?text=ROB+Construction',
    categoryColor: 'cat-railway',
  },
  {
    id: 3,
    title: 'Major Irrigation Canal Lining',
    description: 'Lining of 28 km main canal system in the Thanjavur region to significantly reduce water loss and improve agricultural irrigation efficiency.',
    value: '₹88 Cr',
    client: 'Water Resources Dept.',
    category: 'Water Resources',
    status: 'COMPLETED',
    image: 'https://placehold.co/600x400/059669/FFFFFF?text=Irrigation+Canal',
    categoryColor: 'cat-water',
  },
  {
    id: 4,
    title: 'Eastern State Bypass Road',
    description: 'Development of a new 22 km bypass road around a major city center, involving elevated structures and complex junction design. Currently in Phase 2.',
    value: '₹210 Cr',
    client: 'State Highways Dept.',
    category: 'Highways & Roads',
    status: 'ONGOING',
    image: 'https://placehold.co/600x400/f59e0b/FFFFFF?text=State+Road+WIP',
    categoryColor: 'cat-highway',
  },
  {
    id: 5,
    title: 'Coimbatore City Flyover Project',
    description: 'Design and construction of a three-tier flyover system to alleviate one of the city\'s most congested intersections. Scheduled completion: Q3 2026.',
    value: '₹320 Cr',
    client: 'City Corporation',
    category: 'Bridges & Structures',
    status: 'ONGOING',
    image: 'https://placehold.co/600x400/1e3a8a/FFFFFF?text=Flyover+Piling',
    categoryColor: 'cat-bridge',
  },
  {
    id: 6,
    title: 'Port Railway Yard Expansion',
    description: 'Execution of doubling and electrification work for a 15 km railway siding connecting a major port to the main rail network.',
    value: '₹112 Cr',
    client: 'Southern Railway',
    category: 'Rail & Metro',
    status: 'COMPLETED',
    image: 'https://placehold.co/600x400/4c0519/FFFFFF?text=Railway+Siding',
    categoryColor: 'cat-railway',
  },
];

const filterCategories = [
  'All Projects',
  'Highways & Roads',
  'Rail & Metro',
  'Bridges & Structures',
  'Water Resources',
];

export default function ProjectsContent() {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const filteredProjects = activeFilter === 'All Projects' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <>
      {/* Filter Bar */}
      <section className="bg-white py-8 border-b border-gray-200 shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 text-sm font-semibold rounded-full border transition duration-200 ${
                  activeFilter === category
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
            <div className="flex gap-4">
              <select className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm">
                <option>Status: All</option>
                <option>Status: Ongoing</option>
                <option>Status: Completed</option>
              </select>

              <select className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm">
                <option>Client: All</option>
                <option>Client: NHAI / Central Gov</option>
                <option>Client: State PWD / Highways</option>
                <option>Client: Railway / Metro</option>
                <option>Client: Water Resources Dept</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search by Project Name or Location"
              className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-4">
            Selected Landmark Projects
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            A brief look at the scale and diversity of the government infrastructure contracts we have successfully delivered across South India.
          </p>

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
                  <span className={`absolute top-3 right-3 text-sm font-bold px-3 py-1 rounded-full text-white shadow-md ${project.categoryColor}`}>
                    {project.category.toUpperCase()}
                  </span>
                  <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
                    project.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                  } text-white`}>
                    {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>
                      <strong className="text-blue-700">Value:</strong> {project.value}
                    </span>
                    <span>
                      <strong className="text-blue-700">Client:</strong> {project.client}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
            <button className="px-3 py-1 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150" disabled>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-4 py-1 text-sm font-bold text-blue-900 bg-amber-500 rounded-lg shadow-md">
              1
            </span>
            <button className="px-4 py-1 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-200 transition duration-150">
              2
            </button>
            <button className="px-4 py-1 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-200 transition duration-150">
              3
            </button>
            <span className="text-gray-500">...</span>
            <button className="px-4 py-1 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-200 transition duration-150">
              8
            </button>
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
        </div>
      </section>

      {/* Project Modal */}
      {selectedProjectId && (
        <ProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </>
  );
}