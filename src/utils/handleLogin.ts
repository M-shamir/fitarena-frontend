// utils/handleLogin.ts
import { z } from 'zod';
import { FormEvent } from 'react';

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
  authStore: {
    login: (user: any, role: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
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
  authStore,
}: LoginProps) => {
  e.preventDefault();
  setFormErrors({});
  setErrorMessage('');
  setSuccessMessage('');

  try {
    // Validate form data
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors: { [key: string]: string } = {};
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
    
    // The actual data is in response.data according to Axios
    const result = response.data;

    // Check for successful login response
    if (result?.message === "Login successful" && result?.user) {
      // Call authStore.login with user and role
      authStore.login(result.user, result.user.role);
      setSuccessMessage(result.message);
      router.push(redirectPath);
    } else {
      // Handle case where login wasn't successful
      throw new Error(result?.message || 'Authentication failed');
    }
  } catch (error: any) {
    let errorMessage = 'An error occurred during login';
    
    // Handle different error formats
    if (error?.response?.data) {
      const result = error.response.data;
      if (result.non_field_errors) {
        errorMessage = Array.isArray(result.non_field_errors) 
          ? result.non_field_errors[0]
          : result.non_field_errors;
      } else if (result.message) {
        errorMessage = result.message;
      } else if (result.detail) {
        errorMessage = result.detail;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Update error state in both auth store and component
    authStore.setError(errorMessage);
    setErrorMessage(errorMessage);
  } finally {
    // Reset loading states
    authStore.setLoading(false);
    setIsLoading(false);
  }
};