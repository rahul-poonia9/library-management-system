import { Response } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleError = (error: any, res: Response) => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  // Handle PostgreSQL unique violation error
  if (error.code === '23505') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }

  // Handle PostgreSQL foreign key violation
  if (error.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record not found'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}; 