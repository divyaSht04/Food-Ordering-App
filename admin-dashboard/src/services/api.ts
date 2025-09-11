import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

// Create axios instance with default config for Super Admin Dashboard
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add super admin token to requests
apiClient.interceptors.request.use(
  (config) => {
    const superAdminToken = localStorage.getItem('superAdminAccessToken');
    if (superAdminToken) {
      config.headers.Authorization = `Bearer ${superAdminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle super admin authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - Super admin token expired or invalid
      localStorage.removeItem('superAdminAccessToken');
      localStorage.removeItem('superAdminRefreshToken');
      localStorage.removeItem('superAdminUser');
      
      // Redirect to super admin login
      window.location.href = '/super-admin/signin';
    } else if (error.response?.status === 403) {
      // Forbidden - User is not a super admin
      alert('Access denied. Super admin privileges required.');
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
