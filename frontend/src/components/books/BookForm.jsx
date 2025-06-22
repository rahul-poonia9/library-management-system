import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import bookService from '../../services/bookService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useToast } from '../ui/use-toast';

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

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Other',
    quantity: 1,
    shelf_location: '',
  });

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBookById(id),
    enabled: isEditMode,
  });

  // Update form data when book is loaded
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || 'Other',
        quantity: book.quantity || 1,
        shelf_location: book.shelf_location || '',
      });
    }
  }, [book]);

  const mutation = useMutation({
    mutationFn: (data) =>
      isEditMode ? bookService.updateBook(id, data) : bookService.createBook(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Book ${isEditMode ? 'updated' : 'created'} successfully`,
      });
      navigate('/books');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Operation failed',
        variant: 'destructive',
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
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
    const quantity = formData.quantity || 1;
    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity must be at least 1",
        variant: "destructive",
      });
      return;
    }

    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      quantity,
      category: formData.category.trim(),
      shelf_location: formData.shelf_location?.trim() || null
    };

    mutation.mutate(bookData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Book' : 'Add New Book'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={13}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
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

        <div className="space-y-2">
          <Label htmlFor="shelf_location">Shelf Location</Label>
          <Input
            id="shelf_location"
            name="shelf_location"
            value={formData.shelf_location}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update Book'
              : 'Create Book'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/books')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 