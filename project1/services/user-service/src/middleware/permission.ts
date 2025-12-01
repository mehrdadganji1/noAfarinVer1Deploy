import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';
import {
  Permission,
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
  hasRoleLevel,
} from '../types/permissions';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        email: string;
        role: UserRole[];
      };
    }
  }
}

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!userHasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
        required: permission,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has any of the required permissions
 */
export function requireAnyPermission(permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!userHasAnyPermission(req.user.role, permissions)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action',
        required: permissions,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has all required permissions
 */
export function requireAllPermissions(permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!userHasAllPermissions(req.user.role, permissions)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have all required permissions',
        required: permissions,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const hasRole = req.user.role.some((userRole) => hasRoleLevel(userRole, role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'You do not have the required role',
        required: role,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has any of the required roles
 */
export function requireAnyRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const hasAnyRole = roles.some((requiredRole) =>
      req.user!.role.some((userRole) => hasRoleLevel(userRole, requiredRole))
    );

    if (!hasAnyRole) {
      return res.status(403).json({
        success: false,
        error: 'You do not have any of the required roles',
        required: roles,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user is admin
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  if (!req.user.role.includes(UserRole.ADMIN)) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  next();
}

/**
 * Middleware to check if user is manager or admin
 */
export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  const isManager = req.user.role.some((role) =>
    [UserRole.MANAGER, UserRole.ADMIN].includes(role)
  );

  if (!isManager) {
    return res.status(403).json({
      success: false,
      error: 'Manager or Admin access required',
    });
  }

  next();
}
