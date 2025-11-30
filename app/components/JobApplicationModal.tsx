'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface JobDetails {
  title: string;
  description: string;
  location: string;
  salary: string;
  requirements: string[];
}

const allJobDetails: Record<string, JobDetails> = {
  PM_HIGHWAYS: {
    title: 'Project Manager (Highways)',
    description: 'Oversee all phases of major highway and road projects, ensuring compliance with NHAI/State PWD standards, managing site engineers, budget, resource allocation, and project schedule from conception to completion.',
    location: 'Madurai, TN (Head Office and Site Visits)',
    salary: 'Negotiable, based on extensive experience and project history.',
    requirements: [
      'B.E./B.Tech in Civil Engineering is mandatory.',
      'Minimum 5 years of proven experience in managing large-scale NHAI/State Road projects.',
      'Strong leadership, communication, and contract management skills.',
      'Proficiency in project management software, site safety protocols, and quality assurance procedures.',
    ],
  },
  SITE_ENGINEER: {
    title: 'Civil Site Engineer (Bridges/ROBs)',
    description: 'Responsible for day-to-day site supervision of structural works, including bridges (ROBs) and flyovers. Ensure work quality, manage labor, and report progress to the Project Manager.',
    location: 'Site-based across South India (Travel Required)',
    salary: 'Competitive, starting at ₹4.5 Lakhs P.A. + Site Allowance',
    requirements: [
      'B.E. Civil Engineering or equivalent diploma.',
      '2-4 Years Experience, specifically in structural civil work (bridge or building construction) preferred.',
      'Ability to read and interpret complex structural drawings.',
      'Knowledge of safety regulations and quality control standards.',
    ],
  },
  SR_ACCOUNTANT: {
    title: 'Senior Accountant',
    description: 'Manage the construction company\'s full cycle accounting operations, including payroll, GST compliance, financial reporting, and liaison with auditors and project accountants.',
    location: 'Madurai Head Office | Full-Time',
    salary: 'Best in industry for 7+ years of experience.',
    requirements: [
      'B.Com or M.Com degree.',
      'Minimum 7+ years experience in the construction industry financial management.',
      'Mandatory proficiency in Tally ERP, GST filing, TDS, and other statutory compliances.',
      'Excellent analytical and problem-solving skills.',
    ],
  },
  MACHINERY_OP: {
    title: 'Heavy Machinery Operator (Crushers/Batching)',
    description: 'Operate and maintain heavy-duty quarry and road construction equipment such as stone crushers, asphalt batching plants, and large excavators. Ensure safe and efficient operation at all times.',
    location: 'Quarry/Plant Sites | Full-Time',
    salary: 'Based on skill, certifications, and experience.',
    requirements: [
      'Valid heavy equipment operating license is essential.',
      'Minimum 5+ years experience operating high-capacity crushers or asphalt batching plants.',
      'Proven mechanical aptitude for basic maintenance and troubleshooting.',
      'Commitment to high safety standards.',
    ],
  },
};

const activeJobs = [
  { id: 'PM_HIGHWAYS', title: 'Project Manager (Highways)', location: 'Madurai, TN | Full-Time', experience: '5+ Years Experience in NHAI/State Road Projects required.' },
  { id: 'SITE_ENGINEER', title: 'Civil Site Engineer (Bridges/ROBs)', location: 'Site-based across South India | Full-Time', experience: 'B.E. Civil with 2-4 Years Experience, structural work preferred.' },
  { id: 'SR_ACCOUNTANT', title: 'Senior Accountant', location: 'Madurai Head Office | Full-Time', experience: 'Proficiency in Tally/GST, 7+ years experience in construction finance.' },
  { id: 'MACHINERY_OP', title: 'Heavy Machinery Operator (Crushers/Batching)', location: 'Quarry/Plant Sites | Full-Time', experience: 'Valid heavy equipment license and 5+ years experience.' },
];

export default function JobApplicationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);

  const openModal = (jobId: string) => {
    const job = allJobDetails[jobId];
    if (job) {
      setSelectedJob(job);
      setIsOpen(true);
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedJob(null);
    document.body.classList.remove('overflow-hidden');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application Submitted (Placeholder)');
    closeModal();
  };

  return (
    <>
      {/* Job Listings */}
      {activeJobs.map((job) => (
        <div
          key={job.id}
          className="bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition duration-300 border-l-8 border-amber-500"
        >
          <div className="mb-4 md:mb-0 md:w-3/4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-blue-900">{job.title}</h3>
            <p className="text-gray-600 mt-1">{job.location}</p>
            <p className="text-sm text-blue-700 mt-2">{job.experience}</p>
          </div>
          <button
            onClick={() => openModal(job.id)}
            className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors w-full md:w-auto text-center"
          >
            Apply Now
          </button>
        </div>
      ))}

      {/* Modal */}
      {isOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[9999] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="sticky top-0 right-0 float-right m-4 text-gray-400 hover:text-gray-700 z-50 bg-white p-2 rounded-full shadow-lg"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8 pt-0">
              <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Application for:</h2>

              <div className="mb-6 p-4 bg-amber-500 rounded-lg shadow-md sticky top-0 z-40">
                <p className="text-2xl font-bold text-gray-900 uppercase">{selectedJob.title}</p>
              </div>

              <div className="pr-4 mb-8 max-h-[40vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">
                  Job Description
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{selectedJob.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600">Location:</p>
                    <p className="text-md font-medium text-gray-900">{selectedJob.location}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600">Salary:</p>
                    <p className="text-md font-medium text-gray-900">{selectedJob.salary}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b pb-2">
                  Key Requirements
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase border-b pb-2">
                Your Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="cv_file" className="block text-sm font-medium text-gray-700">
                    Upload CV/Resume (.pdf, .docx) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="cv_file"
                    id="cv_file"
                    required
                    accept=".pdf,.doc,.docx"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}