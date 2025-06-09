import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BookDialog } from "./books/BookDialog";
import { Book } from "@/lib/types";
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

export const BooksContent = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

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
  } = useBooks();

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (book: Book) => {
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

  const handleSubmit = async (data: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
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
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
