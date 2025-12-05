'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
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
  posted_date: string;
}

interface JobApplication {
  id: number;
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

export default function AdminCareers() {
  const [activeSection, setActiveSection] = useState<Section>('manage-jobs');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedResume, setSelectedResume] = useState<{ url: string; name: string } | null>(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    description: '',
    location: 'Madurai, TN',
    employment_type: 'Full-Time',
    salary_range: '',
    experience_required: '',
    requirements: '',
    status: 'Active'
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
        .order('display_order');

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
      status: job.status
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
      status: 'Active'
    });
  };

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      toast.success('Status updated');
      fetchApplications();
    } catch (error) {
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
    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'Deactivated' : 'Activated');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetDeptForm = () => {
    setEditingDept(null);
    setDeptForm({ name: '', description: '' });
  };

  const activeDepartments = departments.filter(d => d.is_active);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="pb-6 border-b border-gray-300 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Careers Management</h1>
          <p className="text-lg text-gray-600 mt-1">Manage job postings, applications, and departments.</p>
        </header>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {(['manage-jobs', 'add-job', 'applications', 'manage-departments'] as Section[]).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeSection === section
                    ? 'border-amber-500 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {section === 'manage-jobs' && 'Manage Jobs'}
                {section === 'add-job' && (editingJob ? 'Edit Job' : 'Add New Job')}
                {section === 'applications' && 'Applications'}
                {section === 'manage-departments' && 'Departments'}
              </button>
            ))}
          </nav>
        </div>

        {activeSection === 'manage-jobs' && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold">Job Postings ({jobs.length})</h3>
              <button
                onClick={() => { resetJobForm(); setActiveSection('add-job'); }}
                className="bg-amber-500 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-600"
              >
                + Add Job
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{job.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 text-xs font-semibold rounded-full ${
                            job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button onClick={() => handleEditJob(job)} className="text-blue-600 hover:text-blue-900">✏️</button>
                          <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === 'add-job' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-amber-500">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold">{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <button onClick={() => { resetJobForm(); setActiveSection('manage-jobs'); }} className="text-gray-500 hover:text-red-600">✕</button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.applicant_name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                      </td>
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
          </div>
        )}

        {activeSection === 'manage-departments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500">
              <h3 className="text-xl font-semibold mb-4">{editingDept ? 'Edit' : 'Add'} Department</h3>
              
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
                  {editingDept && (
                    <button onClick={resetDeptForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-bold">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 border-b pb-4">All Departments ({departments.length})</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((dept) => (
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
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button onClick={() => handleEditDept(dept)} className="text-blue-600 hover:text-blue-900">✏️</button>
                          <button onClick={() => handleDeleteDept(dept.id)} className="text-red-600 hover:text-red-900">🗑️</button>
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