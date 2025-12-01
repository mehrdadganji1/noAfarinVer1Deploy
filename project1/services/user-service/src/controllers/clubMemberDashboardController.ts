import { Request, Response } from 'express';
import User from '../models/User';

/**
 * Get comprehensive dashboard stats for club member
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    // Check if user is club member (support both ClubMember and club_member)
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const hasClubMemberRole = userRoles.some(r => {
      const roleStr = r.toString().toLowerCase();
      return roleStr === 'clubmember' || roleStr === 'club_member';
    });
    
    if (!hasClubMemberRole) {
      console.log('❌ Access denied. User roles:', userRoles);
      return res.status(403).json({
        success: false,
        message: 'دسترسی محدود به اعضای باشگاه',
      });
    }
    
    console.log('✅ Club member access granted. User roles:', userRoles);

    // Get membership info
    const membershipInfo = user.membershipInfo;
    const memberStats = user.memberStats;

    // Calculate stats
    const stats = {
      overview: {
        totalXP: memberStats?.totalPoints || 0,
        level: membershipInfo?.membershipLevel || 'bronze',
        rank: memberStats?.rank || null,
        points: membershipInfo?.points || 0,
        memberSince: membershipInfo?.memberSince || user.createdAt,
      },
      activities: {
        eventsAttended: memberStats?.eventsAttended || 0,
        projectsCompleted: memberStats?.projectsCompleted || 0,
        coursesCompleted: memberStats?.coursesCompleted || 0,
        achievementsEarned: memberStats?.achievementsEarned || 0,
      },
      progress: {
        weeklyXP: 0, // TODO: Calculate from XP history
        monthlyXP: 0, // TODO: Calculate from XP history
        streak: 0, // TODO: Calculate login streak
        nextLevelXP: calculateNextLevelXP(membershipInfo?.membershipLevel || 'bronze'),
      },
      quickStats: {
        upcomingEvents: 0, // TODO: Get from event service
        activeProjects: 0, // TODO: Get from project service
        pendingTasks: 0, // TODO: Get from task service
        newNotifications: 0, // TODO: Get from notification service
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار داشبورد',
      error: error.message,
    });
  }
};

/**
 * Get activity timeline for club member
 */
export const getActivityTimeline = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { limit = 10, page = 1 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    // TODO: Implement activity tracking system
    // For now, return mock data
    const activities = [
      {
        id: '1',
        type: 'event',
        title: 'شرکت در وبینار React',
        description: 'در وبینار آموزش React شرکت کردید',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: 'calendar',
        points: 50,
        category: 'learning',
      },
      {
        id: '2',
        type: 'achievement',
        title: 'دستاورد جدید',
        description: 'دستاورد "شرکت‌کننده فعال" را کسب کردید',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        icon: 'trophy',
        points: 100,
        category: 'achievement',
      },
      {
        id: '3',
        type: 'project',
        title: 'پروژه جدید',
        description: 'به پروژه "سیستم مدیریت" پیوستید',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        icon: 'folder',
        points: 0,
        category: 'project',
      },
    ];

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: activities.length,
          totalPages: 1,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching activity timeline:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تایم‌لاین فعالیت',
      error: error.message,
    });
  }
};

/**
 * Get quick stats for dashboard
 */
export const getQuickStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    // TODO: Fetch real data from services
    const quickStats = {
      upcomingEvents: 3,
      activeProjects: 2,
      pendingTasks: 5,
      newNotifications: 7,
      todayXP: 150,
      weekStreak: 5,
    };

    res.json({
      success: true,
      data: quickStats,
    });
  } catch (error: any) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار سریع',
      error: error.message,
    });
  }
};

// Helper function to calculate next level XP requirement
function calculateNextLevelXP(currentLevel: string): number {
  const levelXP: Record<string, number> = {
    bronze: 1000,
    silver: 2500,
    gold: 5000,
    platinum: 10000,
    diamond: 20000,
  };

  return levelXP[currentLevel] || 1000;
}

