import axios from 'axios';

export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain.onrender.com/api'
  : 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  
  // Books
  BOOKS: '/books',
  BOOKS_AVAILABLE: '/books/available',
  BOOKS_SEARCH: '/books/search',
  BOOK_BY_ID: (id) => `/books/${id}`,

  // Students
  STUDENTS: '/students',
  STUDENTS_SEARCH: '/students/search',
  STUDENTS_BY_DEPARTMENT: (department) => `/students/department/${department}`,
  STUDENTS_BY_SEMESTER: (semester) => `/students/semester/${semester}`,
  STUDENT_BY_ID: (id) => `/students/${id}`,

  // Book Issues
  ISSUES: '/issues',
  ISSUES_OVERDUE: '/issues/overdue',
  ISSUES_BY_STUDENT: (studentId) => `/issues/student/${studentId}`,
  ISSUES_BY_BOOK: (bookId) => `/issues/book/${bookId}`,
  ISSUE_BY_ID: (id) => `/issues/${id}`,
  ISSUE_RETURN: (id) => `/issues/${id}/return`,
  ISSUE_NOTIFY: (id) => `/issues/${id}/notify`,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling API response structure
api.interceptors.response.use(
  (response) => {
    // If the response has a success field, return the data
    if (response.data && 'success' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);

export { api }; 