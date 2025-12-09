// app/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      } else {
        toast.error('Invalid or expired reset link');
        setTimeout(() => router.push('/forgot-password'), 2000);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success('Password updated successfully!');
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  if (!validSession) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-16">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </main>
    );
  }

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
              Create New Password
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition duration-300 bg-amber-500 text-[#1e3a8a] hover:bg-amber-600 disabled:bg-gray-400"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}