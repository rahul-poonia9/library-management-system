import { Button } from '../ui/button';
import { format } from 'date-fns';

export const bookIssueColumns = ({
  onReturn,
  onSendNotification,
}) => [
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
        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
          {format(dueDate, 'PPP')}
          {isOverdue && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              OVERDUE
            </span>
          )}
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
        issued: 'text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm',
        overdue: 'text-red-600 bg-red-50 px-2 py-1 rounded text-sm font-semibold',
        returned: 'text-green-600 bg-green-50 px-2 py-1 rounded text-sm',
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
      const isReturned = issue.status === 'returned';
      
      // Don't show any actions for returned books
      if (isReturned) {
        return <span className="text-gray-500 text-sm">No actions available</span>;
      }

      return (
        <div className="flex gap-2">
          {/* Return button for both issued and overdue books */}
          {(issue.status === 'issued' || issue.status === 'overdue') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReturn(issue.id)}
              className={issue.status === 'overdue' ? 'border-red-200 text-red-700 hover:bg-red-50' : ''}
            >
              Return Book
            </Button>
          )}
          
          {/* Send reminder button only for overdue books */}
          {issue.status === 'overdue' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendNotification(issue.id)}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-200"
            >
              Send Reminder
            </Button>
          )}
        </div>
      );
    },
  },
]; 