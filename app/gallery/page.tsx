// app/gallery/page.tsx
import type { Metadata } from 'next';
import GalleryContent from '@/app/components/GalleryContent';

export const metadata: Metadata = {
  title: 'Gallery | TTK Constructions - Visual Portfolio',
  description: 'Explore photos showcasing the quality of our work, professionalism of our team, and the culture of TTK Constructions.',
};

export default function GalleryPage() {
  return (
    <main>
      <GalleryContent />
    </main>
  );
}