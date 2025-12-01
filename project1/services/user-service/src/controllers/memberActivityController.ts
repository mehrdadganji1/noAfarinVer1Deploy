import { Request, Response } from 'express';
import MemberActivity from '../models/MemberActivity';
import Connection from '../models/Connection';
import { z } from 'zod';
import socketManager from '../socket/socketManager';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const createActivitySchema = z.object({
  type: z.enum([
    'project_completed',
    'achievement_earned',
    'event_attended',
    'course_completed',
    'skill_added',
    'connection_made',
    'profile_updated',
    'post_created'
  ]),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  content: z.string().max(5000).optional(),
  images: z.array(z.string().url()).optional(),
  metadata: z.record(z.any()).optional(),
  visibility: z.enum(['public', 'connections', 'private']).optional()
});

const updateActivitySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  content: z.string().max(5000).optional(),
  images: z.array(z.string().url()).optional(),
  visibility: z.enum(['public', 'connections', 'private']).optional()
});

// =====================================================
// ACTIVITY FEED
// =====================================================

/**
 * @route   GET /api/community/activities
 * @desc    Get activity feed (from connections)
 * @access  Private
 */
export const getActivityFeed = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, type, visibility = 'all' } = req.query;

    // Get user's connections
    const following = await Connection.find({
      followerId: userId,
      status: 'active'
    }).select('followingId');

    const connectionIds = following.map(f => f.followingId);

    // Build query
    let query: any = {};

    if (visibility === 'all') {
      query = {
        $or: [
          // Activities from connections
          { 
            userId: { $in: connectionIds }, 
            visibility: { $in: ['public', 'connections'] } 
          },
          // My own activities (all visibility levels)
          { userId }
        ]
      };
    } else if (visibility === 'public') {
      query = { visibility: 'public' };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const activities = await (MemberActivity as any).getUserFeed(
      userId,
      connectionIds,
      Number(page),
      Number(limit)
    );

    const total = await MemberActivity.countDocuments(query);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فید',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/activities/public
 * @desc    Get public activities (explore page)
 * @access  Private
 */
export const getPublicActivities = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const query: any = { visibility: 'public' };
    if (type) {
      query.type = type;
    }

    const activities = await (MemberActivity as any).getPublicActivities(
      Number(page),
      Number(limit)
    );

    const total = await MemberActivity.countDocuments(query);

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get public activities error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فعالیت‌های عمومی',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/activities/:userId
 * @desc    Get user's activities
 * @access  Private
 */
export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    const activities = await (MemberActivity as any).getUserActivities(
      userId,
      viewerId,
      Number(page),
      Number(limit)
    );

    const total = await MemberActivity.countDocuments({
      userId,
      visibility: viewerId === userId ? undefined : { $in: ['public', 'connections'] }
    });

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get user activities error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فعالیت‌ها',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/activities/trending
 * @desc    Get trending activities
 * @access  Private
 */
export const getTrendingActivities = async (req: Request, res: Response) => {
  try {
    const { days = 7, limit = 10 } = req.query;

    const activities = await (MemberActivity as any).getTrendingActivities(
      Number(days),
      Number(limit)
    );

    // Populate user details
    await (MemberActivity as any).populate(activities, {
      path: 'userId',
      select: 'firstName lastName avatar membershipInfo'
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error: any) {
    console.error('Get trending activities error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فعالیت‌های پرطرفدار',
      error: error.message
    });
  }
};

// =====================================================
// ACTIVITY MANAGEMENT
// =====================================================

/**
 * @route   POST /api/community/activities
 * @desc    Create new activity
 * @access  Private
 */
export const createActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const validatedData = createActivitySchema.parse(req.body);

    const activity = await MemberActivity.create({
      userId,
      ...validatedData,
      visibility: validatedData.visibility || 'connections'
    });

    const populatedActivity = await MemberActivity.findById(activity._id)
      .populate('userId', 'firstName lastName avatar membershipInfo');

    // Emit socket event to all connected users
    socketManager.emitActivity('activity:new', populatedActivity);

    res.status(201).json({
      success: true,
      message: 'فعالیت ایجاد شد',
      data: populatedActivity
    });
  } catch (error: any) {
    console.error('Create activity error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد فعالیت',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/activities/:activityId
 * @desc    Update activity
 * @access  Private
 */
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { activityId } = req.params;

    const activity = await MemberActivity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'فعالیت یافت نشد'
      });
    }

    // فقط صاحب فعالیت می‌تونه ویرایش کنه
    if (!activity.userId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این فعالیت ندارید'
      });
    }

    const validatedData = updateActivitySchema.parse(req.body);

    Object.assign(activity, validatedData);
    await activity.save();

    const populatedActivity = await MemberActivity.findById(activity._id)
      .populate('userId', 'firstName lastName avatar membershipInfo');

    res.json({
      success: true,
      message: 'فعالیت به‌روزرسانی شد',
      data: populatedActivity
    });
  } catch (error: any) {
    console.error('Update activity error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی فعالیت',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/community/activities/:activityId
 * @desc    Delete activity
 * @access  Private
 */
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { activityId } = req.params;

    const activity = await MemberActivity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'فعالیت یافت نشد'
      });
    }

    // فقط صاحب فعالیت می‌تونه حذف کنه
    if (!activity.userId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'شما دسترسی به این فعالیت ندارید'
      });
    }

    await activity.deleteOne();

    res.json({
      success: true,
      message: 'فعالیت حذف شد'
    });
  } catch (error: any) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف فعالیت',
      error: error.message
    });
  }
};

// =====================================================
// REACTIONS & COMMENTS
// =====================================================

/**
 * @route   POST /api/community/activities/:activityId/react
 * @desc    React to activity
 * @access  Private
 */
export const reactToActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { activityId } = req.params;
    const { type } = req.body;

    if (!['like', 'celebrate', 'support', 'love'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'نوع واکنش نامعتبر است'
      });
    }

    const activity = await MemberActivity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'فعالیت یافت نشد'
      });
    }

    // Check if already reacted
    const hasReacted = (activity as any).hasUserReacted(userId);

    if (hasReacted) {
      // Remove reaction
      await (activity as any).removeReaction(userId);
      
      // Emit socket event
      socketManager.emitActivity('activity:reaction', {
        activityId,
        action: 'removed',
        userId
      });

      return res.json({
        success: true,
        message: 'واکنش حذف شد',
        action: 'removed'
      });
    } else {
      // Add reaction
      await (activity as any).addReaction(userId, type);
      
      // Emit socket event
      socketManager.emitActivity('activity:reaction', {
        activityId,
        action: 'added',
        userId,
        type
      });

      return res.json({
        success: true,
        message: 'واکنش ثبت شد',
        action: 'added'
      });
    }
  } catch (error: any) {
    console.error('React to activity error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت واکنش',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/activities/:activityId/comment
 * @desc    Add comment to activity
 * @access  Private
 */
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { activityId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'محتوای کامنت الزامی است'
      });
    }

    const activity = await MemberActivity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'فعالیت یافت نشد'
      });
    }

    await (activity as any).addComment(userId, content);

    const populatedActivity = await MemberActivity.findById(activity._id)
      .populate('comments.userId', 'firstName lastName avatar');

    const newComment = populatedActivity?.comments[populatedActivity.comments.length - 1];

    // Emit socket event
    socketManager.emitActivity('activity:comment', {
      activityId,
      comment: newComment
    });

    res.status(201).json({
      success: true,
      message: 'کامنت اضافه شد',
      data: populatedActivity?.comments || []
    });
  } catch (error: any) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در افزودن کامنت',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/community/activities/:activityId/comment/:commentId
 * @desc    Delete comment
 * @access  Private
 */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { activityId, commentId } = req.params;

    const activity = await MemberActivity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'فعالیت یافت نشد'
      });
    }

    await (activity as any).deleteComment(commentId, userId);

    res.json({
      success: true,
      message: 'کامنت حذف شد'
    });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف کامنت',
      error: error.message
    });
  }
};

export default {
  getActivityFeed,
  getPublicActivities,
  getUserActivities,
  getTrendingActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  reactToActivity,
  addComment,
  deleteComment
};
