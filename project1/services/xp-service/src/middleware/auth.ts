import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string[];
  };
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    console.log('[XP Auth] Checking token...');
    console.log('[XP Auth] JWT_SECRET:', JWT_SECRET.substring(0, 20) + '...');

    if (!token) {
      console.log('[XP Auth] No token provided');
      res.status(401).json({
        success: false,
        error: 'توکن احراز هویت یافت نشد',
      });
      return;
    }

    console.log('[XP Auth] Token:', token.substring(0, 50) + '...');

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('[XP Auth] Token verified successfully:', decoded);
    
    (req as AuthRequest).user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role || [],
    };

    next();
  } catch (error: any) {
    console.error('[XP Auth] Token verification failed:', error.message);
    res.status(401).json({
      success: false,
      error: 'توکن نامعتبر است',
    });
  }
};
