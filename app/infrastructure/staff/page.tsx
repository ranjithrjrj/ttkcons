import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Staff & Team | TTK Constructions Infrastructure',
  description: 'Meet the skilled, dedicated team that drives TTK\'s reputation for quality civil works.',
};

export default function StaffPage() {
  return (
    <main>
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg font-semibold uppercase tracking-wider text-amber-500 mb-2">
            Infrastructure / Personnel
          </p>
          <h1 className="text-6xl font-extrabold text-white mb-4">Our Talented Team</h1>
          <p className="text-xl font-light max-w-3xl">
            The skill, dedication, and leadership that drive TTK&apos;s reputation for quality civil works and project excellence across India.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link
              href="/infrastructure"
              className="text-blue-900 font-semibold hover:text-amber-500 p-3 border rounded-lg bg-white shadow-md"
            >
              📋 Infrastructure Overview
            </Link>
            <Link
              href="/infrastructure/equipment"
              className="text-blue-900 font-semibold hover:text-amber-500 p-3 border rounded-lg bg-white shadow-md"
            >
              🚚 Equipment Fleet
            </Link>
            <span className="bg-amber-500 text-blue-900 font-bold p-3 border rounded-lg shadow-md">
              👥 **Our Staff & Team**
            </span>
          </div>

          <div className="bg-white p-10 rounded-xl shadow-2xl mb-16 border-t-8 border-amber-500">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Team Strength at a Glance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4 border-r md:border-r-2 border-gray-200">
                <p className="text-4xl font-extrabold text-blue-900">10+</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">Project Managers</p>
              </div>
              <div className="p-4 border-r md:border-r-2 border-gray-200">
                <p className="text-4xl font-extrabold text-amber-500">50+</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">Site Engineers</p>
              </div>
              <div className="p-4 border-r-0 md:border-r-2 border-gray-200">
                <p className="text-4xl font-extrabold text-blue-900">300+</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">Skilled Manpower</p>
              </div>
              <div className="p-4">
                <p className="text-4xl font-extrabold text-amber-500">15 Yrs+</p>
                <p className="text-lg font-semibold text-gray-700 mt-1">
                  Average Leadership Experience
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-12">
            Organizational Structure & Expertise
          </h2>

          <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg shadow-xl border-l-8 border-blue-900 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1 text-center">
                <div className="text-5xl text-blue-900 mb-3">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900">Corporate & Strategy</h3>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 mb-3">
                  Our <strong>Senior Leadership</strong> team focuses on strategic growth, financial stewardship, risk management, and maintaining key relationships with government bodies and major clients.
                </p>
                <ul className="flex flex-wrap gap-4 text-sm font-medium text-blue-900">
                  <li className="bg-blue-100 p-2 rounded-full px-4">📈 Financial Planning</li>
                  <li className="bg-blue-100 p-2 rounded-full px-4">🤝 Client Relations</li>
                  <li className="bg-blue-100 p-2 rounded-full px-4">⚖️ Contract Management</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border-l-8 border-amber-500 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1 text-center">
                <div className="text-5xl text-amber-500 mb-3">🦺</div>
                <h3 className="text-2xl font-bold text-gray-900">Project & Quality Control</h3>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 mb-3">
                  The <strong>Project Management Unit</strong> is responsible for on-site execution, adherence to technical specifications (MoRT&H, IRC), and implementing stringent QA/QC protocols.
                </p>
                <ul className="flex flex-wrap gap-4 text-sm font-medium text-amber-700">
                  <li className="bg-amber-100 p-2 rounded-full px-4">🛣️ Highway Experts</li>
                  <li className="bg-amber-100 p-2 rounded-full px-4">📐 Design & Engineering</li>
                  <li className="bg-amber-100 p-2 rounded-full px-4">🧪 Material Testing</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl border-l-8 border-green-700 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1 text-center">
                <div className="text-5xl text-green-700 mb-3">🛡️</div>
                <h3 className="text-2xl font-bold text-gray-900">HSE & Operations</h3>
              </div>
              <div className="lg:col-span-3">
                <p className="text-gray-600 mb-3">
                  Our <strong>Health, Safety, and Environment (HSE)</strong> team ensures all operations meet statutory safety norms. The Operations team manages fleet deployment and maintenance.
                </p>
                <ul className="flex flex-wrap gap-4 text-sm font-medium text-green-700">
                  <li className="bg-green-100 p-2 rounded-full px-4">🩹 Zero-Harm Culture</li>
                  <li className="bg-green-100 p-2 rounded-full px-4">🚛 Fleet Logistics</li>
                  <li className="bg-green-100 p-2 rounded-full px-4">🔧 Maintenance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/careers"
              className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors inline-block"
            >
              Join Our High-Performance Team 💼
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}