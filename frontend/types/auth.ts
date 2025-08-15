import { getApiBaseUrl } from '../utils/networkConfig';

// API Base Configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  AUTH_ENDPOINT: '/auth',
  TIMEOUT: 10000,
} as const;

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// User Types
export interface User {
  id?: number;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Async Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_EMAIL: 'userEmail',
  USER_DATA: 'userData',
} as const;

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginRequest) => Promise<void>;
  register: (registerData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
