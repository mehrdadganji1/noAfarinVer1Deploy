import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user has required roles
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'دسترسی غیرمجاز',
      });
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'شما دسترسی لازم برای این عملیات را ندارید',
      });
    }

    next();
  };
};

// Alias for backward compatibility
export const requireRole = authorize;
