// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Refresh session if expired - this is important!
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('Middleware - Session check:', {
      hasSession: !!session,
      email: session?.user?.email,
      path: request.nextUrl.pathname,
    });

    if (!session) {
      console.log('Middleware - No session, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single();

    console.log('Middleware - Admin check:', {
      hasAdminUser: !!adminUser,
      error: adminError?.message,
    });

    if (!adminUser) {
      console.log('Middleware - Not an admin, redirecting to login');
      // User is authenticated but not an admin
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: '/admin/:path*',
};