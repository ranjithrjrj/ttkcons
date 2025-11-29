// app/admin/components/ActivityItem.tsx
import { ReactNode } from 'react';

interface ActivityItemProps {
  icon: ReactNode;
  iconColor: string;
  description: string;
  timestamp: string;
}

export default function ActivityItem({ icon, iconColor, description, timestamp }: ActivityItemProps) {
  return (
    <li className="py-3 flex items-center hover:bg-gray-50 transition-colors px-2 rounded">
      <div className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <p className="text-sm text-gray-700 flex-1" dangerouslySetInnerHTML={{ __html: description }} />
      <span className="text-xs text-gray-500 ml-4">{timestamp}</span>
    </li>
  );
}