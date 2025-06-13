import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import { Book } from '../lib/types';

export const useBooks = () => {
  const queryClient = useQueryClient();

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      console.log('Fetching books...');
      try {
        const response = await bookService.getAll();
        console.log('Books response:', response);
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await bookService.create(book);
      if (!response) {
        throw new Error('Failed to create book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, book }: { id: number; book: Partial<Book> }) => {
      const response = await bookService.update(id, book);
      if (!response) {
        throw new Error('Failed to update book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await bookService.delete(id);
      if (!response) {
        throw new Error('Failed to delete book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return {
    books,
    isLoading,
    error,
    createBook: createMutation.mutate,
    updateBook: updateMutation.mutate,
    deleteBook: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useAvailableBooks = () => {
  return useQuery({
    queryKey: ['books', 'available'],
    queryFn: bookService.getAvailable
  });
};

export const useBook = (id: number) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getById(id)
  });
};

export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => bookService.search(query),
    enabled: !!query
  });
};
