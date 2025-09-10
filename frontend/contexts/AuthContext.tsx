import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import AuthService from '../services/AuthService';
import { OtpService } from '../services/OtpService';
import {
  AuthContextType,
  User,
  LoginRequest,
  RegisterRequest,
} from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleAuthenticationError = async () => {
    console.log('Authentication error detected, logging out user');
    setUser(null);
    setIsAuthenticated(false);
    await AuthService.clearTokens();
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const email = await AuthService.getUserEmail();
        if (email) {
          setUser({
            email,
            fullName: '',
            phoneNumber: '',
          });
        }
      } else {
        // If not authenticated, clear user data
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      // If there's an error checking auth status, assume not authenticated
      await handleAuthenticationError();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginData: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(loginData);
      
      const userData: User = {
        email: response.email,
        fullName: `${response.firstName} ${response.lastName}`.trim(),
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: '', // Not returned in login response
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Handle authentication errors
      if (error instanceof Error && error.name === 'AuthenticationError') {
        // Token expired or authentication failed
        await logout();
        Alert.alert('Session Expired', 'Your session has expired. Please login again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        Alert.alert('Login Error', errorMessage);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithOtp = async (registerData: RegisterRequest): Promise<{ message: string; email: string }> => {
    try {
      setIsLoading(true);
      const response = await AuthService.registerWithOtp(registerData);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      Alert.alert('Registration Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    try {
      setIsLoading(true);

      const validation = OtpService.validateOtpFormat(otp);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      const canAttempt = await OtpService.canAttemptVerification(email);
      if (!canAttempt.canAttempt) {
        throw new Error(canAttempt.message);
      }

      const response = await AuthService.verifyOtp(email, otp);
      
      // Record successful verification
      await OtpService.recordSuccessfulVerification(email);
      
      const userData: User = {
        email: response.email,
        fullName: `${response.firstName} ${response.lastName}`.trim(),
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: '', // Not returned in response
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Record failed attempt
      await OtpService.recordFailedAttempt(email);
      
      // Handle authentication errors
      if (error instanceof Error && error.name === 'AuthenticationError') {
        await handleAuthenticationError();
        Alert.alert('Session Expired', 'Your session has expired. Please try again.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
        Alert.alert('Verification Error', errorMessage);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<{ message: string }> => {
    try {
      const response = await AuthService.resendOtp(email);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';
      Alert.alert('Resend Error', errorMessage);
      throw error;
    }
  };

  const register = async (registerData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await AuthService.registerWithOtp(registerData);
      
      // For compatibility, this method doesn't complete the registration
      // The caller should handle the OTP verification flow
      throw new Error('Please use registerWithOtp and verifyOtp for complete registration flow');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      Alert.alert('Registration Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      await handleAuthenticationError();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await AuthService.refreshToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    registerWithOtp,
    verifyOtp,
    resendOtp,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
