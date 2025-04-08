"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { loginTrainer } from '@/services/loginService';
import { handleLogin } from '@/utils/handleLogin';

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = {
  username: string;
  password: string;
}

export default function TrainerLogin() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    handleLogin({
      e,
      formData,
      loginSchema,
      setFormErrors,
      setErrorMessage,
      setSuccessMessage,
      setIsLoading,
      loginFn: loginTrainer,
      redirectPath: '/trainer/dashboard',
      router
    })
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <Head>
        <title>Trainer Login | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-[#22b664]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#22b664]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="mt-2 text-gray-400">Sign in to your trainer dashboard</p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                  <Link href="/trainer/forgot-password" className="text-xs text-[#22b664] hover:text-[#1da058] transition duration-200">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded border-gray-600 text-[#22b664] focus:ring-[#22b664]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#22b664] hover:bg-[#1da058] focus:ring-2 focus:ring-[#22b664] focus:ring-opacity-50'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/trainer/signup" className="font-medium text-[#22b664] hover:text-[#1da058] transition duration-200">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}