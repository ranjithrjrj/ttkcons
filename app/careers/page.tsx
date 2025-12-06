// app/careers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import JobDetailsModal from '@/app/components/JobDetailsModal';
import Pagination from '@/app/components/Pagination';

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
}

interface ModalState {
  job: JobPosting;
  canApply: boolean;
}

const ITEMS_PER_PAGE = 6;

export default function CareersPage() {
  const [activeJobs, setActiveJobs] = useState<JobPosting[]>([]);
  const [previousOpenings, setPreviousOpenings] = useState<JobPosting[]>([]);
  const [modalState, setModalState] = useState<ModalState | null>(null); 
  const [loading, setLoading] = useState(true);
  
  const [activeJobsPage, setActiveJobsPage] = useState(1);
  const [previousOpeningsPage, setPreviousOpeningsPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('posted_date', { ascending: false });

      if (error) throw error;
      
      const allJobs: JobPosting[] = data || [];
      
      setActiveJobs(allJobs.filter(job => job.status === 'Active'));
      setPreviousOpenings(allJobs.filter(job => job.status !== 'Active'));

    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job: JobPosting, canApply: boolean) => {
    setModalState({ job, canApply });
  };

  const closeModal = () => {
    setModalState(null);
  };

  // Pagination for active jobs
  const activeJobsTotalPages = Math.ceil(activeJobs.length / ITEMS_PER_PAGE);
  const paginatedActiveJobs = activeJobs.slice(
    (activeJobsPage - 1) * ITEMS_PER_PAGE,
    activeJobsPage * ITEMS_PER_PAGE
  );

  // Pagination for previous openings
  const previousOpeningsTotalPages = Math.ceil(previousOpenings.length / ITEMS_PER_PAGE);
  const paginatedPreviousOpenings = previousOpenings.slice(
    (previousOpeningsPage - 1) * ITEMS_PER_PAGE,
    previousOpeningsPage * ITEMS_PER_PAGE
  );

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
            Job Openings
          </h2>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 uppercase border-b border-amber-500 pb-2 mb-4">
              Current Vacancies ({activeJobs.length})
            </h3>

            {activeJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <p className="text-xl text-gray-600">No active job openings at the moment. Check back soon!</p>
              </div>
            ) : (
              <>
                {paginatedActiveJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition duration-300 ${
                      job.is_featured 
                        ? 'border-l-8 border-amber-500 bg-gradient-to-r from-amber-50 to-white relative' 
                        : 'border-l-8 border-amber-500'
                    }`}
                  >
                    {job.is_featured && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        ⭐ FEATURED
                      </div>
                    )}
                    <div className="mb-4 md:mb-0 md:w-3/4 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-blue-900">{job.title}</h3>
                      <p className="text-gray-600 mt-1">{job.location} | {job.employment_type}</p>
                      {job.experience_required && (
                        <p className="text-sm text-blue-700 mt-2">{job.experience_required} required.</p>
                      )}
                    </div>
                    <button
                      onClick={() => openModal(job, true)} 
                      className={`font-bold px-8 py-3 rounded shadow-xl transition w-full md:w-auto ${
                        job.is_featured
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-amber-500 text-blue-900 hover:bg-amber-600'
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}

                {activeJobsTotalPages > 1 && (
                  <Pagination
                    currentPage={activeJobsPage}
                    totalPages={activeJobsTotalPages}
                    onPageChange={setActiveJobsPage}
                  />
                )}
              </>
            )}
          </div>
          
          {previousOpenings.length > 0 && (
            <div className="space-y-6 mt-16">
              <h3 className="text-2xl font-bold text-gray-900 uppercase border-b border-blue-900 pb-2 mb-4">
                  Previous Openings ({previousOpenings.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPreviousOpenings.map((job) => (
                      <div key={job.id} 
                           className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gray-400 cursor-pointer hover:shadow-xl transition"
                           onClick={() => openModal(job, false)} 
                      >
                          <h4 className="text-xl font-bold text-gray-800">{job.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{job.department}</p>
                          <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                          <div className="mt-3">
                              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {job.status}
                              </span>
                          </div>
                          <p className="mt-3 text-sm text-blue-600 font-semibold hover:underline">View Details</p>
                      </div>
                  ))}
              </div>

              {previousOpeningsTotalPages > 1 && (
                <Pagination
                  currentPage={previousOpeningsPage}
                  totalPages={previousOpeningsTotalPages}
                  onPageChange={setPreviousOpeningsPage}
                />
              )}
            </div>
          )}

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

      {modalState && (
        <JobDetailsModal
          job={modalState.job}
          canApply={modalState.canApply}
          onClose={closeModal}
          onApplicationSuccess={closeModal} 
        />
      )}
    </main>
  );
}