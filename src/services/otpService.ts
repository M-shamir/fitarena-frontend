// services/otpService.ts
import api from '@/utils/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const verifyOTPService = async (role: 'user' | 'trainer' | 'stadium_owner', otpValue: string) => {
  try {
    const response = await api.post(`${role}/auth/verifyotp`, { otp: otpValue });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: getErrorMessage(error) };
  }
};

export const resendOTPService = async (role: 'user' | 'trainer' | 'stadium_owner' ) => {
  try {
    const response = await api.post(`${role}/auth/resendotp`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: getErrorMessage(error) };
  }
};
