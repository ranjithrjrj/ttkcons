import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white p-12 rounded-xl shadow-2xl border-t-8 border-amber-500">
        <div className="text-6xl text-blue-900 mb-6 animate-spin-slow">🔧</div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-0 mb-4">
          Oops! Page Not Found
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          It looks like the infrastructure you were looking for is currently under construction, or the link is broken.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="bg-amber-500 text-[#1e3a8a] font-bold px-8 py-3 rounded shadow-md hover:bg-amber-600 transition-colors inline-flex items-center text-lg"
          >
            🏠 Return to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}