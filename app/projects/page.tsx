// app/projects/page.tsx
import type { Metadata } from 'next';
import ProjectsContent from '../components/ProjectsContent';

export const metadata: Metadata = {
  title: 'Our Projects | TTK Constructions - Landmark Infrastructure',
  description: 'Showcasing four decades of successful execution across vital infrastructure categories: Roads, Rail, Bridges, and Water Resources.',
};

export default function ProjectsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            Our Landmark Projects Portfolio
          </h1>
          <p className="text-xl font-light max-w-3xl">
            Showcasing four decades of successful execution across vital infrastructure categories: Roads, Rail, Bridges, and Water Resources.
          </p>
        </div>
      </section>

      {/* Projects Content with Filters and Cards */}
      <ProjectsContent />
    </main>
  );
}