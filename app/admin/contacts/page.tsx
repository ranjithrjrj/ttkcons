// app/admin/contacts/page.tsx
'use client';

import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read';
}

export default function AdminContacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Mock data - will be replaced with Supabase data later
  const submissions: ContactSubmission[] = [
    {
      id: 1,
      name: 'Ravi Kumar',
      email: 'ravi.k@example.com',
      phone: '98765 43210',
      subject: 'Inquiry about new Project Bids',
      message:
        'We are looking to collaborate on major infrastructure projects starting next quarter. Please share your pre-qualification document.',
      date: '2025-11-28',
      status: 'New',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.s@corp.net',
      phone: '80080 08008',
      subject: 'Regarding land surveying services',
      message:
        'Can you provide a detailed quote for land surveying and geological analysis for a 50-acre plot near Madurai?',
      date: '2025-11-27',
      status: 'Read',
    },
    {
      id: 3,
      name: 'Sanjay Gupta',
      email: 'sanjay.g@private.org',
      phone: '77777 66666',
      subject: 'Website feedback',
      message:
        'The careers page is excellent, very clear job descriptions. Just wanted to provide positive feedback!',
      date: '2025-11-26',
      status: 'New',
    },
    {
      id: 4,
      name: 'Asha Menon',
      email: 'asha.m@gov.in',
      phone: '0452 240XXXX',
      subject: 'Follow up on NH-44 contract',
      message:
        'Checking the status of the tender documents submitted last week for the National Highway expansion project.',
      date: '2025-11-25',
      status: 'New',
    },
    {
      id: 5,
      name: 'Vivek Singh',
      email: 'vivek.s@mail.com',
      phone: '90090 09009',
      subject: 'General Information',
      message: 'What are your primary areas of expertise outside of road construction?',
      date: '2025-11-24',
      status: 'Read',
    },
  ];

  const handleViewMessage = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      alert(`Simulating deletion of submission ID: ${id}.`);
      // In real app: delete from Supabase and update state
    }
  };

  // Close modal on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen) {
      handleCloseModal();
    }
  };

  // Add event listener for Escape key
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Manage Contact Form Submissions
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Review and handle messages received from the public website contact form.
            </p>
          </div>
        </header>

        {/* Contact Submissions Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Submissions</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className={`${
                      submission.status === 'New'
                        ? 'bg-yellow-50/50 hover:bg-yellow-100/70'
                        : 'hover:bg-gray-50'
                    } transition duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.status === 'New' && (
                        <i className="fas fa-circle text-red-500 text-xs mr-2"></i>
                      )}
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {submission.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {submission.subject.substring(0, 30)}
                      {submission.subject.length > 30 ? '...' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewMessage(submission)}
                        className="text-[#1e3a8a] hover:text-blue-700 font-semibold transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <span>Showing 1 to 5 of 12 Submissions</span>
            <div className="space-x-1">
              <button
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 border rounded-md bg-[#fbbf24] text-[#1e3a8a] font-semibold">
                1
              </button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-100">2</button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-100">3</button>
              <button className="px-3 py-1 border rounded-md hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel.
        </footer>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSubmission && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Contact Message Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-700"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <strong>Name:</strong> {selectedSubmission.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedSubmission.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedSubmission.phone}
              </p>
              <p>
                <strong>Subject:</strong>{' '}
                <span className="font-semibold">{selectedSubmission.subject}</span>
              </p>
              <div className="pt-2 border-t mt-3">
                <p className="font-bold mb-1">Message:</p>
                <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
                  {selectedSubmission.message}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#2558a7] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}