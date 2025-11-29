import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT US' },
    { href: '/infrastructure', label: 'OUR INFRASTRUCTURES' },
    { href: '/projects', label: 'OUR PROJECTS' },
    { href: '/gallery', label: 'GALLERY' },
    { href: '/clients', label: 'OUR CLIENTS' },
    { href: '/careers', label: 'CAREERS' },
    { href: '/contact', label: 'CONTACT' },
  ];

  return (
    <footer className="bg-gray-900 text-white border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-extrabold tracking-wider text-amber-500">
            TTK <span className="text-white">CONSTRUCTION</span>
          </Link>
        </div>
        
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center text-sm" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2 text-base text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-xs border-t border-gray-700 pt-4 gap-4">
          <p className="text-gray-500">
            &copy; 2025 TTK Constructions. All rights reserved.
          </p>
          <p className="text-gray-500">
            Designed and Maintained by{' '}
            <a
              href="https://maiyontech.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition duration-300"
            >
              Maiyon Tech Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}