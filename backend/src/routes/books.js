import { Router } from 'express';
import { BookController } from '../controllers/BookController.js';
import { bookValidation } from '../middleware/validation.js';

const router = Router();

// Get all books
router.get('/', BookController.getAll);

// Get available books
router.get('/available', BookController.getAvailable);

// Search books
router.get('/search', bookValidation.search, BookController.search);

// Get book by ID
router.get('/:id', BookController.getById);

// Create new book
router.post('/', bookValidation.create, BookController.create);

// Update book
router.put('/:id', bookValidation.update, BookController.update);

// Delete book
router.delete('/:id', BookController.delete);

export default router; 