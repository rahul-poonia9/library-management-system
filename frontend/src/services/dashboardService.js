import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class DashboardService {
  async getStatistics() {
    try {
      const response = await api.get('/dashboard/statistics');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalBooks: 0,
        totalStudents: 0,
        activeIssues: 0,
        overdueBooks: 0,
        returnedBooks: 0
      };
    }
  }

  async getRecentActivity() {
    try {
      const response = await api.get('/dashboard/recent-activity');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  async getOverdueBooks() {
    try {
      const response = await api.get(API_ENDPOINTS.ISSUES_OVERDUE);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching overdue books:', error);
      return [];
    }
  }

  async getDepartmentStats() {
    try {
      const response = await api.get('/dashboard/department-stats');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching department stats:', error);
      return [];
    }
  }

  async getBookCategories() {
    try {
      const response = await api.get('/dashboard/book-categories');
      const data = response.data || response;
      return data.data || data;
    } catch (error) {
      console.error('Error fetching book categories:', error);
      return this.generateDefaultCategoryData();
    }
  }

  async getDailyActivity() {
    try {
      const response = await api.get('/dashboard/daily-activity');
      const data = response.data || response;
      return data.data || data;
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      return this.generateDefaultDailyData();
    }
  }

  generateDefaultCategoryData() {
    return [
      { name: 'Fiction', count: 0 },
      { name: 'Non-Fiction', count: 0 },
      { name: 'Science Fiction', count: 0 },
      { name: 'Romance', count: 0 },
      { name: 'Fantasy', count: 0 }
    ];
  }

  generateDefaultDailyData() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        issued: 0,
        returned: 0
      });
    }
    return days;
  }
}

export default new DashboardService(); 