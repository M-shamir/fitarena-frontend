"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; 
import useAuthStore from '@/store/authStore';


const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = {
  username: string;
  password: string;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Validate form data
      loginSchema.parse(formData);
      setIsLoading(true);

      // Send login request using axios instance
      const response = await api.post('/admin-api/login/', formData);
      
      if (response.data) {
        // Store tokens securely (consider using httpOnly cookies for production)
        if (response.data.access_token) {
          localStorage.setItem('adminToken', response.data.access_token);
        }
        const user = response.data.user;

        if (user) {
          useAuthStore.getState().login({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          });
        }

        setSuccessMessage(response.data.message || 'Login successful');
        router.push('/admin/dashboard');
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Partial<FormData> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as keyof FormData;
          errors[fieldName] = err.message;
        });
        setFormErrors(errors);
      } else if (error.response) {
        // Handle API errors
        const message = error.response.data?.message || 
                       error.response.data?.detail || 
                       'Invalid username or password';
        setErrorMessage(message);
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Admin Login | FitArena</title>
        <meta name="description" content="Admin login portal for FitArena" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-400">Sign in to your admin account</p>
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${formErrors.username ? 'border-red-500' : 'border-gray-600'} bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10`}
                placeholder="Admin Username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.username && (
                <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-600'} bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#22b664] hover:bg-[#1da058]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664] transition-all duration-200`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}