import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

export const bookColumns = ({
  onEdit,
  onDelete,
}) => [
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
            <Edit2 className="h-4 w-4" />
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