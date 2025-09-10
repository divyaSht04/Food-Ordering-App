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
      // Check if token is expired before making the request
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // If token is expired, try to refresh it
        if (tokenPayload.exp < currentTime) {
          console.log('Token expired, attempting to refresh...');
          const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          
          if (refreshToken) {
            try {
              const refreshResponse = await refreshAccessToken(refreshToken);
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.accessToken);
              await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshResponse.refreshToken);
              config.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
            } catch (refreshError) {
              console.log('Token refresh failed, clearing tokens');
              await clearTokens();
              // Don't add authorization header for expired/invalid tokens
              return config;
            }
          } else {
            console.log('No refresh token available, clearing tokens');
            await clearTokens();
            return config;
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (tokenParseError) {
        console.log('Failed to parse token, clearing tokens');
        await clearTokens();
        return config;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized/expired token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Received 401 error, attempting token refresh...');
      
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.accessToken);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshResponse.refreshToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
          return authApi(originalRequest);
        } else {
          throw new Error('No refresh token available');
        }
      } catch (refreshError) {
        // Refresh failed, clear all tokens and redirect to login
        console.log('Token refresh failed, clearing all tokens');
        await clearTokens();
        
        // Create a custom error to indicate authentication failure
        const authError = new Error('Authentication expired. Please login again.');
        authError.name = 'AuthenticationError';
        throw authError;
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

  async registerWithOtp(registerData: RegisterRequest): Promise<{ message: string; email: string }> {
    try {
      // Convert RegisterRequest to backend format
      const [firstName, lastName] = registerData.fullName.split(' ');
      
      const response: AxiosResponse<{ message: string; email: string }> = await authApi.post('/register', {
        email: registerData.email,
        password: registerData.password,
        firstName: firstName || '',
        lastName: lastName || '',
        number: registerData.phoneNumber
      });
      
      // Store email for OTP verification
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_USER_EMAIL, response.data.email);
      
      return response.data;
    } catch (error) {
      console.error('Registration with OTP error:', error);
      throw this.handleError(error);
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/verify-otp', {
        email,
        otp
      });

      // Store tokens after successful verification
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, response.data.email);
      
      // Clear pending user email
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_USER_EMAIL);
      
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw this.handleError(error);
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await authApi.post('/resend-otp', {
        email
      });
      
      return response.data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw this.handleError(error);
    }
  }

  // Utility method to check if token is expired
  async checkTokenExpiry(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return true; // No token means expired
      
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return tokenPayload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if can't parse
    }
  }

  async getPendingUserEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.PENDING_USER_EMAIL);
    } catch (error) {
      console.error('Get pending user email error:', error);
      return null;
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
      
      if (!token) {
        return false;
      }
      
      // Check if token is expired
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenPayload.exp < currentTime) {
          console.log('Token is expired, attempting refresh...');
          // Try to refresh the token
          const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          
          if (refreshToken) {
            try {
              const refreshResponse = await refreshAccessToken(refreshToken);
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshResponse.accessToken);
              await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshResponse.refreshToken);
              return true;
            } catch (refreshError) {
              console.log('Token refresh failed during auth check');
              await this.clearTokens();
              return false;
            }
          } else {
            console.log('No refresh token available during auth check');
            await this.clearTokens();
            return false;
          }
        }
        
        return true;
      } catch (tokenParseError) {
        console.log('Failed to parse token during auth check');
        await this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await this.clearTokens();
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
        STORAGE_KEYS.USER_EMAIL,
        STORAGE_KEYS.PENDING_USER_EMAIL
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
    STORAGE_KEYS.USER_EMAIL,
    STORAGE_KEYS.PENDING_USER_EMAIL
  ]);
}

// Export singleton instance
export default new AuthService();
