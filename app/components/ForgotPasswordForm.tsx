'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [showOtp, setShowOtp] = useState(false);
  const otpInputs = useRef<(HTMLInputElement[]>[]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
    setTimeout(() => {
      otpInputs.current[0]?.focus();
    }, 100);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpInputs.current.map(input => input?.value || '').join('');
    console.log('OTP Submitted:', otpCode);
    alert('Code verified! (Simulation) Redirecting to New Password Page...');
  };

  const handleOtpInput = (index: number, value: string) => {
    if (value.length === 1 && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {/* Email Entry Panel */}
      <div className={`transition-opacity duration-500 ${showOtp ? 'hidden' : ''}`}>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email address to receive a verification code.
        </p>
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition duration-300 bg-amber-500 text-[#1e3a8a] hover:bg-amber-600"
          >
            Send Reset Code
          </button>
        </form>
      </div>

      {/* OTP Entry Panel */}
      <div className={`transition-opacity duration-500 ${showOtp ? '' : 'hidden'}`}>
        <p className="text-center text-gray-600 mb-6">
          A 6-digit verification code has been sent to your email.
        </p>
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-8 flex justify-center items-center gap-2">
            {[0, 1, 2].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputs.current[index] = el)}
                type="number"
                maxLength={1}
                required
                onChange={(e) => handleOtpInput(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ))}
            <span className="text-2xl text-gray-400 mx-1">—</span>
            {[3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputs.current[index] = el)}
                type="number"
                maxLength={1}
                required
                onChange={(e) => handleOtpInput(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md font-bold text-lg shadow-md hover:shadow-lg transition duration-300 bg-amber-500 text-[#1e3a8a] hover:bg-amber-600"
          >
            Verify Code
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="text-sm text-gray-500 hover:text-red-500 transition duration-300"
            >
              Enter a different email
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center border-t pt-4 border-gray-200">
        <Link href="/login" className="text-sm text-gray-600 hover:text-[#1e3a8a] transition duration-300">
          ← Back to Login
        </Link>
      </div>
    </>
  );
}