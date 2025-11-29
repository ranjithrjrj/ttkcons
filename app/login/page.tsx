import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Login | TTK Constructions',
  description: 'Employee login portal for TTK Constructions.',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-16">
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

          <form action="/admin/dashboard" method="POST">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username / Employee ID
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
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
              className="w-full py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition duration-300 bg-amber-500 text-[#1e3a8a] hover:bg-amber-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}