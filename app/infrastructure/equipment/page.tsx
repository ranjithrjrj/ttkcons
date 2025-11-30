import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Equipment Fleet | TTK Constructions Infrastructure',
  description: 'Explore TTK Constructions\' modern, high-capacity fleet of construction machinery.',
};

const equipmentData = {
  pavement: [
    {
      title: '120 TPH Asphalt Batching Plant',
      category: 'Road Construction | Bituminous Works',
      quantity: '2 Units',
      specs: ['Capacity: 120 Tonnes per hour (TPH)', 'Feature: Fully Automated & Computerized Control'],
      image: 'https://placehold.co/600x400/1e3a8a/FFFFFF?text=Asphalt+Batch+Plant',
    },
    {
      title: 'Hydrostatic Sensor Paver',
      category: 'Road Laying | High Precision',
      quantity: '4 Units',
      specs: ['Technology: Electronic Sensor for grade control', 'Application: DBM, BC, and WMM layers'],
      image: 'https://placehold.co/600x400/fbbf24/1e3a8a?text=Sensor+Paver',
    },
    {
      title: 'Heavy Duty Vibratory Roller',
      category: 'Soil & Aggregate Compaction',
      quantity: '8 Units',
      specs: ['Weight Range: 8 Tonne to 12 Tonne', 'Feature: High-frequency, dual-amplitude settings'],
      image: 'https://placehold.co/600x400/4c78a9/FFFFFF?text=Vibratory+Roller',
    },
  ],
  structural: [
    {
      title: 'Hydraulic Excavators',
      category: 'Mass Excavation | Quarrying',
      quantity: '10+ Units',
      specs: ['Capacity: 0.8m³ to 2.5m³ bucket size', 'Feature: Rock Breaker attachment availability'],
      image: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=Hydraulic+Excavator',
    },
    {
      title: 'Concrete Batching Plants (RMC)',
      category: 'Bridge & Culvert Works | PQC',
      quantity: '3 Units',
      specs: ['Capacity: 30m³/hr to 60m³/hr', 'Support: Large fleet of Transit Mixers'],
      image: 'https://placehold.co/600x400/27ae60/FFFFFF?text=Concrete+Batch+Plant',
    },
    {
      title: 'Motor Graders',
      category: 'Sub-grade Preparation | Finishing',
      quantity: '3 Units',
      specs: ['Feature: High-precision blade control', 'Application: Base, Sub-base, and shoulder work'],
      image: 'https://placehold.co/600x400/f39c12/FFFFFF?text=Motor+Grader',
    },
  ],
};

export default function EquipmentPage() {
  return (
    <main>
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg font-semibold uppercase tracking-wider text-amber-500 mb-2">
            Infrastructure / Equipment
          </p>
          <h1 className="text-6xl font-extrabold text-white mb-4">The TTK Machinery Fleet</h1>
          <p className="text-xl font-light max-w-3xl">
            Our modern, high-capacity fleet of construction machinery is the backbone of our operational excellence, ensuring precision and reliability on every site.
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
            <span className="bg-amber-500 text-blue-900 font-bold p-3 border rounded-lg shadow-md">
              🚚 **Equipment Fleet**
            </span>
            <Link
              href="/infrastructure/staff"
              className="text-blue-900 font-semibold hover:text-amber-500 p-3 border rounded-lg bg-white shadow-md"
            >
              👥 Our Staff & Team
            </Link>
          </div>

          <h2 className="text-4xl font-extrabold text-center embossed-heading uppercase mb-16">
            Featured Fleet Categories
          </h2>

          {/* Pavement Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-amber-500 pb-2 flex items-center">
              🛣️ Pavement & Compaction Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipmentData.pavement.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300"
                >
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="font-semibold text-blue-900">
                        ✓ Quantity: {item.quantity}
                      </li>
                      {item.specs.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structural Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-amber-500 pb-2 flex items-center">
              🏗️ Structural & Earth Moving Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipmentData.structural.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300"
                >
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="font-semibold text-blue-900">
                        ✓ Quantity: {item.quantity}
                      </li>
                      {item.specs.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors inline-block"
            >
              Discuss Project Resource Allocation 📞
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}