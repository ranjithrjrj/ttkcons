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
      <section className="bg-blue-900 py-24 text-white bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url(https://placehold.co/1920x800/1e3a8a/FFFFFF?text=TTK+Completed+Bridge+Project)'
      }}>
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