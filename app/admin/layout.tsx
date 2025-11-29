// app/admin/layout.tsx
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | TTK Constructions',
  description: 'Admin dashboard for managing TTK Constructions website',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      {/* Add Font Awesome CDN for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      {/* This layout wraps all admin pages and prevents the public Navbar/Footer from showing */}
      {children}
    </>
  );
}