import { Request, Response } from 'express';
import User from '../models/User';
import Application from '../models/Application';

/**
 * Get comprehensive admin statistics
 */
export const getAdminStats = async (req: Request, res: Response) => {
  console.log('📊 getAdminStats called');
  try {
    const { timeRange = 'month' } = req.query;
    console.log('📊 Time range:', timeRange);

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Users by role
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

    const roleStats: any = {};
    usersByRole.forEach((item: any) => {
      roleStats[item._id] = item.count;
    });

    // New users in time range
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Previous period for growth calculation
    const previousStartDate = new Date(startDate);
    previousStartDate.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()));
    
    const previousNewUsers = await User.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });

    const growth = previousNewUsers > 0 
      ? Math.round(((newUsers - previousNewUsers) / previousNewUsers) * 100)
      : 100;

    // Active users by period
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyActive = await User.countDocuments({
      lastLogin: { $gte: oneDayAgo }
    });

    const weeklyActive = await User.countDocuments({
      lastLogin: { $gte: oneWeekAgo }
    });

    const monthlyActive = await User.countDocuments({
      lastLogin: { $gte: oneMonthAgo }
    });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    const underReviewApplications = await Application.countDocuments({ status: 'under-review' });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        applicants: roleStats['applicant'] || 0,
        clubMembers: roleStats['club_member'] || 0,
        admins: (roleStats['admin'] || 0) + (roleStats['manager'] || 0),
        growth: growth,
        new: newUsers,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
        underReview: underReviewApplications,
        approvalRate: totalApplications > 0 
          ? Math.round((approvedApplications / totalApplications) * 100)
          : 0,
      },
      activity: {
        dailyActiveUsers: dailyActive,
        weeklyActiveUsers: weeklyActive,
        monthlyActiveUsers: monthlyActive,
      },
      timeRange,
      generatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار',
      message: error.message,
    });
  }
};

/**
 * Get user growth data for charts
 */
export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    const { months = 6 } = req.query;
    const monthsCount = parseInt(months as string);

    const growthData = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });

      growthData.push({
        month: startDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' }),
        count,
        date: startDate,
      });
    }

    res.json({
      success: true,
      data: growthData,
    });
  } catch (error: any) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار رشد کاربران',
      message: error.message,
    });
  }
};

/**
 * Get system activity log
 */
export const getActivityLog = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    
    // This is a placeholder - you should implement proper activity logging
    // For now, we'll return recent user activities
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email role createdAt');

    const recentApplications = await Application.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('userId', 'firstName lastName email')
      .select('status updatedAt');

    // Mock activity data
    const activities = [
      ...recentUsers.map((user: any) => ({
        id: user._id,
        type: 'user',
        title: 'کاربر جدید ثبت‌نام کرد',
        description: `${user.firstName} ${user.lastName} با ایمیل ${user.email} ثبت‌نام کرد`,
        user: 'سیستم',
        timestamp: user.createdAt,
        status: 'success',
      })),
      ...recentApplications.map((app: any) => ({
        id: app._id,
        type: 'application',
        title: app.status === 'approved' ? 'درخواست تایید شد' : 'درخواست بروزرسانی شد',
        description: `درخواست ${app.userId?.firstName} ${app.userId?.lastName} ${
          app.status === 'approved' ? 'تایید' : 'بروزرسانی'
        } شد`,
        user: 'مدیر سیستم',
        timestamp: app.updatedAt,
        status: app.status === 'approved' ? 'success' : 'info',
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      data: activities.slice(skip, skip + parseInt(limit as string)),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: activities.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لاگ فعالیت‌ها',
      message: error.message,
    });
  }
};
