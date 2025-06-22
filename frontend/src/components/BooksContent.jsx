import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookDialog } from "./books/BookDialog";
import { useBooks } from "@/hooks/useBooks";
import { DataTable } from '@/components/ui/data-table';
import { bookColumns } from './columns/book-columns';
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorAlert } from './ui/error-alert';
import { useToast } from "./ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export const BooksContent = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    category: "",
  });
  const debouncedFilters = useDebounce(filters, 500);

  const {
    books,
    isLoading,
    error,
    createBook,
    updateBook,
    deleteBook,
    isCreating,
    isUpdating,
    isDeleting
  } = useBooks(debouncedFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (book) => {
    setBookToDelete(book);
  };

  const handleDeleteCancel = () => {
    setBookToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.id);
      toast({
        title: "Book Deleted",
        description: `Successfully deleted ${bookToDelete.title}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBookToDelete(null);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedBook) {
        await updateBook({ id: selectedBook.id, book: data });
        toast({
          title: "Book Updated",
          description: `Successfully updated ${data.title}`,
        });
      } else {
        await createBook(data);
        toast({
          title: "Book Created",
          description: `Successfully created ${data.title}`,
        });
      }
      setIsDialogOpen(false);
      setSelectedBook(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${selectedBook ? 'update' : 'create'} book`;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error instanceof Error ? error.message : "Failed to load books"} />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Books</h2>
        <Button
          onClick={() => {
            setSelectedBook(null);
            setIsDialogOpen(true);
          }}
          disabled={isCreating || isUpdating || isDeleting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="flex items-center space-x-2 pb-4">
        <Input
          placeholder="Filter by title..."
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by author..."
          name="author"
          value={filters.author}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by category..."
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={bookColumns({ onEdit: handleEdit, onDelete: handleDeleteConfirm })}
        data={books}
      />

      <BookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        book={selectedBook}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the book "{bookToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 transition-colors px-4 py-2 rounded-md"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 