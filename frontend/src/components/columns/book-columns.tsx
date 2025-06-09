import { ColumnDef } from '@tanstack/react-table';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface BookColumnsProps {
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export const bookColumns = ({
  onEdit,
  onDelete,
}: BookColumnsProps): ColumnDef<Book>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'isbn',
    header: 'ISBN',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'shelf_location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.original.shelf_location;
      return location || '-';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(book)}
            title="Edit book"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(book)}
            className="text-red-500 hover:text-red-700"
            title="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
]; 