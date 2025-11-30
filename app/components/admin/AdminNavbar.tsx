'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, Settings, LogOut, ExternalLink } from 'lucide-react';

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin/dashboard', label: 'DASHBOARD' },
    {
      href: '/admin/careers',
      label: 'CAREERS',
      hasDropdown: true,
      dropdownItems: [
        { href: '/admin/careers/add', label: 'Add Job Posting' },
        { href: '/admin/careers/manage', label: 'Manage Jobs' },
        { href: '/admin/careers/applications', label: 'View Applications' },
      ],
    },
    {
      href: '/admin/projects',
      label: 'PROJECTS',
      hasDropdown: true,
      dropdownItems: [
        { href: '/admin/projects/add', label: 'Add New Project' },
        { href: '/admin/projects/manage', label: 'Edit Projects' },
        { href: '/admin/projects/reports', label: 'Project Reports' },
      ],
    },
    {
      href: '/admin/gallery',
      label: 'GALLERY',
      hasDropdown: true,
      dropdownItems: [
        { href: '/admin/gallery/upload', label: 'Upload Photos' },
        { href: '/admin/gallery/organize', label: 'Organize Albums' },
        { href: '/admin/gallery/manage', label: 'Manage Images' },
      ],
    },
    { href: '/admin/contacts', label: 'CONTACT FORMS' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-[#1e3a8a] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🔧</div>
            <span className="text-xl font-extrabold tracking-wider text-amber-500">
              TTK <span className="text-white">ADMIN PANEL</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center text-amber-500 hover:text-amber-400 transition"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Website
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-amber-500 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-4 font-semibold text-[0.95rem] transition-colors ${
                      isActive(link.href)
                        ? 'bg-gray-900 text-white border-b-4 border-amber-500'
                        : 'text-gray-900 hover:bg-amber-600 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div className="absolute left-0 mt-0 w-48 bg-amber-500 text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:bg-amber-600 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-4 font-semibold text-[0.95rem] transition-colors ${
                    isActive(link.href)
                      ? 'bg-gray-900 text-white border-b-4 border-amber-500'
                      : 'text-gray-900 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* User Profile Dropdown (Desktop) */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#2558a7] transition"
            >
              <User className="w-5 h-5" />
              <span className="font-semibold">Admin</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <hr className="my-1" />
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-900 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-amber-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => !link.hasDropdown && setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.href) ? 'bg-amber-500 text-white' : 'text-gray-900 hover:bg-amber-500'
                    }`}
                  >
                    {link.label}
                  </Link>

                  {link.hasDropdown && (
                    <div className="ml-4 border-l-2 border-gray-900 bg-blue-900 rounded-md py-1 px-1 mt-1">
                      {link.dropdownItems?.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-amber-500 hover:text-gray-900"
                        >
                          — {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-gray-700 space-y-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-amber-500"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}