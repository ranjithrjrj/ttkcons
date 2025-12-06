// app/admin/components/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface LogoutButtonProps {
  className?: string;
  children: React.ReactNode;
  onLogoutStart?: () => void;
}

export default function LogoutButton({ className, children, onLogoutStart }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    // Call the optional callback to close mobile menu, etc.
    if (onLogoutStart) {
      onLogoutStart();
    }

    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out. Please try again.');
        setIsLoggingOut(false);
        return;
      }

      toast.success('Logged out successfully');
      
      // Force a hard navigation to clear all state
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('An unexpected error occurred.');
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <>
          <i className="fas fa-spinner fa-spin w-5 mr-3"></i>
          Logging out...
        </>
      ) : (
        children
      )}
    </button>
  );
}