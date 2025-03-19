"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

type FormData = {
  email: string;
}

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      // Clear previous error and success messages
      setErrorMessage('');
      setSuccessMessage('');
      setFormErrors({});
  
      const response = await fetch('http://localhost/api/user/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // If request is successful, set success message
        setSuccessMessage(result.message || 'Password reset link sent to your email');
  
        // Show success message using Toastify
        toast.success(result.message || 'Password reset link sent to your email');
  
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          router.push('/user/login');
        }, 3000);
      } else {
        // Log the result to debug
        console.log(result);
  
        // Handle backend-specific errors and display them
        if (result.non_field_errors) {
          result.non_field_errors.forEach((error: string) => {
            toast.error(error);  // Display each backend error in a separate Toast
          });
        } else if (result.errors) {
          // Handle other field-specific errors
          Object.values(result.errors).forEach((error: unknown) => {
            toast.error(error as string);
          });
        } else {
          toast.error(result.message || 'Failed to send reset link');
        }
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Forgot Password | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-600">Reset your password</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
            >
              Send Reset Link
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-700">
              Remember your password?{' '}
              <Link href="/user/login" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Log In
              </Link>
            </div>
          </div>
        </form>

        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
      </div>

      {/* Add ToastContainer for Toastify */}
      <ToastContainer />
    </div>
  );
}