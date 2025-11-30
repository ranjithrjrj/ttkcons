import type { Metadata } from 'next';
import GalleryContent from '../components/GalleryContent';

export const metadata: Metadata = {
  title: 'Gallery | TTK Constructions - Visual Portfolio',
  description: 'Explore photos showcasing the quality of our work, professionalism of our team, and the culture of TTK Constructions.',
};

export default function GalleryPage() {
  return (
    <main>
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            Our Complete Photo Gallery
          </h1>
          <p className="text-xl font-light max-w-2xl">
            Showcasing the quality of our work, the professionalism of our team, and the culture of TTK Constructions.
          </p>
        </div>
      </section>

      <GalleryContent />
    </main>
  );
}