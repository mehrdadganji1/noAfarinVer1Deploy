import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email: string;
  role: string[];
}

/**
 * Authenticate middleware - verify JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز - توکن یافت نشد',
      });
      return;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Attach user to request
    (req as any).user = decoded;
    
    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'توکن منقضی شده است',
      });
      return;
    }
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        error: 'توکن نامعتبر است',
      });
      return;
    }
    
    res.status(401).json({
      success: false,
      error: 'خطا در احراز هویت',
    });
  }
};

/**
 * Authorize middleware - check user roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز',
      });
      return;
    }
    
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: 'شما دسترسی لازم برای این عملیات را ندارید',
      });
      return;
    }
    
    next();
  };
};
