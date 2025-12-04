// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your database schema
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