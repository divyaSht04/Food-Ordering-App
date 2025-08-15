import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest, RegisterRequest } from '../types/auth';

interface UseAuthFormsReturn {
  // Login
  loginForm: LoginRequest;
  setLoginForm: (form: LoginRequest) => void;
  updateLoginField: (field: keyof LoginRequest, value: string) => void;
  handleLogin: () => Promise<boolean>;
  isLoginLoading: boolean;
  
  // Register
  registerForm: RegisterRequest;
  setRegisterForm: (form: RegisterRequest) => void;
  updateRegisterField: (field: keyof RegisterRequest, value: string) => void;
  handleRegister: () => Promise<boolean>;
  isRegisterLoading: boolean;
  
  // Validation
  validateLoginForm: () => boolean;
  validateRegisterForm: () => boolean;
  
  // Reset forms
  resetForms: () => void;
}

export const useAuthForms = (): UseAuthFormsReturn => {
  const { login, register } = useAuth();
  
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  });
  
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  // Form field updates
  const updateLoginField = (field: keyof LoginRequest, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };
  
  const updateRegisterField = (field: keyof RegisterRequest, value: string) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    return password.length >= 6; // Minimum 6 characters
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/; // Basic phone validation
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
    if (!registerForm.fullName.trim()) {
      Alert.alert('Validation Error', 'Full name is required');
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
    
    if (!registerForm.password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }
    
    if (!validatePassword(registerForm.password)) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (!registerForm.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }
    
    if (!validatePhoneNumber(registerForm.phoneNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    
    return true;
  };
  
  // Handle login
  const handleLogin = async (): Promise<boolean> => {
    if (!validateLoginForm()) {
      return false;
    }
    
    try {
      setIsLoginLoading(true);
      await login(loginForm);
      resetForms();
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  // Handle register
  const handleRegister = async (): Promise<boolean> => {
    if (!validateRegisterForm()) {
      return false;
    }
    
    try {
      setIsRegisterLoading(true);
      await register(registerForm);
      resetForms();
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsRegisterLoading(false);
    }
  };
  
  // Reset all forms
  const resetForms = () => {
    setLoginForm({
      email: '',
      password: '',
    });
    
    setRegisterForm({
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
    });
  };
  
  return {
    // Login
    loginForm,
    setLoginForm,
    updateLoginField,
    handleLogin,
    isLoginLoading,
    
    // Register
    registerForm,
    setRegisterForm,
    updateRegisterField,
    handleRegister,
    isRegisterLoading,
    
    // Validation
    validateLoginForm,
    validateRegisterForm,
    
    // Reset
    resetForms,
  };
};
