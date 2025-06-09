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
  roll_number: string;
  department: string;
  semester: number;
  phone: string;
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