import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Book } from '../../types';
import { LoadingSpinner } from '../ui/loading-spinner';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  quantity: z.number().min(0),
  category: z.string().min(1, 'Category is required'),
  shelf_location: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookFormData) => void;
  book?: Book | null;
  isLoading?: boolean;
}

export const BookDialog = ({
  open,
  onOpenChange,
  onSubmit,
  book,
  isLoading,
}: BookDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book || {
      title: '',
      author: '',
      isbn: '',
      quantity: 1,
      category: '',
      shelf_location: '',
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('title')}
              placeholder="Title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('author')}
              placeholder="Author"
              className={errors.author ? 'border-red-500' : ''}
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('isbn')}
              placeholder="ISBN"
              className={errors.isbn ? 'border-red-500' : ''}
            />
            {errors.isbn && (
              <p className="text-red-500 text-sm mt-1">{errors.isbn.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('category')}
              placeholder="Category"
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('shelf_location')}
              placeholder="Shelf Location"
              className={errors.shelf_location ? 'border-red-500' : ''}
            />
            {errors.shelf_location && (
              <p className="text-red-500 text-sm mt-1">{errors.shelf_location.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              placeholder="Quantity"
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : book ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 