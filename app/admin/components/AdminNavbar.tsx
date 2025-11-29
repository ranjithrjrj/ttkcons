// app/admin/components/AdminNavbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-[#1e3a8a] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <Link href="/admin/dashboard" className="text-xl font-extrabold tracking-wider text-amber-500">
              TTK <span className="text-white">ADMIN PANEL</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <div className="flex items-center">
              <span className="text-amber-500 mr-2">👤</span>
              <span>Welcome, Admin</span>
            </div>
            <div className="flex items-center">
              <span className="text-amber-500 mr-2">🕐</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-amber-500 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden md:flex items-center">
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white border-b-4 border-gray-900 font-semibold text-sm transition-colors"
            >
              DASHBOARD
            </Link>
            <Link 
              href="/admin/careers" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors"
            >
              MANAGE CAREERS
            </Link>
            <Link 
              href="/admin/projects" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors"
            >
              MANAGE PROJECTS
            </Link>
            <Link 
              href="/admin/gallery" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors"
            >
              MANAGE GALLERY
            </Link>
            <Link 
              href="/admin/contacts" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors"
            >
              CONTACT SUBMISSIONS
            </Link>
          </div>

          {/* Logout Button */}
          <Link 
            href="/login" 
            className="hidden md:block bg-red-600 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            LOGOUT
          </Link>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            className="md:hidden p-2 rounded-md text-gray-900 hover:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-400">
              <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-amber-500">
                DASHBOARD
              </Link>
              <Link href="/admin/careers" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500">
                MANAGE CAREERS
              </Link>
              <Link href="/admin/projects" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500">
                MANAGE PROJECTS
              </Link>
              <Link href="/admin/gallery" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500">
                MANAGE GALLERY
              </Link>
              <Link href="/admin/contacts" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500">
                CONTACT SUBMISSIONS
              </Link>
              
              {/* Mobile Logout Button */}
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white text-center hover:bg-red-700">
                <i className="fas fa-sign-out-alt mr-2"></i>
                LOGOUT
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}