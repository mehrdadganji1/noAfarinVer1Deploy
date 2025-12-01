import { Request, Response } from 'express';
import Achievement from '../models/Achievement';
import UserAchievement from '../models/UserAchievement';

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const { category, type } = req.query;
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (type) filter.type = type;

    const achievements = await Achievement.find(filter).sort({ points: -1 });

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دستاورد‌ها',
      error: error.message,
    });
  }
};

export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'دستاورد یافت نشد',
      });
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دستاورد',
      error: error.message,
    });
  }
};

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    const userAchievements = await UserAchievement.find({ userId })
      .populate('achievementId')
      .sort({ unlockedAt: -1 });

    const totalPoints = userAchievements
      .filter((ua: any) => ua.isCompleted)
      .reduce((sum: number, ua: any) => sum + (ua.achievementId?.points || 0), 0);

    const completedCount = userAchievements.filter(
      (ua: any) => ua.isCompleted
    ).length;

    res.json({
      success: true,
      data: {
        achievements: userAchievements,
        stats: {
          totalPoints,
          completedCount,
          totalCount: userAchievements.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دستاورد‌های کاربر',
      error: error.message,
    });
  }
};

export const checkAndUnlockAchievement = async (
  req: Request,
  res: Response
) => {
  try {
    const { achievementId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      });
    }

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'دستاورد یافت نشد',
      });
    }

    let userAchievement = await UserAchievement.findOne({
      userId,
      achievementId,
    });

    if (!userAchievement) {
      userAchievement = new UserAchievement({
        userId,
        achievementId,
        progress: 0,
        isCompleted: false,
      });
    }

    if (userAchievement.isCompleted) {
      return res.json({
        success: true,
        message: 'این دستاورد قبلاً باز شده است',
        data: userAchievement,
      });
    }

    // Check if requirement is met (this should be customized based on requirement type)
    const { progress } = req.body;
    userAchievement.progress = progress;

    if (progress >= 100) {
      userAchievement.isCompleted = true;
      userAchievement.unlockedAt = new Date();
    }

    await userAchievement.save();

    res.json({
      success: true,
      message: userAchievement.isCompleted
        ? 'دستاورد با موفقیت باز شد!'
        : 'پیشرفت ثبت شد',
      data: userAchievement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'خطا در باز کردن دستاورد',
      error: error.message,
    });
  }
};

export const createAchievement = async (req: Request, res: Response) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'دستاورد با موفقیت ایجاد شد',
      data: achievement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد دستاورد',
      error: error.message,
    });
  }
};
