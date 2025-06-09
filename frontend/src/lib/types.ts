export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  category: string;
  shelf_location?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  roll_number: string;
  semester: number;
  created_at: string;
  updated_at: string;
}

export interface BookIssue {
  id: number;
  book_id: number;
  student_id: number;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: 'issued' | 'returned' | 'overdue';
  created_at: string;
  updated_at: string;
  book?: Book;
  student?: Student;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface BookFilters extends PaginationParams {
  title?: string;
  author?: string;
  category?: string;
}

export interface StudentFilters extends PaginationParams {
  name?: string;
  roll_number?: string;
  department?: string;
  semester?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
} 