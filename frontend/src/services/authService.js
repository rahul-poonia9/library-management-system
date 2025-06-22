import { api, API_ENDPOINTS } from '../config/api.js';

const authService = {
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      console.log('Login response:', response);
      
      // Handle different response structures
      const data = response.data || response;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        // Return user data (admin) and token
        return {
          token: data.token,
          user: data.admin || data.user
        };
      } else {
        throw new Error('Invalid response format: missing token');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response.data || response;
    } catch (error) {
      console.error('Get current user error:', error);
      // If the token is invalid, remove it from localStorage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  async logout() {
    try {
      localStorage.removeItem('token');
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService; 