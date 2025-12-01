import { Request, Response } from 'express';
import User from '../models/User';

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت کاربران',
    });
  }
};

/**
 * Get user statistics (Admin only)
 */
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });
    
    const usersByRole = await User.aggregate([
      {
        $unwind: '$role'
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        byRole: usersByRole,
        recent: recentUsers,
      },
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار کاربران',
    });
  }
};

/**
 * Get user by ID (Admin only)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت کاربر',
    });
  }
};

/**
 * Update user (Admin only)
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password update through this endpoint
    delete updates.password;
    delete updates.refreshToken;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    res.json({
      success: true,
      message: 'کاربر به‌روزرسانی شد',
      data: user,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی کاربر',
    });
  }
};

/**
 * Toggle user status (Admin only)
 */
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? 'کاربر فعال شد' : 'کاربر غیرفعال شد',
      data: {
        _id: user._id,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تغییر وضعیت کاربر',
    });
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    res.json({
      success: true,
      message: 'کاربر حذف شد',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف کاربر',
    });
  }
};

/**
 * Assign roles to user (Admin only)
 */
export const assignRoles = async (req: Request, res: Response) => {
  try {
    const { userId, roles } = req.body;

    if (!userId || !roles || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        error: 'شناسه کاربر و نقش‌ها الزامی است',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: roles },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'کاربر یافت نشد',
      });
    }

    res.json({
      success: true,
      message: 'نقش‌ها با موفقیت تخصیص داده شد',
      data: user,
    });
  } catch (error: any) {
    console.error('Assign roles error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تخصیص نقش‌ها',
    });
  }
};
