// utils/errorHandler.ts
export const getErrorMessage = (error: unknown) => {
    if (error.response?.data) {
      const data = error.response.data;
      return data.otp ? data.otp[0] : data.error || 'Something went wrong.';
    }
    return 'Network error. Please try again.';
  };
  