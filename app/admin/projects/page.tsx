// app/admin/projects/page.tsx
'use client';

import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

type Section = 'manage-projects' | 'add-project' | 'project-reporting';

export default function AdminProjects() {
  const [activeSection, setActiveSection] = useState<Section>('manage-projects');

  // Mock data - will be replaced with Supabase data later
  const projects = [
    {
      id: 1,
      name: 'Madurai Ring Road Bridge',
      category: 'Bridges & Highways',
      client: 'Govt. of TN, Highways',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'New Residential Township, Unit C',
      category: 'Residential',
      client: 'SK Builders Pvt. Ltd.',
      status: 'In Progress'
    }
  ];

  const reportingStats = {
    onSchedule: 12,
    atRisk: 3,
    completedThisYear: 8
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Project saved! (This will be connected to Supabase)');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Projects Management
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Add, edit, and track the status of all TTK infrastructure projects.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-projects')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-projects'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Edit Project Details
            </button>
            <button
              onClick={() => setActiveSection('add-project')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'add-project'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add New Project
            </button>
            <button
              onClick={() => setActiveSection('project-reporting')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'project-reporting'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Project Reporting
            </button>
          </nav>
        </div>

        {/* Manage Projects Section */}
        {activeSection === 'manage-projects' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Active & Completed Projects ({projects.length} Total)
              </h3>
              <button
                onClick={() => setActiveSection('add-project')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
              >
                <i className="fas fa-plus-circle mr-2"></i> Add New Project
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 relative">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          className="text-[#1e3a8a] hover:text-blue-700"
                          title="Edit Details"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete Project"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-500 text-right">
              Showing 1 to {projects.length} of {projects.length} total projects.
            </p>
          </div>
        )}

        {/* Add New Project Section */}
        {activeSection === 'add-project' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Add a New Project
              </h3>
              <button
                onClick={() => setActiveSection('manage-projects')}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="project-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="project-name"
                    name="project-name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="client"
                    name="client"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="">Select Category</option>
                    <option value="highway">Bridges & Highways</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial Buildings</option>
                    <option value="water">Waterworks & Utilities</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned/Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Summary (For Website)
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="scope"
                  className="block text-sm font-medium text-gray-700"
                >
                  Scope of Work (One per line)
                </label>
                <textarea
                  id="scope"
                  name="scope"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  placeholder="e.g., Excavation and foundation work.&#10;Construction of 4-lane flyover."
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300"
                >
                  Save New Project
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Project Reporting Section */}
        {activeSection === 'project-reporting' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              Project Reporting & Analytics
            </h3>

            <p className="text-gray-600 mb-6">
              Use this section to generate reports on project timelines, budget status, and resource allocation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-[#1e3a8a]">
                <p className="text-sm font-medium text-gray-500">On Schedule Projects</p>
                <p className="text-3xl font-bold text-[#1e3a8a]">{reportingStats.onSchedule}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-[#fbbf24]">
                <p className="text-sm font-medium text-gray-500">Projects At Risk</p>
                <p className="text-3xl font-bold text-[#fbbf24]">{reportingStats.atRisk}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                <p className="text-sm font-medium text-gray-500">Completed This Year</p>
                <p className="text-3xl font-bold text-green-600">{reportingStats.completedThisYear}</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Report Generation Tools</h4>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300">
                  <i className="fas fa-file-pdf mr-2"></i> Generate Quarterly Status Report
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300">
                  <i className="fas fa-chart-line mr-2"></i> View Timeline Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Projects Management Version.
        </footer>
      </div>
    </div>
  );
}