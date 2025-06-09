import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { Book, ApiResponse, BookFilters } from '../lib/types';

class BookService {
  async getAll(): Promise<Book[]> {
    console.log('Making API call to get all books...');
    try {
      const response = await api.get<ApiResponse<Book[]> | Book[]>(API_ENDPOINTS.BOOKS);
      console.log('API response:', response.data);
      
      // Handle both wrapped and unwrapped responses
      const books = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(books) ? books : [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Book | null> {
    try {
      const response = await api.get<ApiResponse<Book> | Book>(API_ENDPOINTS.BOOK_BY_ID(id));
      const book = 'data' in response.data ? response.data.data : response.data;
      return book || null;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      return null;
    }
  }

  async create(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book | null> {
    try {
      console.log('Creating book with data:', book);
      const response = await api.post<ApiResponse<Book> | Book>(API_ENDPOINTS.BOOKS, book);
      console.log('Server response:', response);
      const created = 'data' in response.data ? response.data.data : response.data;
      return created || null;
    } catch (error) {
      console.error('Error creating book:', error);
      if (error instanceof Error && 'response' in error) {
        const response = (error as any).response;
        console.error('Server error response:', response?.data);
        if (response?.data?.errors) {
          const validationErrors = response.data.errors
            .map((err: any) => err.msg)
            .join(', ');
          throw new Error(`Validation failed: ${validationErrors}`);
        }
      }
      throw error;
    }
  }

  async update(id: number, book: Partial<Book>): Promise<Book | null> {
    try {
      const response = await api.put<ApiResponse<Book> | Book>(API_ENDPOINTS.BOOK_BY_ID(id), book);
      const updated = 'data' in response.data ? response.data.data : response.data;
      return updated || null;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<Book | null> {
    try {
      const response = await api.delete<ApiResponse<Book> | Book>(API_ENDPOINTS.BOOK_BY_ID(id));
      const deleted = 'data' in response.data ? response.data.data : response.data;
      return deleted || null;
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      if (error instanceof Error) {
        if (error.message.includes('active issues')) {
          throw new Error('This book cannot be deleted because it is currently issued to one or more students.');
        }
      }
      throw error;
    }
  }

  async search(query: string): Promise<Book[]> {
    try {
      const response = await api.get<ApiResponse<Book[]> | Book[]>(`${API_ENDPOINTS.BOOKS_SEARCH}?query=${encodeURIComponent(query)}`);
      const books = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(books) ? books : [];
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  async getByFilters(filters: BookFilters): Promise<Book[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      const response = await api.get<ApiResponse<Book[]> | Book[]>(`${API_ENDPOINTS.BOOKS}?${queryParams.toString()}`);
      const books = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(books) ? books : [];
    } catch (error) {
      console.error('Error fetching books with filters:', error);
      return [];
    }
  }

  async getAvailable(): Promise<Book[]> {
    try {
      const response = await api.get<ApiResponse<Book[]> | Book[]>(API_ENDPOINTS.BOOKS_AVAILABLE);
      const books = 'data' in response.data ? response.data.data : response.data;
      return Array.isArray(books) ? books : [];
    } catch (error) {
      console.error('Error fetching available books:', error);
      return [];
    }
  }
}

export const bookService = new BookService();