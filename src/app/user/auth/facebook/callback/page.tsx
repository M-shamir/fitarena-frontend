// app/user/auth/facebook/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import useAuthStore from '@/store/authStore';

export default function FacebookCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleFacebookCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`Facebook login failed: ${error}`);
        router.push('/login');
        return;
      }

      if (code) {
        try {
          const response = await api.post('user/auth/facebook/', { 
            code,
            redirect_uri: `${window.location.origin}/user/auth/facebook/callback`
          });
          
          if (response.data.user) {
            useAuthStore.getState().login(response.data.user);
            router.push('/');
          } else {
            throw new Error('User data missing in response');
          }
        } catch (err: any) {
          console.error('Facebook callback error:', err);
          toast.error(err.response?.data?.detail || 'Login failed. Please try again.');
          router.push('/user/login');
        }
      } else {
        router.push('/user/login');
      }
    };

    handleFacebookCallback();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p>Completing Facebook login...</p>
    </div>
  );
}