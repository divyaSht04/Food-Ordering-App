import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import AuthService from '../services/AuthService';
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
          // Create a minimal user object from stored data
          setUser({
            email,
            fullName: '',
            phoneNumber: '',
          });
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
      setUser(null);
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
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Error', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(registerData);
      
      const userData: User = {
        email: response.email,
        fullName: `${response.firstName} ${response.lastName}`.trim(),
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: registerData.phoneNumber,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
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
      // Still clear local state even if logout API fails
      setUser(null);
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
