import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
  };
}

export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { id: number; email: string };

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}; 