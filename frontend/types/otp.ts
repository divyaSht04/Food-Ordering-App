// OTP Verification Types
export interface OtpRequest {
  email: string;
  userName: string;
}

export interface OtpVerificationRequest {
  email: string;
  otpCode: string;
  userName?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  remainingAttempts?: number;
  email?: string;
}

export interface RegisterVerificationRequest {
  email: string;
  otpCode: string;
}

// Updated RegisterRequest to match backend
export interface RegisterInitiateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  number: string; // phone number field name from backend
}

// Auth Flow States
export enum AuthFlowState {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up', 
  OTP_VERIFICATION = 'otp-verification',
  SUCCESS = 'success'
}
