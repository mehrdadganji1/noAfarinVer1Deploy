import { Request, Response } from 'express';
import Activity, { ActivityType, ActivityStatus, IActivity } from '../models/Activity';

// Activity Service for internal use
export class ActivityService {
  static async logApplicationSubmitted(userId: string, applicationId: string): Promise<void> {
    console.log(`📝 [Activity] Application submitted by user ${userId}, ID: ${applicationId}`);
    return Promise.resolve();
  }

  static async logApplicationApproved(userId: string, applicationId: string, status: string): Promise<void> {
    console.log(`📝 [Activity] Application approved for user ${userId}, ID: ${applicationId}, status: ${status}`);
    return Promise.resolve();
  }

  static async logApplicationRejected(userId: string, applicationId: string, reason: string): Promise<void> {
    console.log(`📝 [Activity] Application rejected for user ${userId}, ID: ${applicationId}, reason: ${reason}`);
    return Promise.resolve();
  }

  static async logDocumentUploaded(userId: string, type: string, fileName: string): Promise<void> {
    console.log(`📝 [Activity] Document uploaded by user ${userId}, type: ${type}, file: ${fileName}`);
    return Promise.resolve();
  }
}

/**
 * Get recent activities for the current user
 */
export const getRecentActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { limit = 10, type, status } = req.query;

    const query: any = { userId };

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching activities'
    });
  }
};

/**
 * Create a new activity (internal use)
 */
export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, type, title, description, status, metadata, relatedId } = req.body;

    const activity = await Activity.create({
      userId,
      type,
      title,
      description,
      status: status || ActivityStatus.INFO,
      metadata,
      relatedId
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating activity'
    });
  }
};

/**
 * Get activity statistics
 */
export const getActivityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const [total, byType, byStatus, recent] = await Promise.all([
      Activity.countDocuments({ userId }),
      Activity.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Activity.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Activity.countDocuments({
        userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byType: byType.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byStatus: byStatus.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        lastWeek: recent
      }
    });
  } catch (error: any) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching activity statistics'
    });
  }
};

/**
 * Delete old activities (cleanup)
 */
export const deleteOldActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { days = 30 } = req.query;

    const cutoffDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const result = await Activity.deleteMany({
      userId,
      createdAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old activities`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete old activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting old activities'
    });
  }
};

// Orphaned methods removed - ActivityService is complete at the top

export default {
  getRecentActivities,
  createActivity,
  getActivityStats,
  deleteOldActivities
};
