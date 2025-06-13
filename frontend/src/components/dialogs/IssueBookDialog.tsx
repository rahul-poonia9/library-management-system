import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useBooks } from '../../hooks/useBooks';
import { useStudents } from '../../hooks/useStudents';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const issueBookSchema = z.object({
  book_id: z.number().min(1, 'Book is required'),
  student_id: z.number().min(1, 'Student is required'),
  due_date: z.string().min(1, 'Due date is required'),
});

type IssueBookFormData = z.infer<typeof issueBookSchema>;

interface IssueBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IssueBookFormData) => void;
  isLoading?: boolean;
}

export const IssueBookDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: IssueBookDialogProps) => {
  const { books, isLoading: isBooksLoading } = useBooks();
  const { students, isLoading: isStudentsLoading } = useStudents();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IssueBookFormData>({
    resolver: zodResolver(issueBookSchema),
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const isLoadingData = isBooksLoading || isStudentsLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book_id">Book</Label>
            <Select
              onValueChange={(value) => setValue('book_id', Number(value))}
              disabled={isLoadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {books?.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.title} by {book.author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.book_id && (
              <p className="text-red-500 text-sm mt-1">{errors.book_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_id">Student</Label>
            <Select
              onValueChange={(value) => setValue('student_id', Number(value))}
              disabled={isLoadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name} ({student.roll_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.student_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.student_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              type="date"
              {...register('due_date')}
              className="w-full"
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Minimum date is tomorrow
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.due_date.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingData}>
              {isLoading ? <LoadingSpinner /> : 'Issue Book'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 