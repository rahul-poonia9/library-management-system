import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/bookService.js';
import { toast } from 'sonner';

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
    mutationFn: async (book) => {
      const response = await bookService.create(book);
      if (!response) {
        throw new Error('Failed to create book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create book');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, book }) => {
      const response = await bookService.update(id, book);
      if (!response) {
        throw new Error('Failed to update book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update book');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await bookService.delete(id);
      if (!response) {
        throw new Error('Failed to delete book');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete book');
    }
  });

  const searchBooks = useQuery({
    queryKey: ['books', 'search'],
    queryFn: ({ queryKey }) => bookService.search(queryKey[2]),
    enabled: false
  });

  const getAvailableBooks = useQuery({
    queryKey: ['books', 'available'],
    queryFn: bookService.getAvailable
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
    searchBooks: searchBooks.refetch,
    availableBooks: getAvailableBooks.data || []
  };
};

export const useAvailableBooks = () => {
  return useQuery({
    queryKey: ['books', 'available'],
    queryFn: bookService.getAvailable
  });
};

export const useBook = (id) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getById(id)
  });
};

export const useSearchBooks = (query) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => bookService.search(query),
    enabled: !!query
  });
}; 