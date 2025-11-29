import type { Metadata } from 'next';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | TTK Constructions',
  description: 'Reset your TTK Constructions employee password.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-16">
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-2xl border-t-8 border-amber-500">
          <div className="text-center mb-8">
            <p className="text-3xl font-extrabold tracking-wider text-amber-500">
              TTK <span className="text-[#1e3a8a]">CONSTRUCTIONS</span>
            </p>
            <h1 className="mt-2 text-xl font-semibold text-gray-700">
              Reset Employee Password
            </h1>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}