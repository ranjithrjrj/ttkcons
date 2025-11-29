// app/admin/types.ts

export interface StatCardData {
  title: string;
  value: string | number;
  icon: string; // FontAwesome class name
  linkText: string;
  linkHref: string;
}

export interface ActivityData {
  id: string;
  type: 'project' | 'job' | 'gallery' | 'application' | 'contact';
  icon: string; // FontAwesome class name
  iconColor: string; // Tailwind color class
  description: string;
  timestamp: string;
  createdAt: Date;
}

export interface DashboardStats {
  jobApplications: number;
  activeProjects: number;
  contactSubmissions: number;
  photosToday: number;
}

export interface JobApplication {
  id: string;
  position: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  budget: number;
  description: string;
  location: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  submittedAt: Date;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  album: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  projectsCount: number;
  isActive: boolean;
}