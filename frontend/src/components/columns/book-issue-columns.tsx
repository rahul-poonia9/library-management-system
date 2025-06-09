import { ColumnDef } from '@tanstack/react-table';
import { BookIssue } from '../../types';
import { Button } from '../ui/button';
import { format } from 'date-fns';

interface BookIssueColumnsProps {
  onReturn: (id: number) => void;
  onSendNotification: (id: number) => void;
}

export const bookIssueColumns = ({
  onReturn,
  onSendNotification,
}: BookIssueColumnsProps): ColumnDef<BookIssue>[] => [
  {
    accessorKey: 'book.title',
    header: 'Book Title',
    cell: ({ row }) => row.original.book?.title || 'N/A',
  },
  {
    accessorKey: 'student.name',
    header: 'Student Name',
    cell: ({ row }) => row.original.student?.name || 'N/A',
  },
  {
    accessorKey: 'issue_date',
    header: 'Issue Date',
    cell: ({ row }) => format(new Date(row.original.issue_date), 'PPP'),
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: ({ row }) => {
      const dueDate = new Date(row.original.due_date);
      const isOverdue = row.original.status === 'overdue';
      return (
        <span className={isOverdue ? 'text-red-600' : ''}>
          {format(dueDate, 'PPP')}
        </span>
      );
    },
  },
  {
    accessorKey: 'return_date',
    header: 'Return Date',
    cell: ({ row }) => 
      row.original.return_date 
        ? format(new Date(row.original.return_date), 'PPP')
        : '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      
      const statusClasses = {
        issued: 'text-blue-600',
        overdue: 'text-red-600',
        returned: 'text-green-600',
      };
      
      return (
        <span className={statusClasses[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const issue = row.original;

      return (
        <div className="flex gap-2">
          {issue.status === 'issued' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReturn(issue.id)}
            >
              Return Book
            </Button>
          )}
          {issue.status === 'overdue' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendNotification(issue.id)}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-900"
            >
              Send Reminder
            </Button>
          )}
        </div>
      );
    },
  },
]; 