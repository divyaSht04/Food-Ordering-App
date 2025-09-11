import { apiClient } from './api';

// Types for super admin operations
export interface AdminRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  password: string;
}

export interface AdminRegistrationResponse {
  success: boolean;
  message: string;
  adminEmail: string;
  adminFullName: string;
  registeredAt: string;
}

export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ErrorResponse {
  message: string;
  errorCode: string;
  status: number;
  path: string;
  timestamp: string;
}

// Super Admin Auth Service - Only super admins can use this dashboard
export class SuperAdminAuthService {

  /**
   * Super admin login
   */
  static async login(credentials: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    try {
      const response = await apiClient.post<SuperAdminLoginResponse>('/auth/super-admin/login', credentials);
      
      // Store super admin tokens
      localStorage.setItem('superAdminAccessToken', response.data.accessToken);
      localStorage.setItem('superAdminRefreshToken', response.data.refreshToken);
      localStorage.setItem('superAdminUser', JSON.stringify({
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: 'SUPER_ADMIN'
      }));
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorResponse = error.response.data;
        throw new Error(errorData.message || 'Login failed');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  /**
   * Register a new admin user (Super admin only operation)
   */
  static async registerAdmin(data: AdminRegisterRequest): Promise<AdminRegistrationResponse> {
    try {
      const response = await apiClient.post<AdminRegistrationResponse>('/auth/register-admin', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData: ErrorResponse = error.response.data;
        throw new Error(errorData.message || 'Admin registration failed');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  /**
   * Super admin logout
   */
  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('superAdminAccessToken');
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear super admin data regardless of API call success
      localStorage.removeItem('superAdminAccessToken');
      localStorage.removeItem('superAdminRefreshToken');
      localStorage.removeItem('superAdminUser');
    }
  }

  /**
   * Check if super admin is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('superAdminAccessToken');
    const user = localStorage.getItem('superAdminUser');
    return !!(token && user);
  }

  /**
   * Get current super admin user data
   */
  static getCurrentUser(): any {
    const userStr = localStorage.getItem('superAdminUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Test backend connectivity
   */
  static async testConnection(): Promise<string> {
    try {
      const response = await apiClient.get<string>('/auth/test');
      return response.data;
    } catch (error: any) {
      if (error.request) {
        throw new Error('Cannot connect to backend server. Please ensure the server is running.');
      }
      throw new Error('Connection test failed.');
    }
  }
}

export default SuperAdminAuthService;
