import { Request, Response } from 'express';
import MemberProfile from '../models/MemberProfile';
import Connection from '../models/Connection';
import MemberActivity from '../models/MemberActivity';
import User from '../models/User';

// =====================================================
// COMMUNITY STATISTICS
// =====================================================

/**
 * @route   GET /api/community/stats
 * @desc    Get overall community statistics
 * @access  Private
 */
export const getCommunityStats = async (req: Request, res: Response) => {
  try {
    const { range = '30d' } = req.query; // '7d', '30d', '90d', '1y'
    
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    // Parallel queries برای performance
    const [
      totalMembers,
      newMembersThisMonth,
      newMembersLastMonth,
      newMembersThisWeek,
      totalConnections,
      totalActivities,
      activeMembers,
      activeMembersLastWeek,
      levelDistribution,
      topSkills,
      trendingTopics
    ] = await Promise.all([
      // Total club members
      User.countDocuments({ roles: 'CLUB_MEMBER' }),

      // New members this month
      User.countDocuments({
        roles: 'CLUB_MEMBER',
        'membershipInfo.memberSince': { $gte: lastMonth }
      }),

      // New members last month (برای محاسبه growth rate)
      User.countDocuments({
        roles: 'CLUB_MEMBER',
        'membershipInfo.memberSince': { 
          $gte: twoMonthsAgo,
          $lt: lastMonth
        }
      }),

      // New members this week
      User.countDocuments({
        roles: 'CLUB_MEMBER',
        'membershipInfo.memberSince': { $gte: lastWeek }
      }),

      // Total connections
      Connection.countDocuments({ status: 'active' }),

      // Total activities
      MemberActivity.countDocuments(),

      // Active members (با فعالیت در ماه اخیر)
      MemberActivity.distinct('userId', {
        createdAt: { $gte: lastMonth }
      }).then(userIds => userIds.length),

      // Active members last week
      MemberActivity.distinct('userId', {
        createdAt: { $gte: lastWeek }
      }).then(userIds => userIds.length),

      // Distribution by membership level
      User.aggregate([
        { $match: { roles: 'CLUB_MEMBER' } },
        { $group: { _id: '$membershipInfo.membershipLevel', count: { $sum: 1 } } }
      ]),

      // Top skills
      MemberProfile.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Trending topics (از activity types)
      MemberActivity.aggregate([
        { $match: { createdAt: { $gte: lastWeek } } },
        { $group: { _id: '$type', count: { $sum: 1 }, recentActivity: { $max: '$createdAt' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // محاسبه growth rate
    const memberGrowthRate = newMembersLastMonth > 0
      ? Math.round(((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth) * 100)
      : newMembersThisMonth > 0 ? 100 : 0;

    const activityGrowthRate = activeMembersLastWeek > 0 && activeMembers > 0
      ? Math.round(((activeMembers - activeMembersLastWeek) / activeMembersLastWeek) * 100)
      : 0;

    // Format level distribution
    const levels: Record<string, number> = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    };

    levelDistribution.forEach((item: any) => {
      if (item._id) {
        levels[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalMembers,
          newMembersThisMonth,
          newMembersThisWeek,
          totalConnections,
          totalActivities,
          activeMembers,
          averageConnectionsPerMember: totalMembers > 0 
            ? Math.round(totalConnections / totalMembers) 
            : 0,
          // Growth metrics
          memberGrowthRate,
          activityGrowthRate,
          engagementRate: totalMembers > 0
            ? Math.round((activeMembers / totalMembers) * 100)
            : 0
        },
        levelDistribution: levels,
        topSkills: topSkills.map((skill: any) => ({
          name: skill._id,
          count: skill.count
        })),
        trendingTopics: trendingTopics.map((topic: any) => ({
          type: topic._id,
          count: topic.count,
          lastActivity: topic.recentActivity
        }))
      }
    });
  } catch (error: any) {
    console.error('Get community stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/stats/trending
 * @desc    Get trending members (most connections/activities)
 * @access  Private
 */
export const getTrendingMembers = async (req: Request, res: Response) => {
  try {
    const { limit = 10, period = 7 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));

    // Get members با بیشترین فعالیت در period مشخص شده
    const trendingByActivity = await MemberActivity.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
          visibility: { $in: ['public', 'connections'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          activityCount: { $sum: 1 },
          totalReactions: { $sum: { $size: '$reactions' } },
          totalComments: { $sum: { $size: '$comments' } }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              '$activityCount',
              { $multiply: ['$totalReactions', 2] },
              { $multiply: ['$totalComments', 3] }
            ]
          }
        }
      },
      {
        $sort: { engagementScore: -1 }
      },
      {
        $limit: Number(limit)
      }
    ]);

    // Populate user details
    await User.populate(trendingByActivity, {
      path: '_id',
      select: 'firstName lastName avatar membershipInfo'
    });

    res.json({
      success: true,
      data: trendingByActivity.map((item: any) => ({
        user: item._id,
        stats: {
          activityCount: item.activityCount,
          totalReactions: item.totalReactions,
          totalComments: item.totalComments,
          engagementScore: item.engagementScore
        }
      }))
    });
  } catch (error: any) {
    console.error('Get trending members error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اعضای محبوب',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/stats/active
 * @desc    Get most active members
 * @access  Private
 */
export const getActiveMembers = async (req: Request, res: Response) => {
  try {
    const { limit = 10, days = 30 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    // Get members با بیشترین آمار
    const activeMembers = await MemberProfile.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: {
          'user.roles': 'CLUB_MEMBER',
          'stats.lastActiveAt': { $gte: daysAgo }
        }
      },
      {
        $addFields: {
          activityScore: {
            $add: [
              '$stats.connectionsCount',
              { $multiply: ['$stats.endorsementsReceived', 2] },
              { $divide: ['$stats.profileViews', 10] }
            ]
          }
        }
      },
      {
        $sort: { activityScore: -1 }
      },
      {
        $limit: Number(limit)
      },
      {
        $project: {
          user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
            membershipInfo: 1
          },
          stats: 1,
          activityScore: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: activeMembers
    });
  } catch (error: any) {
    console.error('Get active members error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اعضای فعال',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/stats/new-members
 * @desc    Get recently joined members
 * @access  Private
 */
export const getNewMembers = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const newMembers = await User.find({
      roles: 'CLUB_MEMBER'
    })
      .select('firstName lastName avatar membershipInfo university major')
      .sort({ 'membershipInfo.memberSince': -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: newMembers
    });
  } catch (error: any) {
    console.error('Get new members error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اعضای جدید',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/stats/engagement
 * @desc    Get engagement statistics
 * @access  Private
 */
export const getEngagementStats = async (req: Request, res: Response) => {
  try {
    const { days = 30 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    // Daily activity breakdown
    const dailyActivities = await MemberActivity.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          reactions: { $sum: { $size: '$reactions' } },
          comments: { $sum: { $size: '$comments' } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Activity by type
    const activityByType = await MemberActivity.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        dailyActivities: dailyActivities.map((item: any) => ({
          date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
          activities: item.count,
          reactions: item.reactions,
          comments: item.comments
        })),
        activityByType: activityByType.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error: any) {
    console.error('Get engagement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار تعامل',
      error: error.message
    });
  }
};

export default {
  getCommunityStats,
  getTrendingMembers,
  getActiveMembers,
  getNewMembers,
  getEngagementStats
};
