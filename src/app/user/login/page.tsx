'use client';
import useAuthStore from "@/store/authStore"
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { loginUser } from '@/services/loginService';
import { handleLogin } from '@/utils/handleLogin';



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
  const authStore = useAuthStore();
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
      loginFn: loginUser,
      redirectPath: '/',
      router,
      authStore: {
        login: authStore.login,
        setLoading: authStore.setLoading,
        setError: authStore.setError
      }
    });
  };
  

  return (
    
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
  <Head>
    <title>Login | FitArena</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white">FitArena</h1>
      <p className="mt-2 text-gray-400">Login to book sports facilities</p>
    </div>
    {successMessage && <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-lg mt-4">{successMessage}</div>}
    {errorMessage && <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mt-4">{errorMessage}</div>}

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
            placeholder="Enter your username"
          />
          {formErrors.username && (
            <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <Link href="/user/forgot-password" className="text-xs text-[#22b664] hover:text-[#1da058] transition duration-200">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
            placeholder="Enter your password"
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
          className="h-4 w-4 rounded border-gray-600 text-[#22b664] focus:ring-[#22b664]"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
          Remember me
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg font-medium text-white bg-[#22b664] hover:bg-[#1da058] focus:ring-2 focus:ring-[#22b664] focus:ring-opacity-50 transition duration-200"
        >
          Log In
        </button>
      </div>

      <div className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/user/signup" className="font-medium text-[#22b664] hover:text-[#1da058] transition duration-200">
          Sign Up
        </Link>
      </div>
    </form>

   
  </div>
  
</div>

  );
}



