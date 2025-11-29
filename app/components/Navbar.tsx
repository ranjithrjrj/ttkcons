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
    { href: '/infrastructure', label: 'OUR INFRASTRUCTURES' },
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
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-900 hover:bg-amber-600 hover:text-white px-5 py-4 font-semibold text-[0.95rem] transition-colors ${
                  isActive(link.href) ? 'border-b-4 border-gray-900' : ''
                }`}
              >
                {link.label}
              </Link>
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
            className="md:hidden p-2 rounded-md text-gray-900 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-amber-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-gray-900 ${
                    isActive(link.href) ? 'bg-amber-500' : 'hover:bg-amber-500'
                  }`}
                >
                  {link.label}
                </Link>
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