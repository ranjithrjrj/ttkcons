import type { Metadata } from 'next';
import Link from 'next/link';
import ClientModals from '../components/ClientModals';

export const metadata: Metadata = {
  title: 'Our Clients | TTK Constructions',
  description: 'TTK Constructions has been the trusted Class-I contractor for critical government and public sector undertakings across South India for over four decades.',
};

export default function ClientsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Partners in Progress</h1>
          <p className="text-xl font-light max-w-2xl">
            For over four decades, TTK Constructions has been the trusted Class-I contractor for critical government and public sector undertakings across South India.
          </p>
        </div>
      </section>

      {/* Government Clients */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Our Principal Government Clientele
          </h2>

          <p className="text-center text-lg text-gray-600 max-w-4xl mx-auto mb-10">
            Click on any logo below to view the client&apos;s profile and the specific projects we have executed for them.
          </p>

          <ClientModals />

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Private Sector Partnerships */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase text-blue-900 block text-center">
            Beyond Government
          </span>
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Industrial and Private Sector Partnerships
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src="https://placehold.co/150x60/ffffff/f59e0b?text=Major+Power+PSU"
                alt="Major Power PSU Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src="https://placehold.co/150x60/ffffff/f59e0b?text=Leading+Cement+Co."
                alt="Leading Cement Company Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src="https://placehold.co/150x60/ffffff/f59e0b?text=Telecom+Infra"
                alt="Telecom Infrastructure Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img
                src="https://placehold.co/150x60/ffffff/f59e0b?text=Real+Estate+Group"
                alt="Real Estate Group Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}