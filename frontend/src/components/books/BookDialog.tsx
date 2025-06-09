import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book;
  onSubmit: (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
}

const BOOK_CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Literature",
  "Other",
];

export function BookDialog({ open, onOpenChange, book, onSubmit, isLoading }: BookDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Book>>(
    book || {
      title: "",
      author: "",
      isbn: "",
      quantity: 1,
      category: "Other",
      shelf_location: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title?.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.author?.trim()) {
      toast({
        title: "Error",
        description: "Author is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.isbn?.trim() || formData.isbn.length < 10 || formData.isbn.length > 13) {
      toast({
        title: "Error",
        description: "ISBN must be between 10 and 13 characters",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category?.trim()) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive",
      });
      return;
    }

    // Ensure quantity is a positive number
    const quantity = formData.quantity || 1;
    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    // Prepare data for submission
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      quantity,
      category: formData.category.trim(),
      shelf_location: formData.shelf_location?.trim() || null
    };

    console.log('Submitting book data:', bookData);

    try {
      await onSubmit(bookData as Omit<Book, 'id' | 'created_at' | 'updated_at'>);
      toast({
        title: book ? "Book Updated" : "Book Added",
        description: `Successfully ${book ? "updated" : "added"} ${bookData.title}`,
      });
      onOpenChange(false);
    } catch (error) {
      let errorMessage = "Failed to save book. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          errorMessage = "Please check all required fields are filled correctly.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="book-form-description">
        <div id="book-form-description" className="sr-only">
          Form to {book ? 'edit existing' : 'add new'} book details including title, author, ISBN, quantity, and other information
        </div>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                required
                minLength={10}
                maxLength={13}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value)
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shelf_location">Shelf Location</Label>
              <Input
                id="shelf_location"
                value={formData.shelf_location}
                onChange={(e) =>
                  setFormData({ ...formData, shelf_location: e.target.value })
                }
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Loading...
                </>
              ) : book ? (
                "Save Changes"
              ) : (
                "Add Book"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 