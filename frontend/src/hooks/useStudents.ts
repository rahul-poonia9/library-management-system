import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import { Student, ApiResponse } from '../lib/types';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error } = useQuery<Student[]>({
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

export const useStudent = (id: number) => {
  return useQuery<Student>({
    queryKey: ['students', id],
    queryFn: () => studentService.getById(id),
  });
};

export const useSearchStudents = (query: string) => {
  return useQuery<Student[]>({
    queryKey: ['students', 'search', query],
    queryFn: async () => {
      const response = await studentService.search(query);
      return response;
    },
    enabled: !!query
  });
};

export const useStudentsByDepartment = (department: string) => {
  return useQuery<Student[]>({
    queryKey: ['students', 'department', department],
    queryFn: async () => {
      const response = await studentService.getByDepartment(department);
      return response;
    },
    enabled: !!department
  });
};

export const useStudentsBySemester = (semester: number) => {
  return useQuery<Student[]>({
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
    mutationFn: (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => studentService.create(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, student }: { id: number; student: Partial<Student> }) => studentService.update(id, student),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}; 