'use client';

import Marquee from 'react-fast-marquee';
import Image from 'next/image';

const clients = [
  { name: 'NHAI', logo: 'https://placehold.co/150x50/ffffff/1e3a8a?text=NHAI' },
  { name: 'PWD', logo: 'https://placehold.co/150x50/ffffff/1e3a8a?text=PWD' },
  { name: 'Tamil Nadu Highways', logo: 'https://placehold.co/150x50/ffffff/1e3a8a?text=TN+Highways' },
  { name: 'Southern Railway', logo: 'https://placehold.co/150x50/ffffff/1e3a8a?text=Southern+Railway' },
  { name: 'Madhucon', logo: 'https://placehold.co/150x50/ffffff/1e3a8a?text=Madhucon' },
];

export default function ClientMarquee() {
  return (
    <section className="py-12 bg-gray-200 border-y border-gray-300 shadow-inner">
      <h2 className="text-center text-3xl font-extrabold embossed-heading uppercase mb-6">
        Trusted by Our Clients
      </h2>
      <Marquee gradient={false} speed={50} className="py-4">
        {clients.map((client, index) => (
          <div key={index} className="mx-8">
            <img
              src={client.logo}
              alt={`${client.name} Logo`}
              className="h-12 w-auto filter grayscale opacity-70 hover:opacity-100 transition duration-300"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}