import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | TTK Constructions - Infrastructure Pioneers',
  description: 'Learn about TTK Constructions, a leading Class-I Government Contractor with 40+ years of excellence in South Indian infrastructure development.',
};

const teamMembers = [
  {
    name: 'Mr. T. Thanikodi',
    role: 'Director',
    description: 'Visionary leader guiding corporate strategy and overseeing the company\'s long-term growth initiatives.',
    image: 'https://placehold.co/400x400/3b82f6/FFFFFF?text=T.+Thanikodi%0ADirector',
  },
  {
    name: 'Ms. T. Pavalakodi',
    role: 'Chief Executive Officer (CEO)',
    description: 'Responsible for all daily operations, business development, and ensuring project profitability and delivery.',
    image: 'https://placehold.co/400x400/3b82f6/FFFFFF?text=T.+Pavalakodi%0ACEO',
  },
  {
    name: 'Mr. T. Sivakumar',
    role: 'Chief Financial Officer (CFO)',
    description: 'Oversees all corporate financial operations, investment strategy, and compliance with statutory regulations.',
    image: 'https://placehold.co/400x400/3b82f6/FFFFFF?text=T.+Sivakumar%0ACFO',
  },
  {
    name: 'Mr. T. Rajavel Pandian',
    role: 'Chief Technical Officer (CTO)',
    description: 'Leads all engineering and technical innovation, ensuring the adoption of best practices and quality control standards.',
    image: 'https://placehold.co/400x400/3b82f6/FFFFFF?text=T.+Rajavel+Pandian%0ACTO',
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            40+ Years of Building India&apos;s Future
          </h1>
          <p className="text-xl font-light max-w-3xl">
            Since our founding, TTK Constructions has been at the forefront of vital infrastructure development, delivering excellence across South India&apos;s road, irrigation, and structural projects.
          </p>
        </div>
      </section>

      {/* Foundation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase text-amber-600">Our Foundation</span>
              <h2 className="text-4xl font-extrabold embossed-heading uppercase mb-6">
                Pioneering Infrastructure Solutions in South India
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TTK Constructions was established in <strong>1980</strong> with a commitment to quality and ethical delivery of government contracts. We are a leading <strong>Class-I Government Contractor</strong> specializing in the development of <strong>major civil engineering projects</strong> across transportation (highways, rail structures) and water infrastructure.
              </p>
              <p className="text-lg text-gray-600">
                Our success is rooted in our vast fleet of modern equipment, deep engineering expertise, and an unwavering focus on operational efficiency, safety, and the highest compliance standards. We are dedicated to building vital connectivity and sustainable growth in South India.
              </p>
              <Link
                href="/infrastructure"
                className="mt-6 inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
              >
                Learn More About Our Capabilities
              </Link>
            </div>
            <div className="shadow-2xl rounded-xl overflow-hidden">
              <img
                src="https://placehold.co/800x600/1e3a8a/FFFFFF?text=TTK+Completed+Road+Project"
                alt="Completed highway road construction project in India"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold embossed-heading uppercase mb-12">
            Our Guiding Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-900">
              <div className="text-5xl text-blue-900 mb-4">👁️</div>
              <h3 className="text-2xl font-bold uppercase mb-3">Vision</h3>
              <p className="text-gray-600">
                To be recognized as the most trusted and technically proficient infrastructure firm in South India, setting benchmarks for quality, speed, and safety in public works.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-amber-500">
              <div className="text-5xl text-amber-500 mb-4">🎯</div>
              <h3 className="text-2xl font-bold uppercase mb-3">Mission</h3>
              <p className="text-gray-600">
                To deliver complex, time-bound government infrastructure projects using state-of-the-art technology and collaborative practices, ensuring maximum value for stakeholders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-900">
              <div className="text-5xl text-blue-900 mb-4">🛡️</div>
              <h3 className="text-2xl font-bold uppercase mb-3">Core Values</h3>
              <ul className="list-disc list-inside text-gray-600 text-left mx-auto max-w-xs">
                <li>Integrity & Trust</li>
                <li>Safety First</li>
                <li>Engineering Excellence</li>
                <li>Sustainable Practice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase text-blue-900 block text-center">
            The Driving Force
          </span>
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Meet Our Promoters & Key Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-xl overflow-hidden border-b-4 border-amber-500"
              >
                <img
                  src={member.image}
                  alt={`Image of ${member.name}, ${member.role}`}
                  className="w-full h-[200px] object-cover object-top"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-900 font-semibold mt-1">{member.role}</p>
                  <p className="text-sm text-gray-500 mt-3">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}