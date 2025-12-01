import express from 'express';
import {
  getAllUsers,
  getUserStats,
  getUserById,
  updateUser,
  deleteUser,
  assignRoles,
  toggleUserStatus,
} from '../controllers/userController';
import {
  getAdminStats,
  getUserGrowth,
  getActivityLog,
} from '../controllers/statsController';
import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Authorization middleware
const authorize = (...allowedRoles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'دسترسی غیرمجاز' });
    }
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ success: false, error: 'شما دسترسی لازم برای این عملیات را ندارید' });
    }
    next();
  };
};

// All routes require authentication
router.use(authenticate);

// Admin stats routes
router.get('/admin-stats', authorize('admin', 'manager', 'director'), getAdminStats);
router.get('/user-growth', authorize('admin', 'manager', 'director'), getUserGrowth);
router.get('/activity-log', authorize('admin', 'manager', 'director'), getActivityLog);

// Admin only routes (Director has full access)
router.get('/stats', authorize('admin', 'director'), getUserStats);
router.get('/', authorize('admin', 'manager', 'director'), getAllUsers);

// Special route: Get own profile (any authenticated user)
router.get('/me', async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ success: false, error: 'دسترسی غیرمجاز' });
    }
    
    const userData = await require('../models/User').default.findById(user.userId)
      .select('-password -refreshToken')
      .lean();
    
    if (!userData) {
      return res.status(404).json({ success: false, error: 'کاربر یافت نشد' });
    }
    
    res.json({ success: true, data: userData });
  } catch (error: any) {
    console.error('Get own profile error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت پروفایل' });
  }
});

// Update user roles (Admin/Director only) - Must be before /:id route
router.patch('/:id/roles', authorize('admin', 'director'), async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    console.log('Update roles request:', { userId: id, roles });

    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        error: 'نقش‌ها الزامی است و باید آرایه باشد',
      });
    }

    const User = require('../models/User').default;
    const user = await User.findByIdAndUpdate(
      id,
      { role: roles },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    console.log('Roles updated successfully:', { userId: id, newRoles: user.role });

    res.json({
      success: true,
      message: 'نقش‌های کاربر با موفقیت بروزرسانی شد',
      data: user,
    });
  } catch (error: any) {
    console.error('Update roles error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بروزرسانی نقش‌ها',
      details: error.message,
    });
  }
});

// Update single user role (Admin/Director only) - Used by event-service for AACO approval
router.patch('/:id/role', authorize('admin', 'director'), async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log('Update single role request:', { userId: id, role });

    if (!role || typeof role !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'نقش الزامی است',
      });
    }

    const User = require('../models/User').default;
    const user = await User.findByIdAndUpdate(
      id,
      { role: [role] }, // Set as array with single role
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    console.log('Role updated successfully:', { userId: id, newRole: user.role });

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت بروزرسانی شد',
      data: user,
    });
  } catch (error: any) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بروزرسانی نقش',
      details: error.message,
    });
  }
});

// Toggle user status (Admin/Director only) - Must be before /:id route
router.patch('/:id/toggle-status', authorize('admin', 'director'), toggleUserStatus);

// Get user by ID (Admin/Manager/Director only)
router.get('/:id', authorize('admin', 'manager', 'director'), getUserById);
router.put('/:id', authorize('admin', 'director'), updateUser);
router.delete('/:id', authorize('admin', 'director'), deleteUser);

// Role management (Director has full access)
router.post('/roles/assign', authorize('admin', 'director'), assignRoles);

// Settings management (Admin and Director)
router.get('/settings', authorize('admin', 'director'), getSettings);
router.put('/settings', authorize('admin', 'director'), updateSettings);
router.post('/settings/reset', authorize('admin', 'director'), resetSettings);

export default router;
