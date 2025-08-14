import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LogoutResponse,
  RefreshTokenResponse,
  API_CONFIG,
  STORAGE_KEYS,
} from '@/types/auth';

const authApi = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

authApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.accessToken);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshResponse.refreshToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await clearTokens();
        throw refreshError;
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/login', loginData);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/register', registerData);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        const response: AxiosResponse<LogoutResponse> = await authApi.post('/logout', {
          refreshToken
        });
        
        await this.clearTokens();
        return response.data;
      }
      
      await this.clearTokens();
      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      await this.clearTokens();
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await refreshAccessToken(refreshToken);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearTokens();
      throw this.handleError(error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  async getUserEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    } catch (error) {
      console.error('Get user email error:', error);
      return null;
    }
  }


  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_EMAIL
      ]);
    } catch (error) {
      console.error('Clear tokens error:', error);
    }
  }


  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.data || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
    `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}/refresh-token`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: API_CONFIG.TIMEOUT,
    }
  );
  return response.data;
}


async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER_EMAIL
  ]);
}

// Export singleton instance
export default new AuthService();
