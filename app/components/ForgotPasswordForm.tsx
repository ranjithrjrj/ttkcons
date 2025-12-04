'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

// Define the number of OTP inputs
const OTP_LENGTH = 6;

export default function ForgotPasswordForm() {
  const [showOtp, setShowOtp] = useState(false);
  
  // FIX 1: Corrected the syntax for the useRef type. 
  // It should be useRef<HTMLInputElement[]>([]), not useRef<(HTMLInputElement[]>[]).
  // FIX 2: Used the correct initial value for a ref array, which is []
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
  
  // Custom function to ensure the ref array is correctly populated
  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    // Ensure the array is sized correctly or the element is not null
    if (el) {
        otpInputs.current[index] = el;
    } else {
        // Optional: Clean up null entries if inputs are conditionally unmounted,
        // but for a static 6 inputs, simply allowing nulls is cleaner.
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
    
    setTimeout(() => {
      // FIX 3: Added null/undefined check for the element before calling .focus()
      // The DOM elements might not be immediately available right after setShowOtp(true)
      // due to React's rendering cycle, hence the `setTimeout`.
      // We check if the array exists and the first element is present before calling focus.
      if (otpInputs.current[0]) {
        otpInputs.current[0].focus();
      }
    }, 100);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // FIX 4: Filter out potential 'null' entries before mapping to values
    const otpCode = otpInputs.current
      .filter((input): input is HTMLInputElement => input !== null)
      .map(input => input.value || '')
      .join('');
      
    console.log('OTP Submitted:', otpCode);
    
    // Basic validation to ensure all fields are filled
    if (otpCode.length !== OTP_LENGTH) {
        alert('Please enter the complete 6-digit code.');
        return;
    }
    
    alert('Code verified! (Simulation) Redirecting to New Password Page...');
  };

  const handleOtpInput = (index: number, value: string) => {
    // Only proceed if a digit was entered
    if (value.length === 1 && index < OTP_LENGTH - 1) {
      // FIX 5: Use a null check when focusing the next input
      if (otpInputs.current[index + 1]) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      // FIX 6: Use a null check when focusing the previous input
      if (otpInputs.current[index - 1]) {
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  // --- RENDERING ---
  return (
    <>
      {/* Email Entry Panel (No changes needed here) */}
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
            
            {/* Unified map for all 6 inputs to ensure correct indexing and spacing */}
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <>
                <input
                  key={index}
                  // FIX 7: Use the custom setInputRef to correctly populate the array
                  ref={(el) => setInputRef(el, index)}
                  // The type is 'text' since 'number' type on mobile can bypass maxLength
                  type="text" 
                  maxLength={1}
                  required
                  onChange={(e) => handleOtpInput(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                />
                D:
                {/* Add the separator after the third input only */}
                {index === 2 && <span className="text-2xl text-gray-400 mx-1">—</span>}
              </>
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