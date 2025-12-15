'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT US' },
    { 
      href: '/infrastructure', 
      label: 'OUR INFRASTRUCTURES',
      hasDropdown: true,
      dropdownItems: [
        { href: '/infrastructure', label: 'Domains Overview' },
        { href: '/infrastructure/equipment', label: 'Equipment Fleet' },
        { href: '/infrastructure/staff', label: 'Staff & Team' },
      ]
    },
    { href: '/projects', label: 'OUR PROJECTS' },
    { href: '/gallery', label: 'GALLERY' },
    { href: '/clients', label: 'OUR CLIENTS' },
    { href: '/careers', label: 'CAREERS' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-[#1e3a8a] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <Link href="/" className="text-xl font-extrabold tracking-wider text-amber-500">
              TTK <span className="text-white">CONSTRUCTION</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <div className="flex items-center">
              <Phone className="text-amber-500 mr-2 w-4 h-4" />
              <span>0452 - 2537733 | info@ttkcons.in</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-amber-500 mr-2 w-4 h-4" />
              <span>No: 321, 2nd Floor, TTK Towers, Anna Nagar, Madurai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-amber-500 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`text-gray-900 hover:bg-amber-600 hover:text-white px-5 py-4 font-semibold text-[0.95rem] transition-colors flex items-center ${
                      isActive(link.href) ? 'border-b-4 border-gray-900' : ''
                    }`}
                  >
                    {link.label}
                    <svg className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  <div className="absolute left-0 mt-0 w-48 bg-amber-500 text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-50">
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:bg-amber-600 hover:text-gray-900"
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
                  className={`text-gray-900 hover:bg-amber-600 hover:text-white px-5 py-4 font-semibold text-[0.95rem] transition-colors ${
                    isActive(link.href) ? 'border-b-4 border-gray-900' : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Employee Login Button */}
          <Link
            href="/login"
            className="hidden md:block bg-[#1e3a8a] border-2 border-blue-500 text-white px-3 py-2 text-sm font-semibold rounded hover:bg-[#2558a7] transition-colors"
          >
            EMPLOYEE LOGIN
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-4 py-2 rounded-md text-gray-900 font-bold text-lg hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
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
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-900 ${
                      isActive(link.href) ? 'bg-amber-500' : 'hover:bg-amber-500'
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
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-[#1e3a8a] text-white text-center border-2 border-blue-500"
              >
                EMPLOYEE LOGIN
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}