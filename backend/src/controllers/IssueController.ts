import { Request, Response } from 'express';
import { BookIssueModel } from '../models/BookIssueModel';
import { handleError, ApiError } from '../utils/errorHandler';
import { sendOverdueNotification } from '../services/emailService';

export class IssueController {
  static async getAll(req: Request, res: Response) {
    try {
      const issues = await BookIssueModel.getAll();
      res.json({ success: true, data: issues });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getById(req: Request, res: Response) {
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

  static async create(req: Request, res: Response) {
    try {
      const issue = await BookIssueModel.create(req.body);
      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async return(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const issue = await BookIssueModel.return(parseInt(id));
      if (!issue) {
        throw new ApiError('Book issue not found', 404);
      }
      res.json({ success: true, data: issue });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async sendOverdueNotification(req: Request, res: Response) {
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