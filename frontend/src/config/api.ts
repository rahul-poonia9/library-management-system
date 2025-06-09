export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Books
  BOOKS: '/books',
  BOOKS_AVAILABLE: '/books/available',
  BOOKS_SEARCH: '/books/search',
  BOOK_BY_ID: (id: number) => `/books/${id}`,

  // Students
  STUDENTS: '/students',
  STUDENTS_SEARCH: '/students/search',
  STUDENTS_BY_DEPARTMENT: (department: string) => `/students/department/${department}`,
  STUDENTS_BY_SEMESTER: (semester: number) => `/students/semester/${semester}`,
  STUDENT_BY_ID: (id: number) => `/students/${id}`,

  // Book Issues
  ISSUES: '/issues',
  ISSUES_OVERDUE: '/issues/overdue',
  ISSUES_BY_STUDENT: (studentId: number) => `/issues/student/${studentId}`,
  ISSUES_BY_BOOK: (bookId: number) => `/issues/book/${bookId}`,
  ISSUE_BY_ID: (id: number) => `/issues/${id}`,
  ISSUE_RETURN: (id: number) => `/issues/${id}/return`,
  ISSUE_NOTIFY: (id: number) => `/issues/${id}/notify`,
}; 