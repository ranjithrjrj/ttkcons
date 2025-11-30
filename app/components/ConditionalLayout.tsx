'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current page is an admin page
  const isAdminPage = pathname.startsWith('/admin');

  // If it's an admin page, don't show Navbar and Footer
  if (isAdminPage) {
    return <>{children}</>;
  }

  // For all other pages, show Navbar and Footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}