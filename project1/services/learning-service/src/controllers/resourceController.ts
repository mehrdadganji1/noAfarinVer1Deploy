import { Request, Response } from 'express';
import Resource from '../models/Resource';
import UserProgress from '../models/UserProgress';
import { marked } from 'marked';

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, search } = req.query;
    const userId = req.headers['x-user-id'] as string;

    let query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const resources = await Resource.find(query).sort({ order: 1 }).select('-content');
    
    // Get user progress for each resource
    let resourcesWithProgress: any[] = resources.map(r => r.toObject());
    
    if (userId) {
      const progressData = await UserProgress.find({ 
        userId, 
        resourceId: { $in: resources.map(r => r.id) } 
      });
      
      const progressMap = new Map(progressData.map(p => [p.resourceId, p]));
      
      resourcesWithProgress = resources.map(resource => {
        const progress = progressMap.get(resource.id);
        return {
          ...resource.toObject(),
          userProgress: progress ? {
            status: progress.status,
            progress: progress.progress,
            bookmarked: progress.bookmarked,
            liked: progress.liked
          } : null
        };
      });
    }

    res.json({
      success: true,
      data: resourcesWithProgress,
      total: resourcesWithProgress.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت منابع' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;

    // Try to find by custom id first, then by MongoDB _id
    let resource = await Resource.findOne({ id });
    
    if (!resource) {
      // Try finding by MongoDB _id
      resource = await Resource.findById(id);
    }
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'منبع یافت نشد' });
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    // Convert markdown to HTML
    const htmlContent = marked(resource.content);

    // Get user progress
    let userProgress = null;
    if (userId) {
      userProgress = await UserProgress.findOne({ userId, resourceId: resource.id });
      
      if (!userProgress) {
        userProgress = await UserProgress.create({
          userId,
          resourceId: resource.id,
          status: 'in_progress'
        });
      } else {
        userProgress.lastAccessedAt = new Date();
        await userProgress.save();
      }
    }

    res.json({
      success: true,
      data: {
        ...resource.toObject(),
        htmlContent,
        userProgress: userProgress ? {
          status: userProgress.status,
          progress: userProgress.progress,
          timeSpent: userProgress.timeSpent,
          bookmarked: userProgress.bookmarked,
          liked: userProgress.liked,
          notes: userProgress.notes
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت منبع' });
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;
    const { progress, timeSpent, status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'احراز هویت نشده' });
    }

    let userProgress = await UserProgress.findOne({ userId, resourceId: id });

    if (!userProgress) {
      userProgress = new UserProgress({ userId, resourceId: id });
    }

    if (progress !== undefined) userProgress.progress = progress;
    if (timeSpent !== undefined) userProgress.timeSpent += timeSpent;
    if (status) userProgress.status = status;

    if (status === 'completed' && !userProgress.completedAt) {
      userProgress.completedAt = new Date();
    }

    await userProgress.save();

    res.json({ success: true, data: userProgress });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, message: 'خطا در بروزرسانی پیشرفت' });
  }
};

export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'احراز هویت نشده' });
    }

    let userProgress = await UserProgress.findOne({ userId, resourceId: id });

    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId,
        resourceId: id,
        bookmarked: true
      });
    } else {
      userProgress.bookmarked = !userProgress.bookmarked;
      await userProgress.save();
    }

    // Update resource bookmark count
    const resource = await Resource.findOne({ id });
    if (resource) {
      resource.bookmarks += userProgress.bookmarked ? 1 : -1;
      await resource.save();
    }

    res.json({ success: true, bookmarked: userProgress.bookmarked });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ success: false, message: 'خطا در ذخیره نشانک' });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'احراز هویت نشده' });
    }

    let userProgress = await UserProgress.findOne({ userId, resourceId: id });

    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId,
        resourceId: id,
        liked: true
      });
    } else {
      userProgress.liked = !userProgress.liked;
      await userProgress.save();
    }

    // Update resource like count
    const resource = await Resource.findOne({ id });
    if (resource) {
      resource.likes += userProgress.liked ? 1 : -1;
      await resource.save();
    }

    res.json({ success: true, liked: userProgress.liked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: 'خطا در لایک' });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'احراز هویت نشده' });
    }

    const totalResources = await Resource.countDocuments();
    const userProgress = await UserProgress.find({ userId });
    
    const completed = userProgress.filter(p => p.status === 'completed').length;
    const inProgress = userProgress.filter(p => p.status === 'in_progress').length;
    const totalTimeSpent = userProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const bookmarked = userProgress.filter(p => p.bookmarked).length;

    res.json({
      success: true,
      data: {
        totalResources,
        completed,
        inProgress,
        notStarted: totalResources - completed - inProgress,
        totalTimeSpent,
        bookmarked,
        progressPercentage: Math.round((completed / totalResources) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت آمار' });
  }
};
