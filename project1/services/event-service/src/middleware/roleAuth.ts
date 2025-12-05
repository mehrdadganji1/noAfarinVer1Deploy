import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRole = req.user.role;
    
    // Handle both string and string[] role types
    const userRoles = Array.isArray(userRole) ? userRole : [userRole];
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: allowedRoles,
        userRole,
      });
    }

    next();
  };
};
