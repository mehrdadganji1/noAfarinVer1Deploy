import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    id: string; // Alias for userId
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
      }

      const userId = decoded.userId || decoded.id;
      req.user = {
        userId: userId,
        id: userId, // Alias for userId
        email: decoded.email,
        role: decoded.role,
      };

      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Alias for authenticateToken
export const authenticate = authenticateToken;

// Optional authentication - doesn't fail if no token
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token, but continue anyway
      next();
      return;
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (!err && decoded) {
        const userId = decoded.userId || decoded.id;
        req.user = {
          userId: userId,
          id: userId, // Alias for userId
          email: decoded.email,
          role: decoded.role,
        };
      }
      // Continue regardless of token validity
      next();
    });
  } catch (error) {
    // Continue even if there's an error
    next();
  }
};
