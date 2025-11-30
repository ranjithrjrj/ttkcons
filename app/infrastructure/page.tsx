import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Infrastructure Domains | TTK Constructions',
  description: 'Explore TTK Constructions\' core infrastructure domains across roads, bridges, water resources, and railways.',
};

export default function InfrastructurePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">
            Our Core Infrastructure Domains
          </h1>
          <p className="text-xl font-light max-w-2xl">
            A commitment to building the foundational networks of modern India. Explore the key sectors where our expertise shapes the future, backed by our world-class resources.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            The Pillars of TTK&apos;s Capability
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-xl border-t-8 border-blue-900 flex flex-col items-start">
              <div className="text-5xl text-blue-900 mb-4">👥</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Qualified Personnel</h3>
              <p className="text-lg text-gray-600 mb-6 flex-grow">
                Our workforce is our greatest asset, comprising highly experienced civil engineers, specialized foremen, skilled operators, and dedicated safety personnel.
              </p>
              <Link
                href="/infrastructure/staff"
                className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
              >
                Meet Our Team →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border-t-8 border-amber-500 flex flex-col items-start">
              <div className="text-5xl text-amber-500 mb-4">🚚</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Modern Machinery Fleet</h3>
              <p className="text-lg text-gray-600 mb-6 flex-grow">
                TTK owns and maintains a vast fleet of the latest construction equipment, from high-capacity asphalt batching plants to specialized piling rigs.
              </p>
              <Link
                href="/infrastructure/equipment"
                className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-800 transition duration-300"
              >
                View Full Equipment List →
              </Link>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Specialized Expertise Across Key Sectors
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <div className="text-5xl text-amber-500 mb-4">🛣️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2">
                Roads & National Highways
              </h3>
              <p className="text-gray-600 mb-4">
                We are experts in large-scale road projects, including NHAI widening and overlay works. Our focus on <strong>Pavement Quality Concrete (PQC)</strong> and advanced asphalt technology ensures long-lasting, high-speed connectivity.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                <li>End-to-end execution of road widening projects.</li>
                <li>High-capacity hot mix plants for bituminous works.</li>
                <li>Compliance with strict MoRT&H and IRC standards.</li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <div className="text-5xl text-amber-500 mb-4">🌉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2">
                Bridges & Complex Structures
              </h3>
              <p className="text-gray-600 mb-4">
                Our structural division handles complex engineering challenges, from <strong>Rail Over Bridges (ROBs)</strong> to flyovers and viaducts. We prioritize minimizing public disruption using specialized construction methods.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                <li>Expertise in pre-stressed concrete and pile foundations.</li>
                <li>Construction of critical Rail Over Bridges (ROBs).</li>
                <li>Innovative formwork and shoring solutions for flyovers.</li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <div className="text-5xl text-amber-500 mb-4">💧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2">
                Water Resource & Sanitation
              </h3>
              <p className="text-gray-600 mb-4">
                We undertake essential projects for resource management, including <strong>major canal lining</strong> and cross-drainage structures. Our solutions aim for sustainability and efficiency in water distribution networks.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                <li>Large-scale canal lining projects for irrigation.</li>
                <li>Construction of check dams and water harvesting systems.</li>
                <li>Civil works for pumping stations and treatment facilities.</li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
              <div className="text-5xl text-amber-500 mb-4">🚂</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b pb-2">
                Railways & Metropolitan Transit
              </h3>
              <p className="text-gray-600 mb-4">
                Our specialized railway team executes projects like <strong>industrial railway sidings</strong> and track laying. We meet the rigorous safety and quality standards set by the Indian Railways and Metro authorities.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 text-sm">
                <li>Construction of dedicated industrial railway sidings.</li>
                <li>Earthwork and sub-base preparation for new rail lines.</li>
                <li>Adherence to strict RDSO quality and safety norms.</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/projects"
              className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors text-lg inline-block"
            >
              VIEW OUR INFRASTRUCTURE PROJECTS IN DETAIL →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}