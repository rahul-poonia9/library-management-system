import api from './api.js';
import { API_ENDPOINTS } from '../config/api.js';

class StudentService {
  async getAll() {
    console.log('Making API call to get all students...');
    try {
      const response = await api.get(API_ENDPOINTS.STUDENTS);
      console.log('API response:', response.data);
      
      // Handle both wrapped and unwrapped responses
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await api.get(API_ENDPOINTS.STUDENT_BY_ID(id));
      const student = 'data' in response.data ? response.data.data : response.data;
      return student || null;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      return null;
    }
  }

  async create(student) {
    try {
      const response = await api.post(API_ENDPOINTS.STUDENTS, student);
      const created = 'data' in response.data ? response.data.data : response.data;
      return created || null;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async update(id, student) {
    try {
      const response = await api.put(API_ENDPOINTS.STUDENT_BY_ID(id), student);
      const updated = 'data' in response.data ? response.data.data : response.data;
      return updated || null;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(API_ENDPOINTS.STUDENT_BY_ID(id));
      const deleted = 'data' in response.data ? response.data.data : response.data;
      return deleted || null;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  }

  async search(query) {
    try {
      const response = await api.get(`${API_ENDPOINTS.STUDENTS_SEARCH}?query=${encodeURIComponent(query)}`);
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error('Error searching students:', error);
      return [];
    }
  }

  async getByDepartment(department) {
    try {
      const response = await api.get(API_ENDPOINTS.STUDENTS_BY_DEPARTMENT(department));
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error(`Error fetching students by department ${department}:`, error);
      return [];
    }
  }

  async getBySemester(semester) {
    try {
      const response = await api.get(API_ENDPOINTS.STUDENTS_BY_SEMESTER(semester));
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error(`Error fetching students by semester ${semester}:`, error);
      return [];
    }
  }
}

const studentService = new StudentService();
export default studentService; 