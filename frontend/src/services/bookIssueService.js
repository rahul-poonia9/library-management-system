import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class BookIssueService {
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.ISSUES}?${queryString}` : API_ENDPOINTS.ISSUES;
    const response = await api.get(url);
    return response.data;
  }

  async getById(id) {
    const response = await api.get(API_ENDPOINTS.ISSUE_BY_ID(id));
    return response.data;
  }

  async create(bookIssue) {
    const response = await api.post(API_ENDPOINTS.ISSUES, bookIssue);
    return response.data;
  }

  async update(id, bookIssue) {
    const response = await api.put(API_ENDPOINTS.ISSUE_BY_ID(id), bookIssue);
    return response.data;
  }

  async delete(id) {
    const response = await api.delete(API_ENDPOINTS.ISSUE_BY_ID(id));
    return response.data;
  }

  async returnBook(id) {
    const response = await api.put(API_ENDPOINTS.ISSUE_RETURN(id), {});
    return response.data;
  }

  async getByStudent(studentId) {
    const response = await api.get(API_ENDPOINTS.ISSUES_BY_STUDENT(studentId));
    return response.data;
  }

  async getByBook(bookId) {
    const response = await api.get(API_ENDPOINTS.ISSUES_BY_BOOK(bookId));
    return response.data;
  }

  async getOverdue() {
    try {
      console.log('Fetching overdue books...');
      const response = await api.get(API_ENDPOINTS.ISSUES_OVERDUE);
      console.log('Overdue books response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue books:', error);
      throw error;
    }
  }

  async sendOverdueNotification(id) {
    const response = await api.post(API_ENDPOINTS.ISSUE_NOTIFY(id));
    return response.data;
  }
}

export const bookIssueService = new BookIssueService(); 