// app/admin/careers/page.tsx
'use client';

import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

type Section = 'manage-jobs' | 'new-job' | 'applications';

export default function AdminCareers() {
  const [activeSection, setActiveSection] = useState<Section>('manage-jobs');

  // Mock data - will be replaced with Supabase data later
  const jobPostings = [
    {
      id: 1,
      title: 'Senior Project Manager',
      department: 'Civil Engineering',
      postedDate: '2025-10-15',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Site Supervisor (Junior)',
      department: 'Site Operations',
      postedDate: '2025-11-20',
      status: 'New'
    }
  ];

  const applications = [
    {
      id: 1,
      name: 'Aravind S.',
      position: 'Site Supervisor (Junior)',
      appliedDate: '2025-11-21',
      status: 'Pending Review'
    },
    {
      id: 2,
      name: 'Priya K.',
      position: 'Senior Project Manager',
      appliedDate: '2025-11-19',
      status: 'HR Reviewed'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Job posting submitted! (This will be connected to Supabase)');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Careers Management
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Control job postings, applications, and career page content.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-jobs')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-jobs'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Job Postings
            </button>
            <button
              onClick={() => setActiveSection('new-job')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'new-job'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add New Job
            </button>
            <button
              onClick={() => setActiveSection('applications')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'applications'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              View Applications
            </button>
          </nav>
        </div>

        {/* Manage Jobs Section */}
        {activeSection === 'manage-jobs' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Manage Job Postings ({jobPostings.length} Active)
              </h3>
              <button
                onClick={() => setActiveSection('new-job')}
                className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
              >
                <i className="fas fa-plus-circle mr-2"></i> Post New Job
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 relative">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobPostings.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.postedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            job.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          className="text-[#1e3a8a] hover:text-blue-700"
                          title="Edit Job"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete Job"
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
              Showing 1 to {jobPostings.length} of {jobPostings.length} current postings.
            </p>
          </div>
        )}

        {/* Add New Job Section */}
        {activeSection === 'new-job' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Post a New Job Opening
              </h3>
              <button
                onClick={() => setActiveSection('manage-jobs')}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="job-title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    name="job-title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="">Select Department</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="site">Site Operations</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance & Accounts</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Key Requirements (One per line)
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  placeholder="e.g., Bachelor's degree in Civil Engg.&#10;5+ years experience in infrastructure."
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applications Section */}
        {activeSection === 'applications' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
              View Job Applications ({applications.length} Pending)
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied For
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 relative">Review</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.appliedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === 'Pending Review'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="View Application"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-500 text-right">
              Showing 1 to {applications.length} total applications.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Careers Management Version.
        </footer>
      </div>
    </div>
  );
}