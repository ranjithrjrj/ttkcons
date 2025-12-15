// app/admin/contacts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { supabase } from '@/lib/supabase';
import type { ContactSubmission } from '@/lib/supabase';
import { confirmAlert } from 'react-confirm-alert';
import toast, { Toaster } from 'react-hot-toast';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminContacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch submissions directly from Supabase
  const fetchSubmissions = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * pagination.limit;

      // Get total count
      const { count } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

      // Get paginated data
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + pagination.limit - 1);

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to load submissions');
      } else {
        setSubmissions(data || []);
        setPagination({
          total: count || 0,
          page,
          limit: pagination.limit,
          totalPages: Math.ceil((count || 0) / pagination.limit),
        });
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('An error occurred while loading submissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleViewMessage = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);

    // Mark as read if it's new
    if (submission.status === 'New') {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ status: 'Read' })
          .eq('id', submission.id);

        if (!error) {
          // Update local state
          setSubmissions(prev =>
            prev.map(s => (s.id === submission.id ? { ...s, status: 'Read' as const } : s))
          );
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleDelete = (id: number, name: string) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete the submission from "${name}"? This action cannot be undone.`,
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('contact_submissions')
                .delete()
                .eq('id', id);

              if (!error) {
                setSubmissions(prev => prev.filter(s => s.id !== id));
                setPagination(prev => ({
                  ...prev,
                  total: prev.total - 1,
                }));
                toast.success('Submission deleted successfully');
              } else {
                toast.error('Failed to delete submission');
              }
            } catch (error) {
              console.error('Error deleting submission:', error);
              toast.error('An error occurred while deleting');
            }
          },
        },
        {
          label: 'Cancel',
          onClick: () => {},
        },
      ],
    });
  };

  // Select/Deselect individual items
  const handleSelectItem = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select/Deselect all items on current page
  const handleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.map(s => s.id));
    }
  };

  // Bulk mark as read
  const handleBulkMarkAsRead = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select items first');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'Read' })
        .in('id', selectedIds);

      if (!error) {
        setSubmissions(prev =>
          prev.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'Read' as const } : s))
        );
        setSelectedIds([]);
        toast.success(`${selectedIds.length} submission(s) marked as read`);
      } else {
        toast.error('Failed to update submissions');
      }
    } catch (error) {
      console.error('Error updating submissions:', error);
      toast.error('An error occurred');
    }
  };

  // Bulk mark as unread
  const handleBulkMarkAsUnread = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select items first');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'New' })
        .in('id', selectedIds);

      if (!error) {
        setSubmissions(prev =>
          prev.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'New' as const } : s))
        );
        setSelectedIds([]);
        toast.success(`${selectedIds.length} submission(s) marked as unread`);
      } else {
        toast.error('Failed to update submissions');
      }
    } catch (error) {
      console.error('Error updating submissions:', error);
      toast.error('An error occurred');
    }
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select items first');
      return;
    }

    confirmAlert({
      title: 'Confirm Bulk Delete',
      message: `Are you sure you want to delete ${selectedIds.length} submission(s)? This action cannot be undone.`,
      buttons: [
        {
          label: 'Yes, Delete All',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('contact_submissions')
                .delete()
                .in('id', selectedIds);

              if (!error) {
                setSubmissions(prev => prev.filter(s => !selectedIds.includes(s.id)));
                setPagination(prev => ({
                  ...prev,
                  total: prev.total - selectedIds.length,
                }));
                setSelectedIds([]);
                toast.success(`${selectedIds.length} submission(s) deleted successfully`);
              } else {
                toast.error('Failed to delete submissions');
              }
            } catch (error) {
              console.error('Error deleting submissions:', error);
              toast.error('An error occurred while deleting');
            }
          },
        },
        {
          label: 'Cancel',
          onClick: () => {},
        },
      ],
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setSelectedIds([]); // Clear selections when changing page
      fetchSubmissions(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Submissions</h2>
            
            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium"
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  Mark as Read ({selectedIds.length})
                </button>
                <button
                  onClick={handleBulkMarkAsUnread}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Mark as Unread ({selectedIds.length})
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete ({selectedIds.length})
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No contact submissions yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === submissions.length}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Phone
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
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(submission.id)}
                            onChange={() => handleSelectItem(submission.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.status === 'New' && (
                            <i className="fas fa-circle text-red-500 text-xs mr-2"></i>
                          )}
                          {submission.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {submission.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {submission.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {submission.subject.substring(0, 30)}
                          {submission.subject.length > 30 ? '...' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.submitted_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewMessage(submission)}
                            className="text-[#1e3a8a] hover:text-blue-700 font-semibold transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(submission.id, submission.name)}
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
                <span>
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} Submissions
                </span>
                <div className="space-x-1">
                  <button
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1 border rounded-md ${
                          pageNum === pagination.page
                            ? 'bg-[#fbbf24] text-[#1e3a8a] font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel.
        </footer>
      </div>

      {/* Modal - Transparent background */}
      {isModalOpen && selectedSubmission && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 border-2 border-gray-200"
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
                <strong>Phone:</strong> {selectedSubmission.phone || 'Not provided'}
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

            <div className="mt-6 pt-4 border-t flex justify-between">
              <button
                onClick={() => {
                  handleCloseModal();
                  handleDelete(selectedSubmission.id, selectedSubmission.name);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Message
              </button>
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