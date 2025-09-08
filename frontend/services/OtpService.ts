import axios from 'axios';
import {
  OtpRequest,
  OtpVerificationRequest,
  OtpResponse,
  RegisterVerificationRequest,
  RegisterInitiateRequest,
} from '@/types/otp';
import { AuthResponse, API_CONFIG } from '@/types/auth';

const otpApi = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

const authApi = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

export class OtpService {
  // Send OTP for verification
  static async sendOtp(request: OtpRequest): Promise<OtpResponse> {
    try {
      const response = await otpApi.post('/api/otp/send', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to send OTP'
      );
    }
  }

  // Verify OTP
  static async verifyOtp(request: OtpVerificationRequest): Promise<OtpResponse> {
    try {
      const response = await otpApi.post('/api/otp/verify', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to verify OTP'
      );
    }
  }

  // Resend OTP
  static async resendOtp(request: OtpRequest): Promise<OtpResponse> {
    try {
      const response = await otpApi.post('/api/otp/resend', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to resend OTP'
      );
    }
  }

  // Initiate registration (sends OTP)
  static async initiateRegistration(request: RegisterInitiateRequest): Promise<OtpResponse> {
    try {
      const response = await authApi.post('/initiate-registration', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to initiate registration'
      );
    }
  }

  // Complete registration after OTP verification
  static async completeRegistration(request: RegisterVerificationRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.post('/complete-registration', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to complete registration'
      );
    }
  }
}
