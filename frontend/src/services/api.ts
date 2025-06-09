import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling API response structure
api.interceptors.response.use(
  (response) => {
    // If the response has a data property with success and data fields
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      // If success is false, reject with the error message
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'Operation failed'));
      }
      // Return just the data field
      return { ...response, data: response.data.data };
    }
    // If response doesn't match expected structure, return as is
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default api; 