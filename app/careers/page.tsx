import type { Metadata } from 'next';
import Link from 'next/link';
import JobApplicationModal from '../components/JobApplicationModal';

export const metadata: Metadata = {
  title: 'Careers | TTK Constructions',
  description: 'Join TTK Constructions and build the nation\'s infrastructure. We are looking for talented civil engineers, project managers, and skilled technicians.',
};

export default function CareersPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Careers at TTK</h1>
          <p className="text-xl font-light max-w-2xl">
            Build the nation&apos;s infrastructure with us. We are looking for talented civil engineers, project managers, and skilled technicians to join our growing team in South India.
          </p>
        </div>
      </section>

      {/* Why Choose TTK */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-4">
            Why Choose a Career at TTK?
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We offer challenging government projects, commitment to excellence, and a supportive environment for professional growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-900">
              <div className="text-4xl text-blue-900 mb-4">🗺️</div>
              <h3 className="text-xl font-bold uppercase mb-3">Impactful Projects</h3>
              <p className="text-gray-600">
                Work on vital national and state infrastructure—roads, bridges, and major water works.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-500">
              <div className="text-4xl text-amber-500 mb-4">📈</div>
              <h3 className="text-xl font-bold uppercase mb-3">Growth & Development</h3>
              <p className="text-gray-600">
                Continuous training and clear career paths within a stable, 40-year-old organization.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-900">
              <div className="text-4xl text-blue-900 mb-4">🤝</div>
              <h3 className="text-xl font-bold uppercase mb-3">Safe & Ethical Work</h3>
              <p className="text-gray-600">
                A strong focus on site safety, compliance, and transparent, ethical business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Vacancies */}
      <section className="py-20 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Current Vacancies
          </h2>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 uppercase border-b border-amber-500 pb-2 mb-4">
              Active Openings
            </h3>

            <JobApplicationModal />

            <h3 className="text-2xl font-bold text-gray-900 uppercase border-b border-gray-400 pb-2 pt-6 mb-4 mt-10">
              Previous Openings
            </h3>

            {/* Expired Jobs */}
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center border-l-8 border-gray-400 opacity-70">
              <div className="mb-4 md:mb-0 md:w-3/4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-500">
                  Tendering & Estimation Engineer{' '}
                  <span className="text-red-600 text-base font-semibold">(Expired)</span>
                </h3>
                <p className="text-gray-400 mt-1">Madurai Head Office | Closed</p>
                <p className="text-sm text-gray-500 mt-2">
                  Requirement for tendering documentation and bid preparation. Closing date: 2024-09-30.
                </p>
              </div>
              <span className="bg-gray-400 text-white px-6 py-3 w-full md:w-auto rounded-md font-semibold text-center cursor-not-allowed">
                Application Closed
              </span>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col md:flex-row justify-between items-center border-l-8 border-gray-400 opacity-70">
              <div className="mb-4 md:mb-0 md:w-3/4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-500">
                  Safety Officer{' '}
                  <span className="text-red-600 text-base font-semibold">(Expired)</span>
                </h3>
                <p className="text-gray-400 mt-1">Site-based, Pan-Tamil Nadu | Closed</p>
                <p className="text-sm text-gray-500 mt-2">
                  Required NEBOSH/IOSH certification. Closing date: 2024-07-15.
                </p>
              </div>
              <span className="bg-gray-400 text-white px-6 py-3 w-full md:w-auto rounded-md font-semibold text-center cursor-not-allowed">
                Application Closed
              </span>
            </div>
          </div>

          <div className="text-center mt-12 p-6 bg-blue-900 text-white rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-3">
              Can&apos;t find your role? We are always looking for talent!
            </p>
            <a
              href="mailto:careers@ttkcons.in?subject=General%20Application"
              className="inline-flex items-center justify-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-xl hover:bg-amber-600 transition-colors"
            >
              Send Us Your CV
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}