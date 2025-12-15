import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from './components/ConditionalLayout';

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
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <body className="bg-gray-100 text-gray-800">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}