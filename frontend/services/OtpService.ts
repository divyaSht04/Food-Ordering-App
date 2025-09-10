import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OtpRequest,
  OtpVerificationRequest,
  OtpResponse,
  RegisterVerificationRequest,
  RegisterInitiateRequest,
} from '@/types/otp';
import { AuthResponse, API_CONFIG } from '@/types/auth';

const authApi = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

export interface OtpValidationResult {
  isValid: boolean;
  message: string;
}

export interface OtpState {
  attempts: number;
  lastAttemptTime: number;
  isBlocked: boolean;
  blockUntil?: number;
}

export class OtpService {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private static readonly MAX_RESEND_ATTEMPTS = 3;

  // Validate OTP format
  static validateOtpFormat(otp: string): OtpValidationResult {
    if (!otp) {
      return { isValid: false, message: 'Please enter the OTP' };
    }

    if (otp.length !== 6) {
      return { isValid: false, message: 'OTP must be 6 digits' };
    }

    if (!/^\d{6}$/.test(otp)) {
      return { isValid: false, message: 'OTP must contain only numbers' };
    }

    return { isValid: true, message: 'Valid OTP format' };
  }

  // Register user and send OTP
  static async registerWithOtp(registerData: RegisterInitiateRequest): Promise<{ message: string; email: string }> {
    try {
      const response = await authApi.post('/register', {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        number: registerData.number
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to register user'
      );
    }
  }

  // Verify OTP and complete registration
  static async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post('/verify-otp', {
        email,
        otp
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to verify OTP'
      );
    }
  }

  // Resend OTP
  static async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await authApi.post('/resend-otp', {
        email
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to resend OTP'
      );
    }
  }

  // Local validation and state management
  private static async getOtpState(email: string): Promise<OtpState> {
    try {
      const stateKey = `otp_state_${email}`;
      const stateJson = await AsyncStorage.getItem(stateKey);
      
      if (!stateJson) {
        return {
          attempts: 0,
          lastAttemptTime: 0,
          isBlocked: false
        };
      }

      const state: OtpState = JSON.parse(stateJson);
      
      // Check if block period has expired
      if (state.isBlocked && state.blockUntil && Date.now() > state.blockUntil) {
        state.isBlocked = false;
        state.attempts = 0;
        state.blockUntil = undefined;
        await this.saveOtpState(email, state);
      }

      return state;
    } catch (error) {
      console.error('Error getting OTP state:', error);
      return {
        attempts: 0,
        lastAttemptTime: 0,
        isBlocked: false
      };
    }
  }

  private static async saveOtpState(email: string, state: OtpState): Promise<void> {
    try {
      const stateKey = `otp_state_${email}`;
      await AsyncStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving OTP state:', error);
    }
  }

  // Check if user can attempt OTP verification
  static async canAttemptVerification(email: string): Promise<{ canAttempt: boolean; message?: string; remainingTime?: number }> {
    const state = await this.getOtpState(email);

    if (state.isBlocked) {
      const remainingTime = state.blockUntil ? Math.max(0, state.blockUntil - Date.now()) : 0;
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      
      return {
        canAttempt: false,
        message: `Too many failed attempts. Try again in ${minutes} minute(s).`,
        remainingTime
      };
    }

    return { canAttempt: true };
  }

  // Record failed OTP attempt
  static async recordFailedAttempt(email: string): Promise<void> {
    const state = await this.getOtpState(email);
    state.attempts += 1;
    state.lastAttemptTime = Date.now();

    if (state.attempts >= this.MAX_ATTEMPTS) {
      state.isBlocked = true;
      state.blockUntil = Date.now() + this.BLOCK_DURATION;
    }

    await this.saveOtpState(email, state);
  }

  // Record successful OTP verification
  static async recordSuccessfulVerification(email: string): Promise<void> {
    const stateKey = `otp_state_${email}`;
    await AsyncStorage.removeItem(stateKey);
  }

  // Get remaining attempts
  static async getRemainingAttempts(email: string): Promise<number> {
    const state = await this.getOtpState(email);
    return Math.max(0, this.MAX_ATTEMPTS - state.attempts);
  }

  // Clear OTP-related data
  static async clearOtpData(email: string): Promise<void> {
    try {
      const stateKey = `otp_state_${email}`;
      const resendKey = `resend_state_${email}`;
      await AsyncStorage.multiRemove([stateKey, resendKey]);
    } catch (error) {
      console.error('Error clearing OTP data:', error);
    }
  }
}
