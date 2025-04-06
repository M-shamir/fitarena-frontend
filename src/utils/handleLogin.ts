import { z } from 'zod';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';

interface LoginProps {
    e: FormEvent;
    formData: any;
    loginSchema: z.ZodTypeAny;
    setFormErrors: (errors: Record<string, string>) => void;
    setErrorMessage: (msg: string) => void;
    setSuccessMessage: (msg: string) => void;
    setIsLoading: (loading: boolean) => void;
    loginFn: (formData: any) => Promise<any>;
    redirectPath: string;
    router: any;
  }
  
  export const handleLogin = async ({
    e,
    formData,
    loginSchema,
    setFormErrors,
    setErrorMessage,
    setSuccessMessage,
    setIsLoading,
    loginFn,
    redirectPath,
    router, 
  }: LoginProps) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      loginSchema.parse(formData);
      setIsLoading(true);
  
      const result = await loginFn(formData);
  
      if (result?.token) {
        localStorage.setItem('token', result.token);
      }
  
      setSuccessMessage(result.message || 'Login successful');
      router.push(redirectPath); 
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      } else if (error?.response?.data) {
        const result = error.response.data;
        if (result.non_field_errors && Array.isArray(result.non_field_errors)) {
          setErrorMessage(result.non_field_errors[0]);
        } else {
          setErrorMessage(result.message || 'Invalid username or password');
        }
      } else {
        setErrorMessage('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  