"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signupSchema } from '@/validation/userValidation';
import { z } from "zod";
import { useRouter } from 'next/navigation'

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter()
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
     
      signupSchema.parse(formData);
  
     
      setErrorMessage('');
      setSuccessMessage('');
  
     
      const response = await fetch('http://localhost/api/stadium_owner/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        
        
        setSuccessMessage(result.message || 'Sign up success');
  
        
        router.push(`/stadium_owner/otp-verification/`);
      } else {
        if (result.email && Array.isArray(result.email)) {
          setErrorMessage(result.email[0]);  
        } else {
          setErrorMessage('Sign-up failed');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
 
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      } else {
       
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Stadium Owner Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-400">Create  Stadium Owner account</p>
        </div>

        {errorMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664] transition-all duration-200"
            >
              Create Stadium Owner Account
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/stadium_owner/login" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Sign In
              </Link>
            </div>
          </div>
        </form>

       
      </div>
    </div>
  );
}