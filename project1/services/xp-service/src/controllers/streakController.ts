import { Request, Response } from 'express';
import UserStreak from '../models/UserStreak';
import UserXP from '../models/UserXP';
import { AuthRequest } from '../middleware/auth';

// Helper: Check if two dates are on the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper: Check if two dates are consecutive days
const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return diff >= oneDayMs && diff < 2 * oneDayMs;
};

// Streak milestones and their XP rewards
const STREAK_MILESTONES = [
  { days: 3, xp: 50, name: '3 روز متوالی' },
  { days: 7, xp: 100, name: '1 هفته متوالی' },
  { days: 14, xp: 200, name: '2 هفته متوالی' },
  { days: 30, xp: 500, name: '1 ماه متوالی' },
  { days: 60, xp: 1000, name: '2 ماه متوالی' },
  { days: 100, xp: 2000, name: '100 روز متوالی' },
  { days: 365, xp: 10000, name: '1 سال متوالی' },
];

/**
 * Get user's current streak
 * GET /api/streaks/my-streak
 */
export const getMyStreak = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    let streak = await UserStreak.findOne({ userId });

    if (!streak) {
      // Create new streak record
      streak = await UserStreak.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        totalCheckIns: 0,
        streakHistory: [],
        milestones: [],
      });
    }

    // Check if streak is broken (more than 1 day since last check-in)
    if (streak.lastCheckIn) {
      const now = new Date();
      const daysSinceLastCheckIn = Math.floor(
        (now.getTime() - streak.lastCheckIn.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysSinceLastCheckIn > 1) {
        // Streak is broken
        streak.currentStreak = 0;
        await streak.save();
      }
    }

    // Calculate next milestone
    const nextMilestone = STREAK_MILESTONES.find(
      (m) => m.days > streak!.currentStreak
    );

    res.json({
      success: true,
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCheckIn: streak.lastCheckIn,
        totalCheckIns: streak.totalCheckIns,
        canCheckInToday: !streak.lastCheckIn || !isSameDay(streak.lastCheckIn, new Date()),
        nextMilestone: nextMilestone || null,
        milestones: streak.milestones,
      },
    });
  } catch (error: any) {
    console.error('Error getting streak:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت استریک',
    });
  }
};

/**
 * Check in for today (maintain streak)
 * POST /api/streaks/check-in
 */
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const now = new Date();

    let streak = await UserStreak.findOne({ userId });

    if (!streak) {
      streak = await UserStreak.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        totalCheckIns: 0,
        streakHistory: [],
        milestones: [],
      });
    }

    // Check if already checked in today
    if (streak.lastCheckIn && isSameDay(streak.lastCheckIn, now)) {
      return res.status(400).json({
        success: false,
        error: 'شما امروز قبلاً حضور ثبت کرده‌اید',
      });
    }

    let streakMaintained = false;
    let streakBroken = false;
    let xpAwarded = 20; // Base XP for daily check-in
    const milestonesAchieved: typeof STREAK_MILESTONES = [];

    // Check if streak continues
    if (streak.lastCheckIn) {
      if (isConsecutiveDay(streak.lastCheckIn, now)) {
        // Streak continues
        streak.currentStreak += 1;
        streakMaintained = true;

        // Bonus XP for longer streaks
        if (streak.currentStreak >= 7) xpAwarded += 10;
        if (streak.currentStreak >= 30) xpAwarded += 20;
        if (streak.currentStreak >= 100) xpAwarded += 50;
      } else {
        // Streak broken
        streak.currentStreak = 1;
        streakBroken = true;
      }
    } else {
      // First check-in
      streak.currentStreak = 1;
    }

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // Check for milestone achievements
    for (const milestone of STREAK_MILESTONES) {
      if (
        streak.currentStreak === milestone.days &&
        !streak.milestones.some((m) => m.days === milestone.days)
      ) {
        streak.milestones.push({
          days: milestone.days,
          achievedAt: now,
        });
        milestonesAchieved.push(milestone);
        xpAwarded += milestone.xp;
      }
    }

    // Update streak record
    streak.lastCheckIn = now;
    streak.totalCheckIns += 1;
    streak.streakHistory.push({
      date: now,
      maintained: streakMaintained,
    });

    // Keep only last 365 days of history
    if (streak.streakHistory.length > 365) {
      streak.streakHistory = streak.streakHistory.slice(-365);
    }

    await streak.save();

    // Award XP
    const userXP = await UserXP.findOne({ userId });
    if (userXP) {
      const oldLevel = userXP.level;
      userXP.totalXP += xpAwarded;
      userXP.currentXP += xpAwarded;

      // Check for level up
      while (userXP.currentXP >= userXP.xpToNextLevel) {
        userXP.currentXP -= userXP.xpToNextLevel;
        userXP.level += 1;
        userXP.xpToNextLevel = Math.floor(userXP.xpToNextLevel * 1.5);
      }

      // Add to history
      userXP.xpHistory.push({
        amount: xpAwarded,
        source: 'daily_checkin',
        description: `حضور روزانه - استریک ${streak.currentStreak} روزه`,
        multiplier: 1,
        timestamp: now,
      });

      await userXP.save();

      const leveledUp = userXP.level > oldLevel;

      res.json({
        success: true,
        message: 'حضور با موفقیت ثبت شد',
        data: {
          streak: {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            totalCheckIns: streak.totalCheckIns,
          },
          xp: {
            awarded: xpAwarded,
            total: userXP.totalXP,
            level: userXP.level,
            leveledUp,
          },
          streakMaintained,
          streakBroken,
          milestonesAchieved: milestonesAchieved.map((m) => ({
            days: m.days,
            name: m.name,
            xp: m.xp,
          })),
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'رکورد XP کاربر یافت نشد',
      });
    }
  } catch (error: any) {
    console.error('Error checking in:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت حضور',
    });
  }
};

/**
 * Get streak leaderboard
 * GET /api/streaks/leaderboard
 */
export const getStreakLeaderboard = async (req: Request, res: Response) => {
  try {
    const { type = 'current', limit = 100 } = req.query;

    const sortField = type === 'longest' ? 'longestStreak' : 'currentStreak';

    const leaderboard = await UserStreak.find()
      .sort({ [sortField]: -1 })
      .limit(Number(limit))
      .populate('userId', 'firstName lastName avatar')
      .lean();

    res.json({
      success: true,
      data: {
        type,
        leaderboard: leaderboard.map((entry, index) => ({
          rank: index + 1,
          user: entry.userId,
          streak: type === 'longest' ? entry.longestStreak : entry.currentStreak,
          totalCheckIns: entry.totalCheckIns,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیدربورد',
    });
  }
};

/**
 * Get streak history (calendar view)
 * GET /api/streaks/history
 */
export const getStreakHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { days = 30 } = req.query;

    const streak = await UserStreak.findOne({ userId });

    if (!streak) {
      return res.json({
        success: true,
        data: {
          history: [],
        },
      });
    }

    // Get last N days of history
    const history = streak.streakHistory.slice(-Number(days));

    res.json({
      success: true,
      data: {
        history: history.map((h) => ({
          date: h.date,
          maintained: h.maintained,
        })),
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      },
    });
  } catch (error: any) {
    console.error('Error getting history:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت تاریخچه',
    });
  }
};

/**
 * Get streak statistics
 * GET /api/streaks/stats
 */
export const getStreakStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await UserStreak.countDocuments();
    const activeStreaks = await UserStreak.countDocuments({
      currentStreak: { $gt: 0 },
    });

    const avgStreak = await UserStreak.aggregate([
      {
        $group: {
          _id: null,
          avgCurrent: { $avg: '$currentStreak' },
          avgLongest: { $avg: '$longestStreak' },
          maxCurrent: { $max: '$currentStreak' },
          maxLongest: { $max: '$longestStreak' },
        },
      },
    ]);

    // Streak distribution
    const distribution = await UserStreak.aggregate([
      {
        $bucket: {
          groupBy: '$currentStreak',
          boundaries: [0, 3, 7, 14, 30, 60, 100, 365, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeStreaks,
        averages: avgStreak[0] || {},
        distribution,
      },
    });
  } catch (error: any) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار',
    });
  }
};
