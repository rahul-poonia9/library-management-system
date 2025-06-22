import { BookModel } from '../models/BookModel.js';
import { handleError, ApiError } from '../utils/errorHandler.js';

export class BookController {
  static async getAll(req, res) {
    try {
      const books = await BookModel.getAll();
      res.json({ success: true, data: books });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getById(req, res) {
    try {
      const book = await BookModel.getById(parseInt(req.params.id));
      if (!book) {
        throw new ApiError('Book not found', 404);
      }
      res.json({ success: true, data: book });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async create(req, res) {
    try {
      console.log('Received book creation request:', req.body);
      
      // Validate required fields
      const { title, author, isbn, quantity, category } = req.body;
      
      if (!title || !author || !isbn || !category) {
        throw new ApiError('Missing required fields: title, author, isbn, and category are required', 400);
      }
      
      if (isbn.length < 10 || isbn.length > 13) {
        throw new ApiError('ISBN must be between 10 and 13 characters', 400);
      }

      if (quantity && (isNaN(quantity) || quantity < 1)) {
        throw new ApiError('Quantity must be a positive number', 400);
      }

      const book = await BookModel.create(req.body);
      console.log('Created book:', book);
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      console.error('Error in book creation:', error);
      handleError(error, res);
    }
  }

  static async update(req, res) {
    try {
      const book = await BookModel.update(parseInt(req.params.id), req.body);
      if (!book) {
        throw new ApiError('Book not found', 404);
      }
      res.json({ success: true, data: book });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async delete(req, res) {
    try {
      const book = await BookModel.delete(parseInt(req.params.id));
      if (!book) {
        throw new ApiError('Book not found', 404);
      }
      res.json({ success: true, data: book });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async search(req, res) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw new ApiError('Search query is required', 400);
      }
      const books = await BookModel.search(query);
      res.json({ success: true, data: books });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getAvailable(req, res) {
    try {
      const books = await BookModel.getAvailableBooks();
      res.json({ success: true, data: books });
    } catch (error) {
      handleError(error, res);
    }
  }
} 