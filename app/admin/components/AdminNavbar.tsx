// app/admin/components/AdminNavbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManageDropdownOpen, setIsManageDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileManageOpen, setIsMobileManageOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

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
            {/* Dashboard Link */}
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors"
            >
              DASHBOARD
            </Link>

            {/* Manage Website Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsManageDropdownOpen(true)}
              onMouseLeave={() => setIsManageDropdownOpen(false)}
            >
              <button
                className="px-5 py-4 text-gray-900 hover:bg-amber-600 hover:text-white font-semibold text-sm transition-colors flex items-center"
              >
                MANAGE WEBSITE
                <svg 
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${isManageDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Desktop Dropdown Menu */}
              <div 
                className={`absolute left-0 mt-0 w-56 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 transition-all duration-300 ${
                  isManageDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <Link
                  href="/admin/careers"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors border-b border-gray-100"
                >
                  <i className="fas fa-briefcase w-5 mr-3 text-[#1e3a8a]"></i>
                  Manage Careers
                </Link>
                <Link
                  href="/admin/projects"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors border-b border-gray-100"
                >
                  <i className="fas fa-hard-hat w-5 mr-3 text-[#1e3a8a]"></i>
                  Manage Projects
                </Link>
                <Link
                  href="/admin/gallery"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors border-b border-gray-100"
                >
                  <i className="fas fa-images w-5 mr-3 text-[#1e3a8a]"></i>
                  Manage Gallery
                </Link>
                <Link
                  href="/admin/contacts"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors border-b border-gray-100"
                >
                  <i className="fas fa-headset w-5 mr-3 text-[#1e3a8a]"></i>
                  Contact Submissions
                </Link>
                <Link
                  href="/admin/clients"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors border-b border-gray-100"
                >
                  <i className="fas fa-users w-5 mr-3 text-[#1e3a8a]"></i>
                  Manage Clients
                </Link>
                <Link
                  href="/admin/fleet"
                  className="block px-4 py-3 text-sm hover:bg-amber-100 transition-colors"
                >
                  <i className="fas fa-truck w-5 mr-3 text-[#1e3a8a]"></i>
                  Equipment Fleet
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Dropdown (Desktop) */}
          <div 
            className="hidden md:block relative"
            onMouseEnter={() => setIsProfileDropdownOpen(true)}
            onMouseLeave={() => setIsProfileDropdownOpen(false)}
          >
            <button className="flex items-center space-x-2 p-2 hover:bg-amber-600 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold">
                A
              </div>
              <svg 
                className={`w-4 h-4 text-gray-900 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            <div 
              className={`absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 transition-all duration-300 ${
                isProfileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@ttkcons.in</p>
              </div>
              <Link
                href="/"
                target="_blank"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
              >
                <i className="fas fa-external-link-alt w-5 mr-3 text-[#1e3a8a]"></i>
                Visit Website
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
              >
                <i className="fas fa-cog w-5 mr-3 text-gray-600"></i>
                Settings
              </Link>
              <Link
                href="/admin/change-password"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition-colors border-b border-gray-100"
              >
                <i className="fas fa-key w-5 mr-3 text-gray-600"></i>
                Change Password
              </Link>
              <Link
                href="/login"
                className="block px-4 py-3 text-sm hover:bg-red-50 text-red-600 transition-colors"
              >
                <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                Logout
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-amber-400">
              {/* Dashboard Link */}
              <Link 
                href="/admin/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-amber-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DASHBOARD
              </Link>

              {/* Manage Website Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileManageOpen(!isMobileManageOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500"
                >
                  <span>MANAGE WEBSITE</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isMobileManageOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Mobile Submenu */}
                {isMobileManageOpen && (
                  <div className="ml-4 mt-1 space-y-1 bg-blue-900 rounded-md py-2 px-2">
                    <Link
                      href="/admin/careers"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-briefcase mr-2"></i> Manage Careers
                    </Link>
                    <Link
                      href="/admin/projects"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-hard-hat mr-2"></i> Manage Projects
                    </Link>
                    <Link
                      href="/admin/gallery"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-images mr-2"></i> Manage Gallery
                    </Link>
                    <Link
                      href="/admin/contacts"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-headset mr-2"></i> Contact Submissions
                    </Link>
                    <Link
                      href="/admin/clients"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-users mr-2"></i> Manage Clients
                    </Link>
                    <Link
                      href="/admin/fleet"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-truck mr-2"></i> Equipment Fleet
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500"
                >
                  <span className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-xs font-bold mr-2">
                      A
                    </div>
                    PROFILE
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isMobileProfileOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Mobile Profile Submenu */}
                {isMobileProfileOpen && (
                  <div className="ml-4 mt-1 space-y-1 bg-gray-800 rounded-md py-2 px-2">
                    <Link
                      href="/"
                      target="_blank"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-external-link-alt mr-2"></i> Visit Website
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-cog mr-2"></i> Settings
                    </Link>
                    <Link
                      href="/admin/change-password"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-key mr-2"></i> Change Password
                    </Link>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}