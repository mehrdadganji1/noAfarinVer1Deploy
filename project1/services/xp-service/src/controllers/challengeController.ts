import { Request, Response } from 'express';
import Challenge, { ChallengeType } from '../models/Challenge';
import UserChallenge from '../models/UserChallenge';
import UserXP from '../models/UserXP';
import { AuthRequest } from '../middleware/auth';

/**
 * Get active challenges
 * GET /api/challenges
 */
export const getActiveChallenges = async (req: Request, res: Response) => {
  try {
    const { type = 'daily' } = req.query;
    const now = new Date();

    const challenges = await Challenge.find({
      type,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ difficulty: 1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        challenges,
        count: challenges.length,
      },
    });
  } catch (error: any) {
    console.error('Error getting challenges:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت چالش‌ها',
    });
  }
};

/**
 * Get user's challenge progress
 * GET /api/challenges/my-progress
 */
export const getMyProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type = 'daily' } = req.query;
    const now = new Date();

    // Get active challenges
    const activeChallenges = await Challenge.find({
      type,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    // Get user's progress for these challenges
    const challengeIds = activeChallenges.map((c) => c._id);
    const userProgress = await UserChallenge.find({
      userId,
      challengeId: { $in: challengeIds },
    }).lean();

    // Combine data
    const progressMap = new Map(
      userProgress.map((up) => [up.challengeId.toString(), up])
    );

    const challengesWithProgress = activeChallenges.map((challenge) => {
      const progress = progressMap.get(challenge._id.toString());
      return {
        ...challenge,
        userProgress: progress
          ? {
              progress: progress.progress,
              targetCount: progress.targetCount,
              completed: progress.completed,
              completedAt: progress.completedAt,
              claimedReward: progress.claimedReward,
              percentage: Math.min(
                100,
                Math.round((progress.progress / progress.targetCount) * 100)
              ),
            }
          : {
              progress: 0,
              targetCount: challenge.requirements.count,
              completed: false,
              completedAt: null,
              claimedReward: false,
              percentage: 0,
            },
      };
    });

    res.json({
      success: true,
      data: {
        challenges: challengesWithProgress,
        stats: {
          total: challengesWithProgress.length,
          completed: challengesWithProgress.filter((c) => c.userProgress.completed).length,
          inProgress: challengesWithProgress.filter(
            (c) => c.userProgress.progress > 0 && !c.userProgress.completed
          ).length,
        },
      },
    });
  } catch (error: any) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت پیشرفت',
    });
  }
};

/**
 * Update challenge progress (internal webhook)
 * POST /api/challenges/progress
 */
export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { userId, action, count = 1, metadata } = req.body;

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'userId و action الزامی هستند',
      });
    }

    const now = new Date();

    // Find active challenges matching this action
    const matchingChallenges = await Challenge.find({
      'requirements.action': action,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (matchingChallenges.length === 0) {
      return res.json({
        success: true,
        message: 'هیچ چالش فعالی برای این action وجود ندارد',
        updated: 0,
      });
    }

    const updates = [];

    for (const challenge of matchingChallenges) {
      // Get or create user challenge
      let userChallenge = await UserChallenge.findOne({
        userId,
        challengeId: challenge._id,
      });

      if (!userChallenge) {
        userChallenge = await UserChallenge.create({
          userId,
          challengeId: challenge._id,
          progress: 0,
          targetCount: challenge.requirements.count,
          completed: false,
          claimedReward: false,
          startedAt: now,
        });
      }

      // Skip if already completed
      if (userChallenge.completed) {
        continue;
      }

      // Update progress
      userChallenge.progress += count;

      // Check if completed
      if (userChallenge.progress >= userChallenge.targetCount) {
        userChallenge.progress = userChallenge.targetCount;
        userChallenge.completed = true;
        userChallenge.completedAt = now;

        // Increment challenge completion count
        challenge.currentCompletions += 1;
        await challenge.save();
      }

      await userChallenge.save();

      updates.push({
        challengeId: challenge._id,
        title: challenge.title,
        progress: userChallenge.progress,
        targetCount: userChallenge.targetCount,
        completed: userChallenge.completed,
      });
    }

    res.json({
      success: true,
      message: 'پیشرفت به‌روز شد',
      data: {
        updated: updates.length,
        challenges: updates,
      },
    });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی پیشرفت',
    });
  }
};

/**
 * Claim challenge reward
 * POST /api/challenges/:id/claim
 */
export const claimReward = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: challengeId } = req.params;

    // Get challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'چالش یافت نشد',
      });
    }

    // Get user challenge
    const userChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        error: 'شما این چالش را شروع نکرده‌اید',
      });
    }

    if (!userChallenge.completed) {
      return res.status(400).json({
        success: false,
        error: 'چالش هنوز تکمیل نشده است',
      });
    }

    if (userChallenge.claimedReward) {
      return res.status(400).json({
        success: false,
        error: 'جایزه قبلاً دریافت شده است',
      });
    }

    // Award XP
    const userXP = await UserXP.findOne({ userId });
    if (!userXP) {
      return res.status(404).json({
        success: false,
        error: 'رکورد XP کاربر یافت نشد',
      });
    }

    const oldLevel = userXP.level;
    userXP.totalXP += challenge.rewards.xp;
    userXP.currentXP += challenge.rewards.xp;

    // Check for level up
    while (userXP.currentXP >= userXP.xpToNextLevel) {
      userXP.currentXP -= userXP.xpToNextLevel;
      userXP.level += 1;
      userXP.xpToNextLevel = Math.floor(userXP.xpToNextLevel * 1.5);
    }

    // Add to history
    userXP.xpHistory.push({
      amount: challenge.rewards.xp,
      source: 'challenge_complete',
      description: `تکمیل چالش: ${challenge.title}`,
      multiplier: 1,
      timestamp: new Date(),
    });

    await userXP.save();

    // Mark as claimed
    userChallenge.claimedReward = true;
    userChallenge.claimedAt = new Date();
    await userChallenge.save();

    const leveledUp = userXP.level > oldLevel;

    res.json({
      success: true,
      message: 'جایزه با موفقیت دریافت شد',
      data: {
        xp: {
          awarded: challenge.rewards.xp,
          total: userXP.totalXP,
          level: userXP.level,
          leveledUp,
        },
        rewards: challenge.rewards,
      },
    });
  } catch (error: any) {
    console.error('Error claiming reward:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت جایزه',
    });
  }
};

/**
 * Get challenge statistics
 * GET /api/challenges/stats
 */
export const getChallengeStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const totalActive = await Challenge.countDocuments({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const totalCompleted = await UserChallenge.countDocuments({
      completed: true,
    });

    const totalInProgress = await UserChallenge.countDocuments({
      completed: false,
      progress: { $gt: 0 },
    });

    // Completion rate by difficulty
    const completionByDifficulty = await Challenge.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          completions: { $sum: '$currentCompletions' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalActive,
        totalCompleted,
        totalInProgress,
        completionByDifficulty,
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

/**
 * Create challenge (Admin only)
 * POST /api/challenges
 */
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const challengeData = req.body;

    const challenge = await Challenge.create(challengeData);

    res.status(201).json({
      success: true,
      message: 'چالش با موفقیت ایجاد شد',
      data: challenge,
    });
  } catch (error: any) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد چالش',
    });
  }
};
