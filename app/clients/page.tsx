// app/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  projects_count: number;
  is_active: boolean;
  client_type: 'government' | 'private';
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (client: Client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  // Separate government and private clients based on client_type
  const governmentClients = clients.filter(c => c.client_type === 'government');
  const privateClients = clients.filter(c => c.client_type === 'private');

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-extrabold text-amber-500 mb-4">Partners in Progress</h1>
          <p className="text-xl font-light max-w-2xl">
            For over four decades, TTK Constructions has been the trusted Class-I contractor for critical government and public sector undertakings across South India.
          </p>
        </div>
      </section>

      {/* Government Clients */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-amber-500 uppercase mb-12" style={{ textShadow: '0.5px 0.5px 0 #3b82f6, -0.5px -0.5px 0 #fcd34d' }}>
            Our Principal Government Clientele
          </h2>

          <p className="text-center text-lg text-gray-600 max-w-4xl mx-auto mb-10">
            Click on any logo below to view the client&apos;s profile and the specific projects we have executed for them.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]"></i>
              <p className="mt-4 text-gray-600">Loading our clients...</p>
            </div>
          ) : governmentClients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No government clients available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {governmentClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => openModal(client)}
                  className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[140px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer group"
                >
                  {client.logo_url && (
                    <img
                      src={client.logo_url}
                      alt={`${client.name} Logo`}
                      className="max-h-16 max-w-full object-contain mb-3"
                    />
                  )}
                  <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-[#1e3a8a] transition-colors">
                    {client.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Private Sector Partnerships */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase text-blue-900 block text-center">
            Beyond Government
          </span>
          <h2 className="text-4xl font-extrabold text-center text-amber-500 uppercase mb-12" style={{ textShadow: '0.5px 0.5px 0 #3b82f6, -0.5px -0.5px 0 #fcd34d' }}>
            Industrial and Private Sector Partnerships
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-[#1e3a8a]"></i>
              <p className="mt-4 text-gray-600">Loading clients...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {privateClients.length > 0 ? (
                privateClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => openModal(client)}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[140px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer group"
                  >
                    {client.logo_url && (
                      <img
                        src={client.logo_url}
                        alt={`${client.name} Logo`}
                        className="max-h-16 max-w-full object-contain mb-3"
                      />
                    )}
                    <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-[#1e3a8a] transition-colors">
                      {client.name}
                    </span>
                  </button>
                ))
              ) : (
                <>
                  {/* Placeholder images when no private clients exist */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <img
                      src="https://placehold.co/150x60/ffffff/f59e0b?text=Major+Power+PSU"
                      alt="Major Power PSU Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <img
                      src="https://placehold.co/150x60/ffffff/f59e0b?text=Leading+Cement+Co."
                      alt="Leading Cement Company Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <img
                      src="https://placehold.co/150x60/ffffff/f59e0b?text=Telecom+Infra"
                      alt="Telecom Infrastructure Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex items-center justify-center h-[120px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <img
                      src="https://placehold.co/150x60/ffffff/f59e0b?text=Real+Estate+Group"
                      alt="Real Estate Group Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Client Modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {selectedClient.logo_url && (
                  <img
                    src={selectedClient.logo_url}
                    alt={`${selectedClient.name} Logo`}
                    className="h-16 mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {selectedClient.description && (
              <p className="text-gray-600 mb-6">{selectedClient.description}</p>
            )}

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <i className="fas fa-project-diagram text-amber-500 text-2xl mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">Projects Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedClient.projects_count}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center bg-amber-500 text-[#1e3a8a] font-bold px-6 py-2 rounded shadow-md hover:bg-amber-600 transition-colors"
                  onClick={closeModal}
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}