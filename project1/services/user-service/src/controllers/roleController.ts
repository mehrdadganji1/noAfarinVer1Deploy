import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import { getUserPermissions } from '../types/permissions';

/**
 * Get user roles and permissions
 */
export const getUserRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id || req.user?.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    const user = await User.findById(userId).select('role email firstName lastName');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const permissions = getUserPermissions(user.role);

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roles: user.role,
        permissions,
      },
    });
  } catch (error: any) {
    console.error('Get user roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user roles',
    });
  }
};

/**
 * Assign roles to user (Admin only)
 */
export const assignRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, roles } = req.body;

    if (!userId || !roles || !Array.isArray(roles)) {
      res.status(400).json({
        success: false,
        error: 'User ID and roles array are required',
      });
      return;
    }

    // Validate roles
    const validRoles = roles.every((role) => Object.values(UserRole).includes(role));
    if (!validRoles) {
      res.status(400).json({
        success: false,
        error: 'Invalid role provided',
        validRoles: Object.values(UserRole),
      });
      return;
    }

    // Prevent manual assignment of CLUB_MEMBER role
    // CLUB_MEMBER can only be assigned through the promotion system
    if (roles.includes(UserRole.CLUB_MEMBER)) {
      res.status(400).json({
        success: false,
        error: 'Cannot manually assign CLUB_MEMBER role',
        message: 'Use POST /api/membership/promote/:userId to promote user to Club Member',
        hint: 'CLUB_MEMBER role must be assigned through the proper promotion flow to generate membership ID and initialize member data',
      });
      return;
    }

    // Prevent manual assignment of APPLICANT role
    // Users are automatically APPLICANT on registration
    if (roles.includes(UserRole.APPLICANT)) {
      res.status(400).json({
        success: false,
        error: 'Cannot manually assign APPLICANT role',
        message: 'APPLICANT is the default role assigned during registration',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Update roles
    user.role = roles;
    await user.save();

    const permissions = getUserPermissions(user.role);

    res.status(200).json({
      success: true,
      message: 'Roles assigned successfully',
      data: {
        userId: user._id,
        roles: user.role,
        permissions,
      },
    });
  } catch (error: any) {
    console.error('Assign roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign roles',
    });
  }
};

/**
 * Add role to user (Admin only)
 */
export const addRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({
        success: false,
        error: 'User ID and role are required',
      });
      return;
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({
        success: false,
        error: 'Invalid role provided',
        validRoles: Object.values(UserRole),
      });
      return;
    }

    // Prevent manual assignment of CLUB_MEMBER role
    if (role === UserRole.CLUB_MEMBER) {
      res.status(400).json({
        success: false,
        error: 'Cannot manually assign CLUB_MEMBER role',
        message: 'Use POST /api/membership/promote/:userId to promote user to Club Member',
      });
      return;
    }

    // Prevent manual assignment of APPLICANT role
    if (role === UserRole.APPLICANT) {
      res.status(400).json({
        success: false,
        error: 'Cannot manually assign APPLICANT role',
        message: 'APPLICANT is the default role assigned during registration',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Add role if not already present
    if (!user.role.includes(role)) {
      user.role.push(role);
      await user.save();
    }

    const permissions = getUserPermissions(user.role);

    res.status(200).json({
      success: true,
      message: 'Role added successfully',
      data: {
        userId: user._id,
        roles: user.role,
        permissions,
      },
    });
  } catch (error: any) {
    console.error('Add role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add role',
    });
  }
};

/**
 * Remove role from user (Admin only)
 */
export const removeRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({
        success: false,
        error: 'User ID and role are required',
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Remove role
    user.role = user.role.filter((r) => r !== role);

    // Ensure user has at least one role
    if (user.role.length === 0) {
      user.role = [UserRole.APPLICANT];
    }

    await user.save();

    const permissions = getUserPermissions(user.role);

    res.status(200).json({
      success: true,
      message: 'Role removed successfully',
      data: {
        userId: user._id,
        roles: user.role,
        permissions,
      },
    });
  } catch (error: any) {
    console.error('Remove role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove role',
    });
  }
};

/**
 * Get all available roles
 */
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = Object.values(UserRole).map((role) => ({
      value: role,
      label: role.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    }));

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error('Get all roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get roles',
    });
  }
};

/**
 * Get users by role (Admin/Manager only)
 */
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      res.status(400).json({
        success: false,
        error: 'Invalid role',
        validRoles: Object.values(UserRole),
      });
      return;
    }

    const users = await User.find({ role: role })
      .select('firstName lastName email role university major')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
    });
  }
};
