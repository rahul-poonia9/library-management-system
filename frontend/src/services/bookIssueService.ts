import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { BookIssue } from '../types';
import { AxiosResponse } from 'axios';

class BookIssueService {
  async getAll() {
    const response = await api.get<BookIssue[]>(API_ENDPOINTS.ISSUES);
    return response.data;
  }

  async getById(id: number) {
    const response = await api.get<BookIssue>(API_ENDPOINTS.ISSUE_BY_ID(id));
    return response.data;
  }

  async create(bookIssue: Omit<BookIssue, 'id' | 'created_at' | 'updated_at'>) {
    const response = await api.post<BookIssue>(API_ENDPOINTS.ISSUES, bookIssue);
    return response.data;
  }

  async update(id: number, bookIssue: Partial<BookIssue>) {
    const response = await api.put<BookIssue>(API_ENDPOINTS.ISSUE_BY_ID(id), bookIssue);
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete<BookIssue>(API_ENDPOINTS.ISSUE_BY_ID(id));
    return response.data;
  }

  async returnBook(id: number) {
    const response = await api.put<BookIssue>(API_ENDPOINTS.ISSUE_RETURN(id), {});
    return response.data;
  }

  async getByStudent(studentId: number) {
    const response = await api.get<BookIssue[]>(API_ENDPOINTS.ISSUES_BY_STUDENT(studentId));
    return response.data;
  }

  async getByBook(bookId: number) {
    const response = await api.get<BookIssue[]>(API_ENDPOINTS.ISSUES_BY_BOOK(bookId));
    return response.data;
  }

  async getOverdue() {
    try {
      console.log('Fetching overdue books...');
      const response = await api.get<BookIssue[]>(API_ENDPOINTS.ISSUES_OVERDUE);
      console.log('Overdue books response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue books:', error);
      throw error;
    }
  }

  async sendOverdueNotification(id: number) {
    const response = await api.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.ISSUE_NOTIFY(id)
    );
    return response.data;
  }
}

export const bookIssueService = new BookIssueService();