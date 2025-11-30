import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gallery | TTK Constructions',
  description: 'View photos and videos of TTK Constructions\' completed projects and ongoing work.',
};

export default function GalleryPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Project Gallery</h1>
          <p className="text-xl font-light max-w-2xl">
            Explore photos and videos of our landmark infrastructure projects across South India.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-12 rounded-lg shadow-xl">
            <div className="text-6xl mb-6">📸</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gallery Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re currently curating our photo and video gallery. In the meantime, you can explore our projects page to learn more about our work.
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