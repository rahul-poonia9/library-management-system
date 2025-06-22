import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import issueService from '../../services/issueService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useToast } from '../ui/use-toast';

export default function IssueList() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: issues, isLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: issueService.getAllIssues,
  });

  const returnMutation = useMutation({
    mutationFn: issueService.returnBook,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Book returned successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to return book',
        variant: 'destructive',
      });
    },
  });

  const reminderMutation = useMutation({
    mutationFn: issueService.sendReminder,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Reminder sent successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send reminder',
        variant: 'destructive',
      });
    },
  });

  const handleReturn = async (id) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      returnMutation.mutate(id);
    }
  };

  const handleReminder = async (id) => {
    if (window.confirm('Send reminder to the student?')) {
      reminderMutation.mutate(id);
    }
  };

  const filteredIssues = issues?.filter((issue) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      issue.book.title.toLowerCase().includes(searchLower) ||
      issue.student.name.toLowerCase().includes(searchLower) ||
      issue.student.rollNumber.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Book Issues</h2>
        <Button onClick={() => navigate('/issues/new')}>Issue New Book</Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIssues?.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.book.title}</TableCell>
              <TableCell>
                {issue.student.name} ({issue.student.rollNumber})
              </TableCell>
              <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(issue.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    issue.returned
                      ? 'bg-green-100 text-green-800'
                      : new Date(issue.dueDate) < new Date()
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {issue.returned
                    ? 'Returned'
                    : new Date(issue.dueDate) < new Date()
                    ? 'Overdue'
                    : 'Active'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {!issue.returned && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturn(issue.id)}
                      >
                        Return
                      </Button>
                      {new Date(issue.dueDate) < new Date() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReminder(issue.id)}
                        >
                          Send Reminder
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 