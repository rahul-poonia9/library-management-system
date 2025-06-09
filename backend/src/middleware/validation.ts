import { Request, Response, NextFunction } from 'express';
import { ValidationChain, body, param, query, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

type ValidationMiddleware = (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[];

export const bookValidation = {
  create: [
    body('title').notEmpty().trim().escape(),
    body('author').notEmpty().trim().escape(),
    body('isbn').notEmpty().trim().isLength({ min: 10, max: 13 }),
    body('quantity').isInt({ min: 1 }).default(1),
    body('category').notEmpty().trim(),
    body('shelf_location').optional().trim(),
    validate
  ] as ValidationMiddleware,
  update: [
    param('id').isInt({ min: 1 }),
    body('title').optional().trim().escape(),
    body('author').optional().trim().escape(),
    body('isbn').optional().trim().isLength({ min: 10, max: 13 }),
    body('quantity').optional().isInt({ min: 1 }),
    body('category').optional().trim(),
    body('shelf_location').optional().trim(),
    validate
  ] as ValidationMiddleware,
  search: [
    query('query').notEmpty().trim(),
    validate
  ] as ValidationMiddleware
};

export const studentValidation = {
  create: [
    body('name').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('department').notEmpty().trim(),
    body('roll_number').notEmpty().trim(),
    body('semester').isInt({ min: 1, max: 8 }),
    validate
  ] as ValidationMiddleware,
  update: [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
    body('department').optional().trim(),
    body('roll_number').optional().trim(),
    body('semester').optional().isInt({ min: 1, max: 8 }),
    validate
  ] as ValidationMiddleware,
  search: [
    query('query').notEmpty().trim(),
    validate
  ] as ValidationMiddleware
};

export const bookIssueValidation = {
  create: [
    body('book_id').isInt({ min: 1 }),
    body('student_id').isInt({ min: 1 }),
    body('issue_date').isISO8601().toDate(),
    body('due_date').isISO8601().toDate(),
    validate
  ] as ValidationMiddleware,
  return: [
    param('id').isInt({ min: 1 }),
    validate
  ] as ValidationMiddleware
}; 