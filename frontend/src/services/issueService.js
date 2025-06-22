import api from '../config/api';

const issueService = {
  async getAllIssues() {
    const response = await api.get('/issues');
    return response.data;
  },

  async getIssueById(id) {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  async createIssue(issueData) {
    const response = await api.post('/issues', issueData);
    return response.data;
  },

  async returnBook(id) {
    const response = await api.put(`/issues/${id}/return`);
    return response.data;
  },

  async getOverdueIssues() {
    const response = await api.get('/issues/overdue');
    return response.data;
  },

  async getActiveIssues() {
    const response = await api.get('/issues/active');
    return response.data;
  },

  async sendReminder(id) {
    const response = await api.post(`/issues/${id}/reminder`);
    return response.data;
  }
};

export default issueService; 