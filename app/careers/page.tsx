'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

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
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume: null as File | null
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'Active')
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job: JobPosting) => {
    setSelectedJob(job);
    setApplicationData({
      full_name: '',
      email: '',
      phone: '',
      resume: null
    });
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({ ...applicationData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!applicationData.resume || !selectedJob) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = applicationData.resume.name.split('.').pop();
      const filePath = `${timestamp}.${fileExt}`;

      // Upload resume to storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, applicationData.resume);

      if (uploadError) throw uploadError;

      // Insert application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([{
          job_posting_id: selectedJob.id,
          applicant_name: applicationData.full_name,
          email: applicationData.email,
          phone: applicationData.phone,
          resume_url: filePath,
          status: 'Pending Review',
          applied_date: new Date().toISOString().split('T')[0]
        }]);

      if (insertError) throw insertError;

      toast.success('Application submitted successfully! We will contact you soon.');
      closeModal();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRequirementsList = (requirements: string) => {
    return requirements.split('\n').filter(req => req.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50">
      <Toaster position="top-right" />
      
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Careers at TTK</h1>
          <p className="text-xl font-light max-w-2xl">
            Build the nation's infrastructure with us. We are looking for talented civil engineers, project managers, and skilled technicians to join our growing team in South India.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-amber-500 uppercase mb-4">
            Why Choose a Career at TTK?
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We offer challenging government projects, commitment to excellence, and a supportive environment for professional growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-900">
              <div className="text-4xl text-blue-900 mb-4">🗺️</div>
              <h3 className="text-xl font-bold uppercase mb-3">Impactful Projects</h3>
              <p className="text-gray-600">Work on vital national and state infrastructure—roads, bridges, and major water works.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-500">
              <div className="text-4xl text-amber-500 mb-4">📈</div>
              <h3 className="text-xl font-bold uppercase mb-3">Growth & Development</h3>
              <p className="text-gray-600">Continuous training and clear career paths within a stable, 40-year-old organization.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-900">
              <div className="text-4xl text-blue-900 mb-4">🤝</div>
              <h3 className="text-xl font-bold uppercase mb-3">Safe & Ethical Work</h3>
              <p className="text-gray-600">A strong focus on site safety, compliance, and transparent, ethical business practices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-amber-500 uppercase mb-12">
            Current Vacancies
          </h2>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 uppercase border-b border-amber-500 pb-2 mb-4">
              Active Openings
            </h3>

            {jobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-xl text-gray-600">No active job openings at the moment. Check back soon!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition duration-300 border-l-8 border-amber-500"
                >
                  <div className="mb-4 md:mb-0 md:w-3/4 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-blue-900">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.location} | {job.employment_type}</p>
                    {job.experience_required && (
                      <p className="text-sm text-blue-700 mt-2">{job.experience_required} required.</p>
                    )}
                  </div>
                  <button
                    onClick={() => openModal(job)}
                    className="bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded shadow-xl hover:bg-amber-600 transition w-full md:w-auto"
                  >
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12 p-6 bg-blue-900 text-white rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-3">
              Can't find your role? We are always looking for talent!
            </p>
            <a
              href="mailto:careers@ttkcons.in?subject=General%20Application"
              className="inline-flex items-center justify-center bg-amber-500 text-blue-900 font-bold px-8 py-3 rounded shadow-xl hover:bg-amber-600 transition"
            >
              Send Us Your CV
            </a>
          </div>
        </div>
      </section>

      {selectedJob && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="sticky top-0 right-0 float-right m-4 text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-lg z-10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 pt-0">
              <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Application for:</h2>

              <div className="mb-6 p-4 bg-amber-500 rounded-lg shadow-md">
                <p className="text-2xl font-bold text-gray-900 uppercase">{selectedJob.title}</p>
              </div>

              <div className="mb-8 max-h-64 overflow-y-auto pr-4">
                <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">Job Description</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{selectedJob.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600">Location:</p>
                    <p className="text-md font-medium text-gray-900">{selectedJob.location}</p>
                  </div>
                  {selectedJob.salary_range && (
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm font-semibold text-gray-600">Salary:</p>
                      <p className="text-md font-medium text-gray-900">{selectedJob.salary_range}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">Key Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                  {getRequirementsList(selectedJob.requirements).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase border-b pb-2">Your Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicationData.full_name}
                    onChange={(e) => setApplicationData({ ...applicationData, full_name: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload CV/Resume (.pdf, .docx) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-amber-500 text-blue-900 font-bold px-8 py-2 rounded shadow-md hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}