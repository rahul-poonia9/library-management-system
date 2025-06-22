import { Router } from 'express';
import { BookIssueController } from '../controllers/BookIssueController.js';
import { bookIssueValidation } from '../middleware/validation.js';

const router = Router();

// Get all issues
router.get('/', BookIssueController.getAll);

// Get overdue issues
router.get('/overdue', BookIssueController.getOverdue);

// Get issues by student
router.get('/student/:studentId', BookIssueController.getByStudent);

// Get issues by book
router.get('/book/:bookId', BookIssueController.getByBook);

// Create new issue
router.post('/', bookIssueValidation.create, BookIssueController.create);

// Return book
router.put('/:id/return', bookIssueValidation.return, BookIssueController.returnBook);

// Send overdue notification
router.post('/:id/notify', bookIssueValidation.return, BookIssueController.sendOverdueNotification);

// Get issue by ID - THIS MUST BE LAST
router.get('/:id', BookIssueController.getById);

export default router; 