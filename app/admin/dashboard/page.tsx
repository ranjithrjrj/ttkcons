// app/admin/dashboard/page.tsx
import AdminNavbar from '../components/AdminNavbar';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';

export default function AdminDashboard() {
  // Mock data - will be replaced with Supabase data later
  const stats = [
    {
      title: 'New Job Applications',
      value: 14,
      icon: <i className="fas fa-file-alt"></i>,
      linkText: 'View Pending Applications',
      linkHref: '/admin/careers'
    },
    {
      title: 'Active Projects',
      value: 7,
      icon: <i className="fas fa-truck-moving"></i>,
      linkText: 'Manage All Projects',
      linkHref: '/admin/projects'
    },
    {
      title: 'New Contact Form Submissions',
      value: 3,
      icon: <i className="fas fa-headset"></i>,
      linkText: 'Manage Submissions',
      linkHref: '/admin/contacts'
    },
    {
      title: 'Photos Uploaded Today',
      value: 28,
      icon: <i className="fas fa-camera-retro"></i>,
      linkText: 'Go to Gallery Management',
      linkHref: '/admin/gallery'
    }
  ];

  const recentActivities = [
    {
      icon: <i className="fas fa-plus-circle"></i>,
      iconColor: 'text-green-500',
      description: '<strong>New Project</strong> "Coimbatore Elevated Corridor" added by Jane Doe.',
      timestamp: '5 minutes ago'
    },
    {
      icon: <i className="fas fa-briefcase"></i>,
      iconColor: 'text-[#fbbf24]',
      description: '<strong>Job Posting</strong> "Site Supervisor" was updated (Salary increased).',
      timestamp: '1 hour ago'
    },
    {
      icon: <i className="fas fa-images"></i>,
      iconColor: 'text-purple-500',
      description: '<strong>28 Photos</strong> uploaded to "Madurai Ring Road Bridge" album.',
      timestamp: '3 hours ago'
    },
    {
      icon: <i className="fas fa-user-tie"></i>,
      iconColor: 'text-blue-500',
      description: '<strong>New Application</strong> received for "Senior Project Manager".',
      timestamp: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation - Only this navbar should show */}
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="pb-6 border-b border-gray-300 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome back, Admin!
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Quick overview of recent activity and key metrics.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              linkText={stat.linkText}
              linkHref={stat.linkHref}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
            Recent Activity
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                iconColor={activity.iconColor}
                description={activity.description}
                timestamp={activity.timestamp}
              />
            ))}
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
          &copy; 2025 TTK Constructions Admin Panel. Dashboard Version.
        </footer>
      </div>
    </div>
  );
}