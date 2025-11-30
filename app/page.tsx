import Link from 'next/link';
import Image from 'next/image';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import ClientMarquee from './components/ClientMarquee';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* About Section */}
      <section className="py-20 bg-gray-200 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-base text-blue-700 font-semibold tracking-wide uppercase mb-2">
                Welcome to TTK Constructions
              </h3>
              <h2 className="text-4xl font-extrabold embossed-heading uppercase mb-6">
                Pioneers in South Indian Infrastructure
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Established as a proprietary concern in <strong>1980</strong> by <strong>Mr. T. Thanikodi</strong>, TTK Constructions has grown into a dominant force in Tamil Nadu&apos;s infrastructure sector. We converted to a partnership firm in 2005 to manage our rapidly expanding portfolio of <strong>NHAI, PWD, and Railway</strong> contracts.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-semibold border-l-4 border-amber-500 pl-4 bg-gray-50 p-4">
                Our commitment to project quality, on-time delivery, and financial stability makes us the reliable partner for government civil works.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-amber-500 text-base font-semibold rounded-md text-white bg-amber-500 hover:bg-amber-600 transition duration-300 shadow-md"
              >
                Read Our Full Legacy →
              </Link>
            </div>
            <div className="rounded-lg shadow-2xl overflow-hidden">
              <img
                src="https://placehold.co/800x500/1e3a8a/FFFFFF?text=Image+Placeholder:+TTK+Office+or+Team"
                alt="TTK Construction Office or Team Photo"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Specializations */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-4">
            Our Core Infrastructure Specializations
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Delivering high-quality, sustainable solutions across the most critical domains of public works.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-700">
              <div className="text-4xl mb-3">🛣️</div>
              <h3 className="text-xl font-extrabold mb-2 uppercase">Roads & Highways</h3>
              <p className="text-gray-600">NHAI and State Highway development, overlay works, and road maintenance contracts.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-500">
              <div className="text-4xl mb-3">🌉</div>
              <h3 className="text-xl font-extrabold mb-2 uppercase">Bridges & Rail</h3>
              <p className="text-gray-600">Construction of ROBs, VUPs, and major bridge structures for Southern Railways and State PWD.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-green-700">
              <div className="text-4xl mb-3">💧</div>
              <h3 className="text-xl font-extrabold mb-2 uppercase">Water & Irrigation</h3>
              <p className="text-gray-600">Specializing in Check Dams, canals, and essential flood control infrastructure.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-gray-900">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-extrabold mb-2 uppercase">PWD & Civil Works</h3>
              <p className="text-gray-600">Undertaking large government buildings, complex urban civil works, and other PWD contracts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Machinery Section */}
      <section className="py-20 bg-gray-200 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg shadow-2xl overflow-hidden">
              <img
                src="https://placehold.co/800x500/1e3a8a/FFFFFF?text=Image+Placeholder:+TTK+Machinery+Fleet"
                alt="Image of TTK Construction Machinery Fleet"
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-base text-amber-700 font-semibold tracking-wide uppercase mb-2">
                Resource Management
              </h3>
              <h2 className="text-4xl font-extrabold embossed-heading uppercase mb-6">
                Our Modern Machinery Fleet
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A core strength of TTK Constructions is the <strong>direct ownership</strong> of a large, sophisticated fleet of construction machinery. This eliminates dependency on external vendors, ensuring <strong>uninterrupted project timelines</strong> and the highest quality control.
              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-700 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Earth Moving:</strong> High-capacity Excavators, Backhoe Loaders, and Bulldozers.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-700 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Processing:</strong> State-of-the-art Stone Crushers and Asphalt Batching Plants.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-700 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Paving:</strong> Specialized Pavers and Rollers for road construction and overlay work.</span>
                </li>
              </ul>
              <Link
                href="/infrastructure"
                className="mt-8 inline-flex items-center justify-center px-6 py-3 border-2 border-amber-500 text-base font-semibold rounded-md text-white bg-amber-500 hover:bg-amber-600 transition duration-300 shadow-md"
              >
                Enquire About Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-4">
            Featured Project: Dindigul – Theni Highway
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            A testament to our capability in executing critical national infrastructure projects ahead of schedule.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 rounded-lg shadow-xl">
            <div className="p-4">
              <h3 className="text-3xl font-bold text-gray-900 uppercase mb-4">
                Balance Work for NH-45 (Extension)
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                TTK was entrusted with completing the challenging segments of the <strong>Two-Laning of the Dindigul – Theni section of NH-45 (Extn.)</strong>. Our expertise in rapid deployment and resource mobilization was key to stabilizing and accelerating this vital road link.
              </p>
              <ul className="space-y-3 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Client:</strong> National Highways Authority of India (NHAI)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Scope:</strong> Two-laning, pavement works, and structural repairs.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 font-bold mr-3 mt-1">✓</span>
                  <span><strong>Status:</strong> Completed and Handed Over.</span>
                </li>
              </ul>
              <Link
                href="/projects"
                className="mt-8 inline-flex items-center justify-center px-6 py-3 border-2 border-amber-500 text-base font-semibold rounded-md text-white bg-amber-500 hover:bg-amber-600 transition duration-300 shadow-md"
              >
                Explore This and More Projects →
              </Link>
            </div>

            <div className="rounded-lg shadow-2xl overflow-hidden border-4 border-blue-700">
              <img
                src="https://placehold.co/800x500/1e3a8a/FFFFFF?text=Project+Image:+Dindigul+Theni+Highway"
                alt="Dindigul Theni Highway Project"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client Marquee */}
      <ClientMarquee />

      {/* CTA Section */}
      <section className="bg-blue-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block uppercase">Ready for a partnership that delivers?</span>
            <span className="block text-amber-400 mt-2 uppercase">
              Contact us today to discuss your next civil engineering challenge.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow-lg">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-amber-500 hover:bg-amber-600"
              >
                Get In Touch Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}