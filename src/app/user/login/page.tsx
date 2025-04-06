'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';
import { loginUser } from '@/services/loginService';
import { handleLogin } from '@/utils/handleLogin';
// Define Zod schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
    loginFn:loginUser,
    redirectPath:'home',
    router
    })
  };
  

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Login | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-600">Login to book sports facilities</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#22b664] focus:border-[#22b664]"
                placeholder="Username"
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#22b664] focus:border-[#22b664]"
                placeholder="Password"
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div className="text-right mt-2">
            <Link href="/user/forgot-password" className="text-sm text-[#22b664] hover:text-[#1da058]">
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
            >
              Log In
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-700">
              Don&apos;t have an account?{' '}
              <Link href="/user/signup" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Sign Up
              </Link>
            </div>
          </div>
        </form>

        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
      </div>

      <ToastContainer />
    </div>
  );
}
