export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  category: string;
  shelf_location?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  roll_number: string;
  semester: number;
  created_at: Date;
  updated_at: Date;
}

export interface BookIssue {
  id: number;
  book_id: number;
  student_id: number;
  issue_date: Date;
  due_date: Date;
  return_date?: Date | null;
  status: 'issued' | 'returned' | 'overdue';
  created_at: Date;
  updated_at: Date;
} 