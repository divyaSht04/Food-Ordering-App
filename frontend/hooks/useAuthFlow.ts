import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { OtpService } from '../services/OtpService';
import { 
  LoginRequest, 
  RegisterRequest,
} from '../types/auth';
import {
  RegisterInitiateRequest,
  RegisterVerificationRequest,
  AuthFlowState,
  OtpResponse,
} from '../types/otp';

interface UseAuthFlowReturn {
  // Current state
  currentStep: AuthFlowState;
  isLoading: boolean;
  
  // Forms
  loginForm: LoginRequest;
  registerForm: RegisterInitiateRequest;
  otpCode: string;
  pendingEmail: string;
  pendingUserName: string;
  remainingAttempts: number;
  
  // Form updates
  updateLoginField: (field: keyof LoginRequest, value: string) => void;
  updateRegisterField: (field: keyof RegisterInitiateRequest, value: string) => void;
  setOtpCode: (code: string) => void;
  
  // Actions
  handleLogin: () => Promise<boolean>;
  handleInitiateRegistration: () => Promise<boolean>;
  handleVerifyOtp: () => Promise<boolean>;
  handleResendOtp: () => Promise<void>;
  
  // Navigation
  goToSignIn: () => void;
  goToSignUp: () => void;
  resetFlow: () => void;
  
  // Validation
  validateLoginForm: () => boolean;
  validateRegisterForm: () => boolean;
}

export const useAuthFlow = (): UseAuthFlowReturn => {
  const { login } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<AuthFlowState>(AuthFlowState.SIGN_IN);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterInitiateRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    number: '',
  });
  
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUserName, setPendingUserName] = useState('');
  
  // Form field updates
  const updateLoginField = (field: keyof LoginRequest, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };
  
  const updateRegisterField = (field: keyof RegisterInitiateRequest, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  const validateLoginForm = (): boolean => {
    if (!loginForm.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    
    if (!validateEmail(loginForm.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!loginForm.password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }
    
    if (!validatePassword(loginForm.password)) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const validateRegisterForm = (): boolean => {
    if (!registerForm.firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return false;
    }
    
    if (!registerForm.lastName.trim()) {
      Alert.alert('Validation Error', 'Last name is required');
      return false;
    }
    
    if (!registerForm.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    
    if (!validateEmail(registerForm.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!registerForm.number.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    
    if (!validatePhoneNumber(registerForm.number)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    
    if (!registerForm.password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }
    
    if (!validatePassword(registerForm.password)) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleLogin = async (): Promise<boolean> => {
    if (!validateLoginForm()) return false;
    
    setIsLoading(true);
    try {
      await login(loginForm);
      setCurrentStep(AuthFlowState.SUCCESS);
      return true;
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInitiateRegistration = async (): Promise<boolean> => {
    if (!validateRegisterForm()) return false;
    
    setIsLoading(true);
    try {
      const response: OtpResponse = await OtpService.initiateRegistration(registerForm);
      
      if (response.success) {
        setPendingEmail(registerForm.email);
        setPendingUserName(`${registerForm.firstName} ${registerForm.lastName}`);
        setCurrentStep(AuthFlowState.OTP_VERIFICATION);
        setRemainingAttempts(3);
        setOtpCode('');
        Alert.alert('OTP Sent', response.message);
        return true;
      } else {
        Alert.alert('Registration Failed', response.message);
        return false;
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (): Promise<boolean> => {
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP code');
      return false;
    }
    
    setIsLoading(true);
    try {
      const verificationRequest: RegisterVerificationRequest = {
        email: pendingEmail,
        otpCode: otpCode,
      };
      
      const authResponse = await OtpService.completeRegistration(verificationRequest);
      
      try {
        await login({ email: authResponse.email, password: '' });
        setCurrentStep(AuthFlowState.SUCCESS);
        Alert.alert('Success', 'Registration completed successfully!');
        return true;
      } catch (loginError) {
        // If login fails, still consider registration successful
        setCurrentStep(AuthFlowState.SUCCESS);
        Alert.alert('Success', 'Registration completed successfully!');
        return true;
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid or expired OTP');
      
      // Update remaining attempts if provided in error response
      if (error.response?.data?.remainingAttempts !== undefined) {
        setRemainingAttempts(error.response.data.remainingAttempts);
      } else {
        setRemainingAttempts(prev => Math.max(0, prev - 1));
      }

      if (remainingAttempts <= 1) {
        Alert.alert(
          'Too Many Attempts',
          'You have exceeded the maximum number of attempts. Please try registering again.',
          [{ text: 'OK', onPress: () => setCurrentStep(AuthFlowState.SIGN_UP) }]
        );
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await OtpService.resendOtp({
        email: pendingEmail,
        userName: pendingUserName,
      });
      
      if (response.success) {
        setRemainingAttempts(3);
        setOtpCode('');
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email');
      } else {
        Alert.alert('Resend Failed', response.message);
      }
    } catch (error: any) {
      Alert.alert('Resend Failed', error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigation
  const goToSignIn = () => {
    setCurrentStep(AuthFlowState.SIGN_IN);
    resetForms();
  };
  
  const goToSignUp = () => {
    setCurrentStep(AuthFlowState.SIGN_UP);
    resetForms();
  };
  
  const resetFlow = () => {
    setCurrentStep(AuthFlowState.SIGN_IN);
    resetForms();
  };
  
  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      number: '',
    });
    setOtpCode('');
    setPendingEmail('');
    setPendingUserName('');
    setRemainingAttempts(3);
    setIsLoading(false);
  };
  
  return {
    // State
    currentStep,
    isLoading,
    
    // Forms
    loginForm,
    registerForm,
    otpCode,
    pendingEmail,
    pendingUserName,
    remainingAttempts,
    
    // Form updates
    updateLoginField,
    updateRegisterField,
    setOtpCode,
    
    // Actions
    handleLogin,
    handleInitiateRegistration,
    handleVerifyOtp,
    handleResendOtp,
    
    // Navigation
    goToSignIn,
    goToSignUp,
    resetFlow,
    
    // Validation
    validateLoginForm,
    validateRegisterForm,
  };
};
