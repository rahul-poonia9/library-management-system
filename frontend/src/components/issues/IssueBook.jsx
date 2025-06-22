import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import issueService from '../../services/issueService';
import bookService from '../../services/bookService';
import studentService from '../../services/studentService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '../ui/use-toast';

export default function IssueBook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bookId: '',
    studentId: '',
    dueDate: '',
  });

  const { data: books } = useQuery({
    queryKey: ['availableBooks'],
    queryFn: bookService.getAvailableBooks,
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAllStudents,
  });

  const mutation = useMutation({
    mutationFn: issueService.createIssue,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Book issued successfully',
      });
      navigate('/issues');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to issue book',
        variant: 'destructive',
      });
    },
  });

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Issue Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="book">Book</Label>
          <Select
            value={formData.bookId}
            onValueChange={(value) => handleSelectChange('bookId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {books?.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title} - {book.author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="student">Student</Label>
          <Select
            value={formData.studentId}
            onValueChange={(value) => handleSelectChange('studentId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students?.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} - {student.rollNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleSelectChange('dueDate', e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Issuing...' : 'Issue Book'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/issues')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 