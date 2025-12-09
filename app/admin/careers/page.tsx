// app/admin/careers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from '@/app/components/Pagination';
import 'react-confirm-alert/src/react-confirm-alert.css';

type Section = 'manage-jobs' | 'add-job' | 'applications' | 'manage-departments';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  location: string;
  employment_type: string;
  salary_range: string | null;
  experience_required: string | null;
  requirements: string;
  status: string;
  is_featured: boolean;
  posted_date: string;
}

interface JobApplication {
  id: string;
  job_posting_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: string;
  applied_date: string;
  job_postings?: { title: string };
}

interface Department {
  id: number;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function AdminCareers() {
  const [activeSection, setActiveSection] = useState<Section>('manage-jobs');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedResume, setSelectedResume] = useState<{ url: string; name: string } | null>(null);
  const [showDeptForm, setShowDeptForm] = useState(false);
  
  const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
  const [applicationsCurrentPage, setApplicationsCurrentPage] = useState(1);

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    description: '',
    location: 'Madurai, TN',
    employment_type: 'Full-Time',
    salary_range: '',
    experience_required: '',
    requirements: '',
    status: 'Active',
    is_featured: false
  });

  const [deptForm, setDeptForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchDepartments();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings (title)
        `)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'jobs')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleJobSubmit = async () => {
    const jobData = {
      ...jobForm,
      posted_date: editingJob ? editingJob.posted_date : new Date().toISOString().split('T')[0]
    };

    try {
      if (editingJob) {
        const { error } = await supabase
          .from('job_postings')
          .update(jobData)
          .eq('id', editingJob.id);

        if (error) throw error;
        toast.success('Job updated successfully!');
      } else {
        const { error } = await supabase
          .from('job_postings')
          .insert([jobData]);

        if (error) throw error;
        toast.success('Job posted successfully!');
      }

      resetJobForm();
      fetchJobs();
      setActiveSection('manage-jobs');
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(error.message || 'Failed to save job');
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      description: job.description,
      location: job.location,
      employment_type: job.employment_type,
      salary_range: job.salary_range || '',
      experience_required: job.experience_required || '',
      requirements: job.requirements,
      status: job.status,
      is_featured: job.is_featured
    });
    setActiveSection('add-job');
  };

  const handleDeleteJob = (id: number) => {
    confirmAlert({
      title: 'Delete Job',
      message: 'Are you sure? This will also delete all applications for this job.',
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('job_postings')
                .delete()
                .eq('id', id);

              if (error) throw error;
              toast.success('Job deleted successfully');
              fetchJobs();
            } catch (error) {
              toast.error('Failed to delete job');
            }
          }
        },
        { label: 'Cancel', onClick: () => {} }
      ]
    });
  };

  const resetJobForm = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      department: '',
      description: '',
      location: 'Madurai, TN',
      employment_type: 'Full-Time',
      salary_range: '',
      experience_required: '',
      requirements: '',
      status: 'Active',
      is_featured: false
    });
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      toast.success('Status updated');
      fetchApplications();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleViewResume = async (resumePath: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resumePath, 3600);

      if (error) throw error;
      if (data?.signedUrl) {
        setSelectedResume({ url: data.signedUrl, name });
      }
    } catch (error) {
      toast.error('Failed to load resume');
    }
  };

  const handleDeptSubmit = async () => {
    try {
      if (editingDept) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: deptForm.name,
            description: deptForm.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDept.id);

        if (error) throw error;
        toast.success('Department updated!');
      } else {
        const maxOrder = departments.length > 0 
          ? Math.max(...departments.map(d => d.display_order)) + 1 
          : 1;

        const { error} = await supabase
          .from('categories')
          .insert([{
            name: deptForm.name,
            description: deptForm.description,
            type: 'jobs',
            display_order: maxOrder,
            is_active: true
          }]);

        if (error) throw error;
        toast.success('Department created!');
      }

      resetDeptForm();
      fetchDepartments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save department');
    }
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      description: dept.description || ''
    });
    setShowDeptForm(true);
  };

  const handleDeleteDept = (id: number) => {
    confirmAlert({
      title: 'Delete Department',
      message: 'This will affect jobs using this department. Continue?',
      buttons: [
        {
          label: 'Yes, Delete',
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

              if (error) throw error;
              toast.success('Department deleted');
              fetchDepartments();
            } catch (error) {
              toast.error('Failed to delete department');
            }
          }
        },
        { label: 'Cancel', onClick: () => {} }
      ]
    });
  };

  const handleToggleDeptStatus = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? 'Deactivate' : 'Activate';

    confirmAlert({
      title: `${action} Department`,
      message: `Are you sure you want to ${action.toLowerCase()} this department?`,
      buttons: [
        {
          label: `Yes, ${action}`,
          onClick: async () => {
            try {
              const { error } = await supabase
                .from('categories')
                .update({ 
                  is_active: !currentStatus,
                  updated_at: new Date().toISOString()
                })
                .eq('id', id);

              if (error) throw error;
              toast.success(`${action}d successfully!`);
              fetchDepartments();
            } catch (error) {
              console.error(`Error ${action.toLowerCase()}ing status:`, error);
              toast.error(`Failed to ${action.toLowerCase()} department`);
            }
          }
        },
        { label: 'Cancel', onClick: () => {} }
      ]
    });
  };

  const handleMoveDept = async (id: number, direction: 'up' | 'down') => {
    const sortedDepartments = [...departments].sort((a, b) => a.display_order - b.display_order);
    const currentIndexInSorted = sortedDepartments.findIndex(d => d.id === id);

    if (currentIndexInSorted === -1) return;

    let targetIndexInSorted: number;
    if (direction === 'up' && currentIndexInSorted > 0) {
        targetIndexInSorted = currentIndexInSorted - 1;
    } else if (direction === 'down' && currentIndexInSorted < sortedDepartments.length - 1) {
        targetIndexInSorted = currentIndexInSorted + 1;
    } else {
        return;
    }

    const currentDept = sortedDepartments[currentIndexInSorted];
    const targetDept = sortedDepartments[targetIndexInSorted];

    try {
        const updates = [
            supabase.from('categories').update({ display_order: targetDept.display_order }).eq('id', currentDept.id),
            supabase.from('categories').update({ display_order: currentDept.display_order }).eq('id', targetDept.id),
        ];

        const results = await Promise.all(updates);
        
        if (results.some(res => res.error)) {
            results.forEach(res => res.error && console.error('Swap Error:', res.error));
            throw new Error('One or more updates failed during swap.');
        }

        toast.success('Department order updated!');
        fetchDepartments();
    } catch (error) {
        console.error('Error swapping department order:', error);
        toast.error('Failed to update department order');
    }
  };

  const resetDeptForm = () => {
    setEditingDept(null);
    setShowDeptForm(false);
    setDeptForm({ name: '', description: '' });
  };

  const activeDepartments = departments.filter(d => d.is_active);

  const jobsTotalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice(
    (jobsCurrentPage - 1) * ITEMS_PER_PAGE,
    jobsCurrentPage * ITEMS_PER_PAGE
  );

  const applicationsTotalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const paginatedApplications = applications.slice(
    (applicationsCurrentPage - 1) * ITEMS_PER_PAGE,
    applicationsCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-300 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Careers Management</h1>
          <p className="text-lg text-gray-600 mt-1">Manage job postings, applications, and departments.</p>
        </header>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-jobs')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-jobs'
                  ? 'border-amber-500 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Jobs
            </button>
            {activeSection === 'add-job' && (
              <button
                className="pb-4 px-1 border-b-2 border-amber-500 text-blue-900 font-semibold text-sm"
              >
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </button>
            )}
            <button
              onClick={() => setActiveSection('applications')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'applications'
                  ? 'border-amber-500 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveSection('manage-departments')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-departments'
                  ? 'border-amber-500 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Departments
            </button>
          </nav>
        </div>

        {activeSection === 'manage-jobs' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold">Job Postings ({jobs.length})</h3>
              <button
                onClick={() => { 
                  resetJobForm(); 
                  setActiveSection('add-job'); 
                }}
                className="bg-amber-500 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-600"
              >
                <i className="fas fa-plus-circle mr-2"></i>  Add Job
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedJobs.map((job) => (
                        <tr key={job.id} className={job.is_featured ? 'bg-amber-50' : ''}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {job.title}
                              {job.is_featured && (
                                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  ⭐ FEATURED
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{job.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{job.location}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 text-xs font-semibold rounded-full ${
                              job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-3 flex items-center justify-center">
                            <button 
                              onClick={() => handleEditJob(job)} 
                              className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded"
                              title="Edit Job"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job.id)} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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

                {jobsTotalPages > 1 && (
                  <Pagination
                    currentPage={jobsCurrentPage}
                    totalPages={jobsTotalPages}
                    onPageChange={setJobsCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeSection === 'add-job' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-amber-500">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold">{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <button 
                onClick={() => { 
                  resetJobForm(); 
                  setActiveSection('manage-jobs'); 
                }} 
                className="text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department *</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Department</option>
                    {activeDepartments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience Required</label>
                  <input
                    type="text"
                    value={jobForm.experience_required}
                    onChange={(e) => setJobForm({ ...jobForm, experience_required: e.target.value })}
                    placeholder="e.g., 5+ years"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <input
                  type="text"
                  value={jobForm.salary_range}
                  onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                  placeholder="e.g., Negotiable"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={4}
                  placeholder="Enter each requirement on a new line"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  id="job-status-toggle"
                  type="checkbox"
                  checked={jobForm.status === 'Active'}
                  onChange={(e) => setJobForm({ ...jobForm, status: e.target.checked ? 'Active' : 'Closed' })}
                  className="h-4 w-4 text-blue-900 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="job-status-toggle" className="text-sm font-medium text-gray-700">
                  Job is Active (Status: <span className="font-bold">{jobForm.status}</span>)
                </label>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  id="job-featured-toggle"
                  type="checkbox"
                  checked={jobForm.is_featured}
                  onChange={(e) => setJobForm({ ...jobForm, is_featured: e.target.checked })}
                  className="h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="job-featured-toggle" className="text-sm font-medium text-gray-700">
                  ⭐ Mark as Featured Job (appears at top with special highlighting)
                </label>
              </div>

              <button onClick={handleJobSubmit} className="w-full bg-blue-900 text-white py-2.5 rounded-md font-bold hover:bg-blue-800">
                {editingJob ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'applications' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 border-b pb-4">Applications ({applications.length})</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{app.applicant_name}</div></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.job_postings?.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.applied_date}</td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="text-xs font-semibold rounded-full px-2 py-1 border-0 bg-blue-100 text-blue-800"
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Under Review">Under Review</option>
                          <option value="HR Reviewed">HR Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewResume(app.resume_url, app.applicant_name)}
                          className="text-blue-600 hover:text-blue-900 text-lg"
                        >
                          📄
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {applicationsTotalPages > 1 && (
              <Pagination
                currentPage={applicationsCurrentPage}
                totalPages={applicationsTotalPages}
                onPageChange={setApplicationsCurrentPage}
              />
            )}
          </div>
        )}
		
		
	{activeSection === 'manage-departments' && (
          <div className="space-y-6">
            {showDeptForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{editingDept ? 'Edit' : 'Add'} Department</h3>
                  <button
                    onClick={resetDeptForm}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleDeptSubmit} className="bg-blue-900 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-800">
                      {editingDept ? 'Update' : 'Add'} Department
                    </button>
                    <button onClick={resetDeptForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-bold">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-semibold">All Departments ({departments.length})</h3>
                {!showDeptForm && (
                  <button
                    onClick={() => {
                      setEditingDept(null);
                      setDeptForm({ name: '', description: '' });
                      setShowDeptForm(true);
                    }}
                    className="bg-amber-500 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-600"
                  >
                    <i className="fas fa-plus-circle mr-2"></i> Add Department
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-48">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...departments].sort((a, b) => a.display_order - b.display_order).map((dept, index, arr) => (
                      <tr key={dept.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{dept.description || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{dept.display_order}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleDeptStatus(dept.id, dept.is_active)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {dept.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-1 flex items-center justify-center">
                          <button
                            onClick={() => handleMoveDept(dept.id, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                            className={`p-2 text-gray-500 hover:bg-gray-100 rounded ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <i className="fas fa-arrow-up"></i>
                          </button>
                          <button
                            onClick={() => handleMoveDept(dept.id, 'down')}
                            disabled={index === arr.length - 1}
                            title="Move Down"
                            className={`p-2 text-gray-500 hover:bg-gray-100 rounded ${index === arr.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <i className="fas fa-arrow-down"></i>
                          </button>
                          <button 
                            onClick={() => handleEditDept(dept)} 
                            className="p-2 text-[#1e3a8a] hover:bg-blue-50 rounded"
                            title="Edit Department"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteDept(dept.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete Department"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedResume && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl h-5/6 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold">Resume: {selectedResume.name}</h3>
                <button onClick={() => setSelectedResume(null)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <iframe src={selectedResume.url} className="w-full h-full" title="Resume" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}