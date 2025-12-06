// app/careers/components/JobDetailsModal.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase'; // Assuming you have this import/config

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
}

interface JobDetailsModalProps {
  job: JobPosting;
  canApply: boolean; // NEW PROP: Controls visibility of the application form
  onClose: () => void;
  // Handler for when an application is successfully submitted
  onApplicationSuccess: () => void; 
}

export default function JobDetailsModal({ job, canApply, onClose, onApplicationSuccess }: JobDetailsModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({ ...applicationData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!applicationData.resume || !job) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = applicationData.resume.name.split('.').pop();
      const applicantSlug = applicationData.full_name.replace(/\s/g, '_');
      const filePath = `${job.title.replace(/\s/g, '_')}-${applicantSlug}-${timestamp}.${fileExt}`;

      // Upload resume to storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, applicationData.resume);

      if (uploadError) throw uploadError;

      // Insert application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([{
          job_posting_id: job.id,
          applicant_name: applicationData.full_name,
          email: applicationData.email,
          phone: applicationData.phone,
          resume_url: filePath,
          status: 'Pending Review',
          applied_date: new Date().toISOString().split('T')[0]
        }]);

      if (insertError) throw insertError;

      toast.success('Application submitted successfully! We will contact you soon.');
      onApplicationSuccess(); // Closes modal and resets state in parent
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

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-0 right-0 float-right m-4 text-gray-400 hover:text-gray-700 bg-white p-2 rounded-full shadow-lg z-10"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-0">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
            {canApply ? 'Application for:' : 'Job Details (Previous Opening):'}
          </h2>

          <div className="mb-6 p-4 bg-amber-500 rounded-lg shadow-md">
            <p className="text-2xl font-bold text-gray-900 uppercase">{job.title}</p>
          </div>

          <div className="mb-8 max-h-64 overflow-y-auto pr-4">
            <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">Job Description</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-semibold text-gray-600">Location:</p>
                <p className="text-md font-medium text-gray-900">{job.location}</p>
              </div>
              {job.salary_range && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Salary:</p>
                  <p className="text-md font-medium text-gray-900">{job.salary_range}</p>
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">Key Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
              {getRequirementsList(job.requirements).map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {canApply ? (
            <>
              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase border-b pb-2">Your Details</h3>

              <div className="space-y-4">
                {/* Application Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={applicationData.full_name} onChange={(e) => setApplicationData({ ...applicationData, full_name: e.target.value })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={applicationData.email} onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={applicationData.phone} onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload CV/Resume (.pdf, .docx) <span className="text-red-500">*</span></label>
                  <input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition">
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
            </>
          ) : (
            // Content for Inactive Jobs (View Only)
            <div className="mt-8 p-4 border-t border-gray-200">
              <p className="text-lg font-semibold text-red-600">
                This opening is currently closed or inactive. You cannot submit an application at this time.
              </p>
              <button onClick={onClose} className="mt-4 bg-blue-900 text-white font-bold px-8 py-2 rounded shadow-md hover:bg-blue-800 transition">
                Close Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}