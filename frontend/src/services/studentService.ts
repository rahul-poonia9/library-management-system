import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { Student, ApiResponse } from '../lib/types';

class StudentService {
  async getAll(): Promise<Student[]> {
    console.log('Making API call to get all students...');
    try {
      const response = await api.get<ApiResponse<Student[]> | Student[]>(API_ENDPOINTS.STUDENTS);
      console.log('API response:', response.data);
      
      // Handle both wrapped and unwrapped responses
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Student | null> {
    try {
      const response = await api.get<ApiResponse<Student> | Student>(API_ENDPOINTS.STUDENT_BY_ID(id));
      const student = 'data' in response.data ? response.data.data : response.data;
      return student || null;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      return null;
    }
  }

  async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student | null> {
    try {
      const response = await api.post<ApiResponse<Student> | Student>(API_ENDPOINTS.STUDENTS, student);
      const created = 'data' in response.data ? response.data.data : response.data;
      return created || null;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async update(id: number, student: Partial<Student>): Promise<Student | null> {
    try {
      const response = await api.put<ApiResponse<Student> | Student>(API_ENDPOINTS.STUDENT_BY_ID(id), student);
      const updated = 'data' in response.data ? response.data.data : response.data;
      return updated || null;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<Student | null> {
    try {
      const response = await api.delete<ApiResponse<Student> | Student>(API_ENDPOINTS.STUDENT_BY_ID(id));
      const deleted = 'data' in response.data ? response.data.data : response.data;
      return deleted || null;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  }

  async search(query: string): Promise<Student[]> {
    try {
      const response = await api.get<ApiResponse<Student[]> | Student[]>(`${API_ENDPOINTS.STUDENTS_SEARCH}?query=${encodeURIComponent(query)}`);
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error('Error searching students:', error);
      return [];
    }
  }

  async getByDepartment(department: string): Promise<Student[]> {
    try {
      const response = await api.get<ApiResponse<Student[]> | Student[]>(API_ENDPOINTS.STUDENTS_BY_DEPARTMENT(department));
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error(`Error fetching students by department ${department}:`, error);
      return [];
    }
  }

  async getBySemester(semester: number): Promise<Student[]> {
    try {
      const response = await api.get<ApiResponse<Student[]> | Student[]>(API_ENDPOINTS.STUDENTS_BY_SEMESTER(semester));
      const students = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(students) ? students : [];
    } catch (error) {
      console.error(`Error fetching students by semester ${semester}:`, error);
      return [];
    }
  }
}

export const studentService = new StudentService(); 