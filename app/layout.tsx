import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'TTK Constructions | Infrastructure Excellence in Madurai',
  description: 'Leading government contractor specializing in Roads, Bridges, and large-scale Irrigation projects across South India.',
  keywords: 'construction, infrastructure, roads, bridges, NHAI, PWD, Madurai, Tamil Nadu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}