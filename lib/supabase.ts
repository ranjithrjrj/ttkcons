// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Check if user is an admin by querying admin_users table
export const checkAdminUser = async (email: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();
  
  return { data, error };
};

// Types based on your database schema
export interface AdminUser {
  id: string; // uuid
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  type: string; // 'project', 'fleet', 'gallery', 'staff', etc.
  display_order: number;
  is_active: boolean;
  color_class: string; // hex color code
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  category_id: number; // Changed from category to category_id
  status: string;
  contract_value: string;
  clients_name: string; // This is the UUID reference to clients table
  detailed_description: string;
  scope_of_work: string[];
  summary?: string;
  location?: string;
  is_featured?: boolean;
  show_on_website?: boolean;
  created_at?: string;
  updated_at?: string;
  // Relations
  category?: Category;
  clients?: Client;
}

export interface Client {
  id: string; // UUID
  name: string;
  status?: string;
  is_active?: boolean;
}

export interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  color_class: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryAlbum {
  id: number;
  name: string;
  description?: string;
  photo_count: number;
  project_id?: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  album_id: number;
  title: string;
  url: string;
  thumbnail_url?: string;
  file_name: string;
  tags?: string;
  uploaded_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  location: string;
  employment_type: string;
  salary_range: string | null;
  experience_required: string | null;
  short_description: string | null;
  requirements: string; // newline-separated string
  status: 'Active' | 'New' | 'Closed' | 'Draft';
  posted_date: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: number;
  job_posting_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter_url: string | null;
  status: ApplicationStatus;
  notes: string | null;
  applied_date: string;
  created_at: string;
}

export type ApplicationStatus = 
  | 'Pending Review'
  | 'Under Review'
  | 'HR Reviewed'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Rejected'
  | 'Hired';

export interface JobApplicationWithDetails extends JobApplication {
  job_title?: string;
}

// Helper functions
export const uploadResume = async (file: File, applicationId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${applicationId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data.path;
};

export const getResumeUrl = async (path: string) => {
  const { data } = await supabase.storage
    .from('resumes')
    .createSignedUrl(path, 3600); // 1 hour expiry

  return data?.signedUrl || null;
};

export const deleteResume = async (path: string) => {
  const { error } = await supabase.storage
    .from('resumes')
    .remove([path]);

  if (error) throw error;
};