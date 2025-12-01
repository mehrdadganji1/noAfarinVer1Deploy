import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Ensure both id and userId are set (support backward compatibility)
    const userId = decoded.userId || decoded.id;
    req.user = {
      id: userId,
      userId: userId,
      email: decoded.email,
      role: Array.isArray(decoded.role) ? decoded.role : [decoded.role]
    };
    
    console.log('🔐 Authenticated user:', {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    });
    
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      console.error('❌ Authorization failed: No user in request');
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const hasRole = roles.some((role) => userRoles.includes(role as any));

    console.log('🔒 Authorization check:', {
      requiredRoles: roles,
      userRoles: userRoles,
      hasAccess: hasRole
    });

    if (!hasRole) {
      console.error('❌ Authorization failed: Insufficient permissions');
      res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Insufficient permissions',
        details: `Required roles: ${roles.join(', ')}. User roles: ${userRoles.join(', ')}`
      });
      return;
    }

    next();
  };
};
