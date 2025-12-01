import { Request, Response } from 'express';
import UserXP from '../models/UserXP';
import xpCalculator from '../utils/xpCalculator';

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * دریافت XP کاربر
 */
export const getMyXP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    let userXP = await UserXP.findOne({ userId });

    // اگر رکورد وجود نداشت، ایجاد کن
    if (!userXP) {
      userXP = await UserXP.create({
        userId,
        currentXP: 0,
        totalXP: 0,
        level: 1,
        xpToNextLevel: xpCalculator.calculateXPForLevel(2),
        levelProgress: 0,
        xpMultiplier: 1,
        xpHistory: [],
        levelMilestones: [],
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: userXP.userId,
        currentXP: userXP.currentXP,
        totalXP: userXP.totalXP,
        level: userXP.level,
        xpToNextLevel: userXP.xpToNextLevel,
        levelProgress: userXP.levelProgress,
        xpMultiplier: userXP.xpMultiplier,
        rank: xpCalculator.getRankFromLevel(userXP.level),
      },
    });
  } catch (error: any) {
    console.error('Get my XP error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت XP',
    });
  }
};

/**
 * اضافه کردن XP
 */
export const addXP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { amount, source, sourceId, description } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'مقدار XP نامعتبر است',
      });
      return;
    }

    let userXP = await UserXP.findOne({ userId });

    if (!userXP) {
      userXP = await UserXP.create({
        userId,
        currentXP: 0,
        totalXP: 0,
        level: 1,
        xpToNextLevel: xpCalculator.calculateXPForLevel(2),
        levelProgress: 0,
        xpMultiplier: 1,
        xpHistory: [],
        levelMilestones: [],
      });
    }

    const oldLevel = userXP.level;

    // اعمال ضریب
    const finalXP = xpCalculator.applyMultiplier(amount, userXP.xpMultiplier);

    // اضافه کردن XP
    userXP.currentXP += finalXP;
    userXP.totalXP += finalXP;

    // محاسبه سطح جدید
    const newLevel = xpCalculator.calculateLevelFromXP(userXP.totalXP);
    const leveledUp = xpCalculator.checkLevelUp(oldLevel, newLevel);

    if (leveledUp) {
      userXP.level = newLevel;
      
      // اضافه کردن milestone
      const rewards = xpCalculator.getLevelRewards(newLevel);
      userXP.levelMilestones.push({
        level: newLevel,
        unlockedAt: new Date(),
        rewards,
      });

      // محاسبه XP برای سطح بعدی
      userXP.xpToNextLevel = xpCalculator.calculateXPForLevel(newLevel + 1);
      userXP.currentXP = xpCalculator.calculateCurrentXP(userXP.totalXP, newLevel);
    }

    // محاسبه پیشرفت
    userXP.levelProgress = xpCalculator.calculateLevelProgress(
      userXP.currentXP,
      userXP.xpToNextLevel
    );

    // اضافه کردن به تاریخچه
    userXP.xpHistory.push({
      amount: finalXP,
      source: source || 'manual',
      sourceId,
      description: description || 'دریافت XP',
      multiplier: userXP.xpMultiplier,
      timestamp: new Date(),
    });

    userXP.lastXPGain = new Date();

    await userXP.save();

    res.status(200).json({
      success: true,
      message: leveledUp ? 'تبریک! سطح جدید باز شد!' : 'XP با موفقیت اضافه شد',
      data: {
        xpGained: finalXP,
        currentXP: userXP.currentXP,
        totalXP: userXP.totalXP,
        level: userXP.level,
        leveledUp,
        oldLevel,
        newLevel: userXP.level,
        xpToNextLevel: userXP.xpToNextLevel,
        levelProgress: userXP.levelProgress,
        rewards: leveledUp ? xpCalculator.getLevelRewards(newLevel) : [],
      },
    });
  } catch (error: any) {
    console.error('Add XP error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در اضافه کردن XP',
    });
  }
};

/**
 * دریافت تاریخچه XP
 */
export const getXPHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, source } = req.query;

    const userXP = await UserXP.findOne({ userId });

    if (!userXP) {
      res.status(404).json({
        success: false,
        error: 'رکورد XP یافت نشد',
      });
      return;
    }

    let history = userXP.xpHistory;

    // فیلتر بر اساس منبع
    if (source) {
      history = history.filter((h) => h.source === source);
    }

    // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedHistory = history.slice(skip, skip + Number(limit));

    res.status(200).json({
      success: true,
      data: {
        history: paginatedHistory,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: history.length,
          totalPages: Math.ceil(history.length / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get XP history error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت تاریخچه XP',
    });
  }
};

/**
 * دریافت Leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const leaderboard = await UserXP.find()
      .sort({ totalXP: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('userId level totalXP currentXP');

    const total = await UserXP.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        leaderboard: leaderboard.map((entry, index) => ({
          rank: skip + index + 1,
          userId: entry.userId,
          level: entry.level,
          totalXP: entry.totalXP,
          rank_title: xpCalculator.getRankFromLevel(entry.level),
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت Leaderboard',
    });
  }
};

/**
 * دریافت اطلاعات یک سطح
 */
export const getLevelInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { level } = req.params;
    const levelNum = parseInt(level);

    if (isNaN(levelNum) || levelNum < 1) {
      res.status(400).json({
        success: false,
        error: 'سطح نامعتبر است',
      });
      return;
    }

    const xpRequired = xpCalculator.calculateXPForLevel(levelNum);
    const totalXPRequired = xpCalculator.calculateTotalXPForLevel(levelNum);
    const rewards = xpCalculator.getLevelRewards(levelNum);
    const rankTitle = xpCalculator.getRankFromLevel(levelNum);

    res.status(200).json({
      success: true,
      data: {
        level: levelNum,
        xpRequired,
        totalXPRequired,
        rewards,
        rankTitle,
      },
    });
  } catch (error: any) {
    console.error('Get level info error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت اطلاعات سطح',
    });
  }
};

/**
 * محاسبه XP بر اساس منبع
 */
export const calculateXP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { source, data } = req.body;

    if (!source) {
      res.status(400).json({
        success: false,
        error: 'منبع XP مشخص نشده است',
      });
      return;
    }

    const xpAmount = xpCalculator.calculateXPGain(source, data);

    res.status(200).json({
      success: true,
      data: {
        source,
        xpAmount,
      },
    });
  } catch (error: any) {
    console.error('Calculate XP error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در محاسبه XP',
    });
  }
};

/**
 * دریافت رتبه کاربر
 */
export const getMyRank = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const userXP = await UserXP.findOne({ userId });

    if (!userXP) {
      res.status(404).json({
        success: false,
        error: 'رکورد XP یافت نشد',
      });
      return;
    }

    // محاسبه رتبه
    const rank = await UserXP.countDocuments({ totalXP: { $gt: userXP.totalXP } }) + 1;
    const total = await UserXP.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        rank,
        total,
        percentile: ((total - rank) / total) * 100,
        level: userXP.level,
        totalXP: userXP.totalXP,
        rankTitle: xpCalculator.getRankFromLevel(userXP.level),
      },
    });
  } catch (error: any) {
    console.error('Get my rank error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت رتبه',
    });
  }
};
