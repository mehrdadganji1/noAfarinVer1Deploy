import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string[] };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ success: false, error: 'No token' });
      return;
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    }
  } catch (error) {
    console.warn('Invalid token in optional auth, continuing without user');
  }
  next();
};
