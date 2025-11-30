// app/admin/components/StatCard.tsx
import Link from 'next/link';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  linkText: string;
  linkHref: string;
}

export default function StatCard({ title, value, icon, linkText, linkHref }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-[#fbbf24] hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="text-2xl text-[#fbbf24]">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      <Link 
        href={linkHref} 
        className="text-xs text-blue-500 hover:text-blue-700 font-semibold mt-2 block transition-colors"
      >
        {linkText} →
      </Link>
    </div>
  );
}