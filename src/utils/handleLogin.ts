// utils/handleLogin.ts
import { z } from 'zod';
import { FormEvent } from 'react';
import { NextRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

interface LoginResponse {
  message: string;
  user: User;
  // Add other response properties as needed
}

interface ErrorResponse {
  non_field_errors?: string | string[];
  message?: string;
  detail?: string;
  // Add other error response properties as needed
}

interface AuthStore {
  login: (user: User, role: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface LoginProps<T> {
  e: FormEvent;
  formData: T;
  loginSchema: z.ZodSchema<T>;
  setFormErrors: (errors: Record<string, string>) => void;
  setErrorMessage: (msg: string) => void;
  setSuccessMessage: (msg: string) => void;
  setIsLoading: (loading: boolean) => void;
  loginFn: (formData: T) => Promise<{ data: LoginResponse }>;
  redirectPath: string;
  router: NextRouter;
  authStore: AuthStore;
}

export const handleLogin = async <T,>({
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
  authStore,
}: LoginProps<T>) => {
  e.preventDefault();
  setFormErrors({});
  setErrorMessage('');
  setSuccessMessage('');

  try {
    // Validate form data
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    authStore.setLoading(true);
    setIsLoading(true);

    // Call the login function and await the response
    const response = await loginFn(formData);
    const result = response.data;

    // Check for successful login response
    if (result?.message === "Login successful" && result?.user) {
      authStore.login(result.user, result.user.role);
      setSuccessMessage(result.message);
      router.push(redirectPath);
    } else {
      throw new Error(result?.message || 'Authentication failed');
    }
  } catch (error: unknown) {
    let errorMessage = 'An error occurred during login';
    
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: ErrorResponse }; message?: string };
      
      if (err.response?.data) {
        const result = err.response.data;
        if (result.non_field_errors) {
          errorMessage = Array.isArray(result.non_field_errors) 
            ? result.non_field_errors[0]
            : result.non_field_errors;
        } else if (result.message) {
          errorMessage = result.message;
        } else if (result.detail) {
          errorMessage = result.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
    }

    authStore.setError(errorMessage);
    setErrorMessage(errorMessage);
  } finally {
    authStore.setLoading(false);
    setIsLoading(false);
  }
};