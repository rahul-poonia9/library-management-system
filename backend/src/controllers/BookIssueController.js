import { BookIssueModel } from '../models/BookIssueModel.js';
import { handleError, ApiError } from '../utils/errorHandler.js';
import { sendOverdueNotification } from '../services/emailService.js';

export class BookIssueController {
  static async getAll(req, res) {
    try {
      const issues = await BookIssueModel.getAll();
      res.json({ success: true, data: issues });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const issue = await BookIssueModel.getById(parseInt(id));
      if (!issue) {
        throw new ApiError('Book issue not found', 404);
      }
      res.json({ success: true, data: issue });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async create(req, res) {
    try {
      const issue = await BookIssueModel.create(req.body);
      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async returnBook(req, res) {
    try {
      const { id } = req.params;
      const issue = await BookIssueModel.returnBook(parseInt(id));
      if (!issue) {
        throw new ApiError('Book issue not found', 404);
      }
      res.json({ success: true, data: issue });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getOverdue(req, res) {
    try {
      const issues = await BookIssueModel.getOverdue();
      res.json({ success: true, data: issues });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const issues = await BookIssueModel.getByStudent(parseInt(studentId));
      res.json({ success: true, data: issues });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getByBook(req, res) {
    try {
      const { bookId } = req.params;
      const issues = await BookIssueModel.getByBook(parseInt(bookId));
      res.json({ success: true, data: issues });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async sendOverdueNotification(req, res) {
    try {
      const { id } = req.params;
      const issue = await BookIssueModel.getById(parseInt(id));
      
      if (!issue) {
        throw new ApiError('Book issue not found', 404);
      }

      if (issue.status !== 'overdue') {
        throw new ApiError('Book is not overdue', 400);
      }

      await sendOverdueNotification(issue);
      
      res.json({ 
        success: true, 
        message: 'Overdue notification sent successfully' 
      });
    } catch (error) {
      handleError(error, res);
    }
  }
} 