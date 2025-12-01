import { Response } from 'express';
import Achievement from '../models/Achievement';
import { AuthRequest } from '../middleware/auth';

export const getAllAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query: any = { isActive: true };
    
    if (category) query.category = category;

    const achievements = await Achievement.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ points: -1 })
      .populate('createdBy', 'firstName lastName');

    const total = await Achievement.countDocuments(query);

    res.json({
      success: true,
      data: {
        achievements,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ success: false, error: 'Error fetching achievements' });
  }
};

export const getAchievementById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('earnedBy.user', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
      
    if (!achievement) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }
    
    res.json({ success: true, data: achievement });
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({ success: false, error: 'Error fetching achievement' });
  }
};

export const createAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only admin can create achievements
    if (!req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const achievementData = {
      ...req.body,
      createdBy: req.user!.id,
    };

    const achievement = await Achievement.create(achievementData);
    
    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ success: false, error: 'Error creating achievement' });
  }
};

export const updateAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }

    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({ success: false, error: 'Error updating achievement' });
  }
};

export const awardAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      res.status(404).json({ success: false, error: 'Achievement not found' });
      return;
    }

    // Check if user already has this achievement
    const alreadyEarned = achievement.earnedBy.some(
      (entry: any) => entry.user.toString() === userId
    );
    
    if (alreadyEarned) {
      res.status(400).json({ success: false, error: 'Achievement already earned' });
      return;
    }

    achievement.earnedBy.push({
      user: userId,
      earnedAt: new Date(),
    } as any);
    
    await achievement.save();
    
    res.json({ success: true, message: 'Achievement awarded', data: achievement });
  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({ success: false, error: 'Error awarding achievement' });
  }
};

export const getUserAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user!.id;
    
    const achievements = await Achievement.find({
      'earnedBy.user': userId,
      isActive: true,
    }).populate('createdBy', 'firstName lastName');

    const totalPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);
    
    res.json({
      success: true,
      data: {
        achievements,
        totalAchievements: achievements.length,
        totalPoints,
      },
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ success: false, error: 'Error fetching user achievements' });
  }
};

export const getAchievementStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalAchievements = await Achievement.countDocuments({ isActive: true });
    
    const categories = Object.values(['technical', 'academic', 'leadership', 'participation', 'community', 'special']);
    const categoryStats: any = {};
    
    for (const category of categories) {
      categoryStats[category] = await Achievement.countDocuments({ category, isActive: true });
    }
    
    // Get user's achievements (only if authenticated)
    let userAchievements = 0;
    let userPointsTotal = 0;
    
    if (req.user?.id) {
      userAchievements = await Achievement.countDocuments({
        'earnedBy.user': req.user.id,
        isActive: true,
      });
      
      const userPoints = await Achievement.aggregate([
        { $match: { 'earnedBy.user': req.user.id, isActive: true } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ]);
      
      userPointsTotal = userPoints[0]?.total || 0;
    }

    res.json({
      success: true,
      data: {
        total: totalAchievements,
        ...categoryStats,
        userAchievements,
        userPoints: userPointsTotal,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Error fetching achievement stats' });
  }
};
