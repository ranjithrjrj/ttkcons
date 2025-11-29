import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Infrastructure | TTK Constructions',
  description: 'Explore TTK Constructions\' modern machinery fleet and infrastructure capabilities.',
};

export default function InfrastructurePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            Our Infrastructure & Capabilities
          </h1>
          <p className="text-xl font-light max-w-2xl">
            Explore our modern machinery fleet, technical expertise, and infrastructure that powers South India&apos;s development.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-12 rounded-lg shadow-xl">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Under Construction</h2>
            <p className="text-lg text-gray-600 mb-8">
              This page is currently being developed. Please check back soon for detailed information about our infrastructure capabilities.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
              >
                Go to Homepage
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center bg-blue-900 text-white font-bold px-8 py-3 rounded shadow-md hover:bg-blue-800 transition-colors"
              >
                View Our Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}