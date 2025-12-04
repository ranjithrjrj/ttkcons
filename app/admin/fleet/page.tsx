// app/admin/fleet/page.tsx
'use client';

import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

type Section = 'manage-equipment' | 'add-equipment';

interface Equipment {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: 'Operational' | 'Maintenance' | 'Retired';
  description?: string;
}

export default function AdminFleet() {
  const [activeSection, setActiveSection] = useState<Section>('manage-equipment');

  // Mock data - will be replaced with Supabase data later
  const equipment: Equipment[] = [
    {
      id: 1,
      name: 'Hydraulic Excavator (CAT 320D)',
      category: 'Earth Moving',
      quantity: 8,
      status: 'Operational',
      description: 'Heavy-duty excavators for large-scale excavation work',
    },
    {
      id: 2,
      name: 'Backhoe Loader (JCB 3DX)',
      category: 'Earth Moving',
      quantity: 12,
      status: 'Operational',
      description: 'Versatile machines for digging, loading, and backfilling',
    },
    {
      id: 3,
      name: 'Motor Grader (Caterpillar 140M)',
      category: 'Road Construction',
      quantity: 5,
      status: 'Operational',
      description: 'For fine grading and leveling road surfaces',
    },
    {
      id: 4,
      name: 'Asphalt Paver (Vogele Super 1800-3i)',
      category: 'Road Construction',
      quantity: 4,
      status: 'Operational',
      description: 'High-precision asphalt laying machines',
    },
    {
      id: 5,
      name: 'Vibratory Roller (10-12 Ton)',
      category: 'Compaction',
      quantity: 10,
      status: 'Operational',
      description: 'For soil and asphalt compaction',
    },
    {
      id: 6,
      name: 'Stone Crusher (Jaw Type)',
      category: 'Processing',
      quantity: 3,
      status: 'Maintenance',
      description: 'Primary crushing equipment for aggregate production',
    },
    {
      id: 7,
      name: 'Concrete Batching Plant',
      category: 'Processing',
      quantity: 2,
      status: 'Operational',
      description: 'Automated concrete mixing plants',
    },
    {
      id: 8,
      name: 'Transit Mixer (6 Cubic Meter)',
      category: 'Transport',
      quantity: 15,
      status: 'Operational',
      description: 'For transporting ready-mix concrete',
    },
  ];

  const categories = [
    'Earth Moving',
    'Road Construction',
    'Compaction',
    'Processing',
    'Transport',
    'Lifting & Hoisting',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Equipment saved! (This will be connected to Supabase)');
    setActiveSection('manage-equipment');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Earth Moving':
        return 'fa-tractor';
      case 'Road Construction':
        return 'fa-road';
      case 'Compaction':
        return 'fa-compress';
      case 'Processing':
        return 'fa-industry';
      case 'Transport':
        return 'fa-truck';
      case 'Lifting & Hoisting':
        return 'fa-crane';
      default:
        return 'fa-tools';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Equipment Fleet Management</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage the construction equipment and machinery inventory.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('manage-equipment')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'manage-equipment'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Equipment
            </button>
            <button
              onClick={() => setActiveSection('add-equipment')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeSection === 'add-equipment'
                  ? 'border-[#fbbf24] text-[#1e3a8a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add New Equipment
            </button>
          </nav>
        </div>

        {/* Manage Equipment Section */}
        {activeSection === 'manage-equipment' && (
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-[#1e3a8a]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Total Equipment Types</p>
                  <i className="fas fa-tools text-2xl text-[#1e3a8a]"></i>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">{equipment.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Operational</p>
                  <i className="fas fa-check-circle text-2xl text-green-500"></i>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {equipment.filter((e) => e.status === 'Operational').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">In Maintenance</p>
                  <i className="fas fa-wrench text-2xl text-yellow-500"></i>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {equipment.filter((e) => e.status === 'Maintenance').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-[#fbbf24]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">Total Units</p>
                  <i className="fas fa-layer-group text-2xl text-[#fbbf24]"></i>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {equipment.reduce((sum, e) => sum + e.quantity, 0)}
                </p>
              </div>
            </div>

            {/* Equipment List */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Equipment Inventory</h3>
                <button
                  onClick={() => setActiveSection('add-equipment')}
                  className="bg-[#fbbf24] text-[#1e3a8a] px-4 py-2 rounded-lg font-bold hover:bg-[#f59e0b] transition duration-300 shadow-md"
                >
                  <i className="fas fa-plus-circle mr-2"></i> Add Equipment
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipment Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 relative">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipment.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <i className={`fas ${getCategoryIcon(item.category)} mr-2 text-[#1e3a8a]`}></i>
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {item.quantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-[#1e3a8a] hover:text-blue-700" title="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Delete">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add New Equipment Section */}
        {activeSection === 'add-equipment' && (
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#fbbf24]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-semibold text-gray-800">Add New Equipment</h3>
              <button
                onClick={() => setActiveSection('manage-equipment')}
                className="text-gray-500 hover:text-red-600 transition duration-300"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="equipment-name" className="block text-sm font-medium text-gray-700">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    id="equipment-name"
                    name="equipment-name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="e.g., Hydraulic Excavator (CAT 320D)"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description / Specifications
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Brief description of equipment capabilities and specifications..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-md font-bold text-lg shadow-md hover:bg-[#2558a7] transition duration-300"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Equipment Fleet Management Version.
        </footer>
      </div>
    </div>
  );
}