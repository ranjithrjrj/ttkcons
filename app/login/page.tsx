// app/login/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        toast.error('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Step 2: Check if user exists in admin_users table and is active
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        toast.error('You do not have admin access.');
        setLoading(false);
        return;
      }

      // Step 3: Update last_login timestamp
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Step 4: Show success message
      toast.success('Login successful! Redirecting...');
      
      // Wait a bit for the session to be fully established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force a hard navigation to ensure middleware picks up the session
      window.location.href = '/admin/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-16">
      <Toaster position="top-center" /> 
      
      <div className="w-full max-w-md">
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-2xl border-t-8 border-amber-500">
          <div className="text-center mb-8">
            <p className="text-3xl font-extrabold tracking-wider text-amber-500">
              TTK <span className="text-[#1e3a8a]">CONSTRUCTIONS</span>
            </p>
            <h1 className="mt-2 text-xl font-semibold text-gray-700">
              Employee Login Portal
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="username"
                name="username"
                required
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="text-right mb-6">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition duration-300 bg-amber-500 text-[#1e3a8a] hover:bg-amber-600 disabled:bg-gray-400"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}