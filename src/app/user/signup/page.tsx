"use client";
import { useState, ChangeEvent, FormEvent,useEffect} from 'react';
import api from '@/utils/api'
import Link from 'next/link';
import { signupSchema } from '@/validation/userValidation';
import { z } from "zod";
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import useAuthStore from '@/store/authStore';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter()
  const [formErrors, setFormErrors] = useState<FormErrors>({});


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      signupSchema.parse(formData);
      setFormErrors({});
  
      const response = await api.post('user/auth/signup', formData); 
      const result = response.data;
  
      toast.success(result.message || 'Sign up success');
      router.push('/user/otp-confirmation/');
      
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response: { data:unknown } };
        const result = axiosError.response.data;
        const backendError = result.email ? result.email[0] : result.message || 'Sign-up failed';
        toast.error(backendError);
      } else if (error instanceof z.ZodError) {
        const errors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as keyof FormErrors;
            errors[fieldName] = err.message;
          }
        });
        setFormErrors(errors);
        Object.values(errors).forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log('Google response:', credentialResponse);
    try {
      useAuthStore.getState().setLoading(true);
      const response = await api.post('user/auth/google/', {
        token: credentialResponse.credential
      });
      
      const result = response.data;
      toast.success(result.message || 'Google sign-in success');
      useAuthStore.getState().login({
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        // Include any other user fields you need
      });
      

      router.push('/')

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google sign-in failed');
    }
    finally {
     
      useAuthStore.getState().setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed');
  }

  

  const handleFacebookLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      redirect_uri: `${window.location.origin}/user/auth/facebook/callback`,
      scope: 'email,public_profile',  // email must be first
      state: Math.random().toString(36).substring(2),
      response_type: 'code',
    });
    window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
  };
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-600">Create your account to book sports facilities</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email"  className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664]"
            >
              Create Account
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-700">
              Already have an account?{' '}
              <Link href="/user/login" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Sign In
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
          
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                text="signup_with"
                shape="rectangular"
                size="large"
                width="100%"
                theme="filled_blue"
              />
           

            <div>
            <button
      onClick={handleFacebookLogin}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      disabled={useAuthStore.getState().loading}
    >
      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"/>
      </svg>
      Facebook
    </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </GoogleOAuthProvider>
  );
}
