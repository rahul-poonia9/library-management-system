import { useState } from 'react';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';
import { useBookIssues } from '../hooks/useBookIssues';
import { bookIssueColumns } from './columns/book-issue-columns';
import { IssueBookDialog } from './dialogs/IssueBookDialog';
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorAlert } from './ui/error-alert';
import { BookIssue } from '../types';
import { useToast } from './ui/use-toast';
import { bookIssueService } from '../services/bookIssueService';

interface IssueBookFormData {
  book_id: number;
  student_id: number;
  due_date: string;
}

export const IssueBookContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const { toast } = useToast();
  
  const {
    bookIssues,
    isLoading,
    error,
    createBookIssue,
    returnBook,
    isCreating,
    isReturning
  } = useBookIssues();

  const handleIssue = async (data: IssueBookFormData) => {
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

  const handleReturn = async (id: number) => {
    try {
      if (window.confirm('Are you sure you want to return this book?')) {
        await returnBook(id);
        toast({
          title: "Success",
          description: "Book returned successfully",
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

  const handleSendNotification = async (id: number) => {
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
        <h2 className="text-2xl font-bold">Book Issues</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={isCreating || isReturning || isSendingNotification}
        >
          Issue Book
        </Button>
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
