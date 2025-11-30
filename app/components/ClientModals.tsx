'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  scope: string;
  date: string;
}

interface ClientData {
  id: string;
  name: string;
  description: string;
  projects: Project[];
}

const clientData: ClientData[] = [
  {
    id: 'pwd_tn',
    name: 'Public Works Department (PWD), Tamil Nadu',
    description: 'Primary partner for civil and structural works, including institutional buildings, drainage systems, and flood control infrastructure across multiple districts.',
    projects: [
      { id: 'p01', name: 'Madurai District Court Annex Building', scope: 'Construction of 5-story annex building including foundation, structural, and interior finishing works.', date: 'Completed 2022' },
      { id: 'p02', name: 'River Vaigai Flood Protection Wall (Phase III)', scope: 'Construction of 1.5 km retaining wall and strengthening of existing bunds near Theni.', date: 'Completed 2019' },
      { id: 'p05', name: 'Collectorate Office Drainage System Upgrade', scope: 'Upgrade of storm water drainage network around the Madurai Collectorate complex.', date: 'Completed 2018' },
    ],
  },
  {
    id: 'highways_dept',
    name: 'Tamil Nadu Highways Department',
    description: 'Key contractor for state and national highway maintenance, widening, and new road construction projects in Southern Tamil Nadu.',
    projects: [
      { id: 'p03', name: 'NH-44 Widening (Stretch D)', scope: 'Widening of 15 km section of National Highway 44 to 4-lane concrete carriage.', date: 'Ongoing 2023-2025' },
      { id: 'p04', name: 'Madurai Ring Road Bridge Structure', scope: 'Construction of two complex flyovers at major intersections on the Madurai Ring Road.', date: 'Completed 2020' },
      { id: 'p06', name: 'State Highway SH-42 Repair and Resurfacing', scope: 'Periodic maintenance, pot-hole repair, and full bituminous resurfacing of 35 km of SH-42.', date: 'Completed 2021' },
    ],
  },
];

// Flatten project lookup
const projectLookup: Record<string, Project & { clientName: string }> = {};
clientData.forEach((client) => {
  client.projects.forEach((project) => {
    projectLookup[project.id] = { ...project, clientName: client.name };
  });
});

export default function ClientModals() {
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [selectedProject, setSelectedProject] = useState<(Project & { clientName: string }) | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (projectModalOpen) {
          closeProjectModal();
        } else if (clientModalOpen) {
          closeClientModal();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [clientModalOpen, projectModalOpen]);

  const openClientModal = (clientId: string) => {
    const client = clientData.find((c) => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setClientModalOpen(true);
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeClientModal = () => {
    setClientModalOpen(false);
    setSelectedClient(null);
    document.body.classList.remove('overflow-hidden');
  };

  const openProjectModal = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const project = projectLookup[projectId];
    if (project) {
      setSelectedProject(project);
      setProjectModalOpen(true);
    }
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      {/* Client Logo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div
          onClick={() => openClientModal('pwd_tn')}
          className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <img
            src="https://placehold.co/150x60/f0f4f8/1e3a8a?text=PWD+Tamil+Nadu"
            alt="PWD Tamil Nadu Logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div
          onClick={() => openClientModal('highways_dept')}
          className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <img
            src="https://placehold.co/150x60/f0f4f8/1e3a8a?text=Highways+Dept."
            alt="Highways Department Logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <img
            src="https://placehold.co/150x60/f0f4f8/1e3a8a?text=Water+Resources"
            alt="Water Resources Department Logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <img
            src="https://placehold.co/150x60/f0f4f8/1e3a8a?text=TANGEDCO"
            alt="TANGEDCO Logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <img
            src="https://placehold.co/150x60/f0f4f8/1e3a8a?text=Railways+Zone"
            alt="Indian Railways Logo"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Client Modal */}
      {clientModalOpen && selectedClient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4 transition-opacity duration-300"
          onClick={closeClientModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <h3 className="text-3xl font-extrabold text-blue-900">{selectedClient.name}</h3>
                <button
                  onClick={closeClientModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-lg text-gray-600 mb-6">{selectedClient.description}</p>

              <h4 className="text-2xl font-bold text-amber-500 mb-4 border-b border-amber-500 pb-2">
                Completed Projects
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedClient.projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={(e) => openProjectModal(project.id, e)}
                    className="relative bg-white p-6 border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start mb-3">
                      <Building2 className="w-6 h-6 text-blue-900 mr-3 flex-shrink-0" />
                      <h5 className="text-xl font-bold text-gray-900 leading-snug">
                        {project.name}
                      </h5>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.scope}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-600 font-semibold">{project.date}</span>
                      <span className="text-blue-700 font-medium hover:text-amber-500 flex items-center">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal (Higher z-index) */}
      {projectModalOpen && selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[70] p-4 transition-opacity duration-300"
          onClick={closeProjectModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start border-b pb-3 mb-3">
                <h3 className="text-2xl font-extrabold text-blue-900">{selectedProject.name}</h3>
                <button
                  onClick={closeProjectModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Client:</strong> {selectedProject.clientName}
                </p>
                <p>
                  <strong>Scope:</strong> {selectedProject.scope}
                </p>
                <p>
                  <strong>Status/Date:</strong> {selectedProject.date}
                </p>

                <div className="pt-4 border-t mt-4 text-center">
                  <Link
                    href="/contact"
                    className="inline-flex bg-amber-500 text-[#1e3a8a] font-bold px-4 py-2 text-sm rounded shadow-md hover:bg-amber-600 transition-colors"
                  >
                    Enquire About This Project
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