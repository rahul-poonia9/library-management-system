import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookIssueService } from '../services/bookIssueService.js';

export const useBookIssues = () => {
  const queryClient = useQueryClient();

  const { data: bookIssues = [], isLoading, error } = useQuery({
    queryKey: ['bookIssues'],
    queryFn: async () => {
      const response = await bookIssueService.getAll();
      return response || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (bookIssue) =>
      bookIssueService.create(bookIssue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookIssues'] });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id) => bookIssueService.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookIssues'] });
    },
  });

  return {
    bookIssues,
    isLoading,
    error,
    createBookIssue: createMutation.mutate,
    returnBook: returnMutation.mutate,
    isCreating: createMutation.isPending,
    isReturning: returnMutation.isPending,
  };
};

export const useBookIssuesByStudent = (studentId) => {
  const { data: bookIssues = [], ...rest } = useQuery({
    queryKey: ['bookIssues', 'student', studentId],
    queryFn: async () => {
      const response = await bookIssueService.getByStudent(studentId);
      return response || [];
    },
    enabled: !!studentId,
  });

  return { bookIssues, ...rest };
};

export const useBookIssuesByBook = (bookId) => {
  const { data: bookIssues = [], ...rest } = useQuery({
    queryKey: ['bookIssues', 'book', bookId],
    queryFn: async () => {
      const response = await bookIssueService.getByBook(bookId);
      return response || [];
    },
    enabled: !!bookId,
  });

  return { bookIssues, ...rest };
};

export const useOverdueBookIssues = () => {
  const { data: bookIssues = [], isLoading, error } = useQuery({
    queryKey: ['bookIssues', 'overdue'],
    queryFn: async () => {
      console.log('useOverdueBookIssues: Fetching data...');
      const response = await bookIssueService.getOverdue();
      console.log('useOverdueBookIssues: Received data:', response);
      return response || [];
    },
    // Refresh every minute to keep overdue status up to date
    refetchInterval: 60000,
  });

  console.log('useOverdueBookIssues: Current data:', bookIssues);
  return { data: bookIssues, isLoading, error };
};

export const useOverdueCount = () => {
  const { data: overdueIssues = [], isLoading, error } = useOverdueBookIssues();
  return { 
    count: overdueIssues.length,
    isLoading,
    error
  };
}; 