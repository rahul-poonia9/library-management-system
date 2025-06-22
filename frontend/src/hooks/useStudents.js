import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../services/studentService.js';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log('Fetching students...');
      const data = await studentService.getAll();
      console.log('Students response:', data);
      return data;
    },
  });

  return {
    students,
    isLoading,
    error,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  };
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentService.getById(id),
  });
};

export const useSearchStudents = (query) => {
  return useQuery({
    queryKey: ['students', 'search', query],
    queryFn: async () => {
      const response = await studentService.search(query);
      return response;
    },
    enabled: !!query
  });
};

export const useStudentsByDepartment = (department) => {
  return useQuery({
    queryKey: ['students', 'department', department],
    queryFn: async () => {
      const response = await studentService.getByDepartment(department);
      return response;
    },
    enabled: !!department
  });
};

export const useStudentsBySemester = (semester) => {
  return useQuery({
    queryKey: ['students', 'semester', semester],
    queryFn: async () => {
      const response = await studentService.getBySemester(semester);
      return response;
    },
    enabled: semester > 0
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (student) => studentService.create(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, student }) => studentService.update(id, student),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}; 