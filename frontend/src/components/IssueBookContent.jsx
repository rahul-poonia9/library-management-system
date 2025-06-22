import { useState } from 'react';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';
import { useBookIssues } from '../hooks/useBookIssues';
import { bookIssueColumns } from './columns/book-issue-columns';
import { IssueBookDialog } from './dialogs/IssueBookDialog';
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorAlert } from './ui/error-alert';
import { useToast } from './ui/use-toast';
import { bookIssueService } from '../services/bookIssueService';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDebounce } from '../hooks/useDebounce';

export const IssueBookContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    book_name: '',
    student_name: '',
    status: '',
  });
  const debouncedFilters = useDebounce(filters, 500);
  
  const {
    bookIssues,
    isLoading,
    error,
    createBookIssue,
    returnBook,
    isCreating,
    isReturning
  } = useBookIssues(debouncedFilters);

  // Calculate overdue books count
  const overdueCount = bookIssues?.filter(issue => issue.status === 'overdue').length || 0;

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleIssue = async (data) => {
    try {
      const now = new Date();
      const dueDate = new Date(data.due_date);
      
      // Validate due date is in the future
      if (dueDate <= now) {
        toast({
          title: "Error",
          description: "Due date must be in the future",
          variant: "destructive",
        });
        return;
      }

      await createBookIssue({
        book_id: data.book_id,
        student_id: data.student_id,
        issue_date: now.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'issued',
        return_date: null,
      });

      toast({
        title: "Success",
        description: "Book issued successfully",
      });
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error issuing book:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to issue book",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async (id) => {
    try {
      // Find the issue to check if it's overdue
      const issue = bookIssues.find(issue => issue.id === id);
      const isOverdue = issue?.status === 'overdue';
      
      const confirmMessage = isOverdue 
        ? 'This book is overdue. Are you sure you want to return it? This will clear the overdue status.'
        : 'Are you sure you want to return this book?';
      
      if (window.confirm(confirmMessage)) {
        await returnBook(id);
        toast({
          title: "Success",
          description: isOverdue 
            ? "Overdue book returned successfully" 
            : "Book returned successfully",
        });
      }
    } catch (err) {
      console.error('Error returning book:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to return book",
        variant: "destructive",
      });
    }
  };

  const handleSendNotification = async (id) => {
    try {
      setIsSendingNotification(true);
      await bookIssueService.sendOverdueNotification(id);
      toast({
        title: "Success",
        description: "Overdue notification sent successfully",
      });
    } catch (err) {
      console.error('Error sending notification:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message="Failed to load book issues" />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Book Issues</h2>
          {overdueCount > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {overdueCount} Overdue
            </span>
          )}
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={isCreating || isReturning || isSendingNotification}
        >
          Issue Book
        </Button>
      </div>

      <div className="flex items-center space-x-2 pb-4">
        <Input
          placeholder="Filter by book name..."
          value={filters.book_name}
          onChange={(e) => handleFilterChange('book_name', e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by student name..."
          value={filters.student_name}
          onChange={(e) => handleFilterChange('student_name', e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={bookIssueColumns({ 
          onReturn: handleReturn,
          onSendNotification: handleSendNotification
        })}
        data={bookIssues}
      />

      <IssueBookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleIssue}
        isLoading={isCreating}
      />
    </div>
  );
}; 