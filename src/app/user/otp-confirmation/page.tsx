"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed from 'next/router' to 'next/navigation'

import { verifyOTPService,resendOTPService } from '@/services/otpService';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const router = useRouter(); 
  
  const inputRefs = useRef([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  // Handle input change for OTP digits
  const handleChange = (index, value) => {
    if (value.match(/^[0-9]$/) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input if a number was entered
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  
  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };
  
  const verifyOTP = async () => {
      const otpValue = otp.join('');
    
      if (otpValue.length !== 6) {
        setError('Please enter all 6 digits');
        return;
      }
    
      setError('');
      setIsVerifying(true);
    
      const role = 'user'; // or 'user'
    
      const result = await verifyOTPService(role, otpValue);
      if (result.success) {
        router.push(`/${role}/login`);
      } else {
        setError(result.message);
      }
    
      setIsVerifying(false);
    };
    
    const resendOTP = async () => {
      if (!canResend) return;
    
      setTimeLeft(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    
      const role = 'user'; // or 'user'
    
      const result = await resendOTPService(role);
      if (!result.success) {
        setError(result.message);
      }
    };
  



  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-[#22b664]">FitArena</h1>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-200">Verify your Email</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          We ve sent a 6-digit code to your Email. Enter the code below to confirm your trainer account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-700">
          <div className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-900/30 p-4 border border-red-500">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                Verification Code
              </label>
              
              <div className="mt-4 flex justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-[#22b664] focus:border-[#22b664] transition-colors duration-200 text-black"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              
              <p className="mt-3 text-sm text-gray-400">
                Didn t receive a code?{' '}
                <button
                  onClick={resendOTP}
                  disabled={!canResend}
                  className={`font-medium ${canResend ? 'text-[#22b664] hover:text-[#1da058]' : 'text-gray-500'} transition-colors duration-200`}
                >
                  {canResend ? 'Resend code' : `Resend in ${timeLeft}s`}
                </button>
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={verifyOTP}
                disabled={isVerifying || otp.join('').length !== 6}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664] transition-all duration-200 ${isVerifying || otp.join('').length !== 6 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#22b664] hover:bg-[#1da058]'}`}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <Link href="/trainer/signup" className="font-medium text-[#22b664] hover:text-[#1da058] transition-colors duration-200">
                &larr; Back to sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}