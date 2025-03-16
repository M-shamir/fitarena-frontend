"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

type FormData = {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, SetSuccessMesssage] = useState<string>('');
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
      SetSuccessMesssage('');
      setFormErrors({});
  
      const response = await fetch('http://localhost/user/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // If login is successful, set success message and store token
        SetSuccessMesssage(result.message || 'Login successful');
        localStorage.setItem('accessToken', result.accessToken);
  
        // Show success message using Toastify
        toast.success(result.message || 'Login successful');
  
        // Redirect to the home page
        router.push('/user/home');
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
          Object.values(result.errors).forEach((error: string) => {
            toast.error(error);
          });
        } else {
          toast.error(result.message || 'Login failed');
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
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
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
  <div className="text-sm text-gray-700"> {/* Light black color */}
    Don't have an account?{' '}
    <Link href="/user/signup" className="font-medium text-[#22b664] hover:text-[#1da058]">
      Sign Up
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
