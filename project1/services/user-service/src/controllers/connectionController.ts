import { Request, Response } from 'express';
import Connection from '../models/Connection';
import MemberProfile from '../models/MemberProfile';
import User from '../models/User';
import socketManager from '../socket/socketManager';

// =====================================================
// CONNECTION MANAGEMENT
// =====================================================

/**
 * @route   POST /api/community/connections/follow/:userId
 * @desc    Follow a member
 * @access  Private
 */
export const followMember = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const { userId: followingId } = req.params;

    // Check if trying to follow self
    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید خود را دنبال کنید'
      });
    }

    // Check if user exists
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Check if already following
    const existingConnection = await Connection.findOne({
      followerId,
      followingId
    });

    if (existingConnection) {
      if (existingConnection.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'شما قبلاً این کاربر را دنبال کرده‌اید'
        });
      } else {
        // Reactivate blocked connection
        existingConnection.status = 'active';
        await existingConnection.save();
      }
    } else {
      // Create new connection
      await Connection.create({
        followerId,
        followingId,
        status: 'active'
      });
    }

    // Update connection counts
    const { followersCount } = await (Connection as any).getConnectionsCount(followingId);
    const profile = await MemberProfile.findOne({ userId: followingId });
    if (profile) {
      await (profile as any).updateConnectionsCount(followersCount);
    }

    // Emit socket event
    socketManager.emitActivity('connection:new', {
      followerId,
      followingId
    });

    res.json({
      success: true,
      message: 'با موفقیت دنبال شد'
    });
  } catch (error: any) {
    console.error('Follow member error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دنبال کردن',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/community/connections/unfollow/:userId
 * @desc    Unfollow a member
 * @access  Private
 */
export const unfollowMember = async (req: Request, res: Response) => {
  try {
    const followerId = req.user?.id;
    const { userId: followingId } = req.params;

    const connection = await Connection.findOneAndDelete({
      followerId,
      followingId,
      status: 'active'
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'شما این کاربر را دنبال نمی‌کنید'
      });
    }

    // Update connection counts
    const { followersCount } = await (Connection as any).getConnectionsCount(followingId);
    const profile = await MemberProfile.findOne({ userId: followingId });
    if (profile) {
      await (profile as any).updateConnectionsCount(followersCount);
    }

    res.json({
      success: true,
      message: 'دنبال کردن لغو شد'
    });
  } catch (error: any) {
    console.error('Unfollow member error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در لغو دنبال کردن',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/followers
 * @desc    Get my followers
 * @access  Private
 */
export const getMyFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const followers = await Connection.find({
      followingId: userId,
      status: 'active'
    })
      .populate('followerId', 'firstName lastName avatar email membershipInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Connection.countDocuments({
      followingId: userId,
      status: 'active'
    });

    res.json({
      success: true,
      data: followers.map(f => f.followerId),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دنبال‌کنندگان',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/following
 * @desc    Get who I'm following
 * @access  Private
 */
export const getMyFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const following = await Connection.find({
      followerId: userId,
      status: 'active'
    })
      .populate('followingId', 'firstName lastName avatar email membershipInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Connection.countDocuments({
      followerId: userId,
      status: 'active'
    });

    res.json({
      success: true,
      data: following.map(f => f.followingId),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست دنبال شونده‌ها',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/:userId/followers
 * @desc    Get user's followers
 * @access  Private
 */
export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const followers = await Connection.find({
      followingId: userId,
      status: 'active'
    })
      .populate('followerId', 'firstName lastName avatar membershipInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Connection.countDocuments({
      followingId: userId,
      status: 'active'
    });

    res.json({
      success: true,
      data: followers.map(f => f.followerId),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get user followers error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت دنبال‌کنندگان',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/:userId/following
 * @desc    Get who user is following
 * @access  Private
 */
export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const following = await Connection.find({
      followerId: userId,
      status: 'active'
    })
      .populate('followingId', 'firstName lastName avatar membershipInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Connection.countDocuments({
      followerId: userId,
      status: 'active'
    });

    res.json({
      success: true,
      data: following.map(f => f.followingId),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get user following error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست دنبال شونده‌ها',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/status/:userId
 * @desc    Check connection status with a user
 * @access  Private
 */
export const getConnectionStatus = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { userId } = req.params;

    const [isFollowing, isFollower] = await Promise.all([
      (Connection as any).isFollowing(currentUserId, userId),
      (Connection as any).isFollowing(userId, currentUserId)
    ]);

    res.json({
      success: true,
      data: {
        isFollowing,      // آیا من او را follow کردم
        isFollower,       // آیا او مرا follow کرده
        isMutual: isFollowing && isFollower
      }
    });
  } catch (error: any) {
    console.error('Get connection status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بررسی وضعیت ارتباط',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/connections/block/:userId
 * @desc    Block a member
 * @access  Private
 */
export const blockMember = async (req: Request, res: Response) => {
  try {
    const blockerId = req.user?.id;
    const { userId: blockedId } = req.params;

    if (blockerId === blockedId) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید خود را مسدود کنید'
      });
    }

    // Remove any existing connections
    await Connection.deleteMany({
      $or: [
        { followerId: blockerId, followingId: blockedId },
        { followerId: blockedId, followingId: blockerId }
      ]
    });

    // Create blocked connection
    await Connection.create({
      followerId: blockerId,
      followingId: blockedId,
      status: 'blocked'
    });

    res.json({
      success: true,
      message: 'کاربر مسدود شد'
    });
  } catch (error: any) {
    console.error('Block member error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در مسدود کردن کاربر',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/connections/mutual
 * @desc    Get mutual connections
 * @access  Private
 */
export const getMutualConnections = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const mutuals = await (Connection as any).getMutualConnections(userId);

    res.json({
      success: true,
      data: mutuals.map((m: any) => m.followerId)
    });
  } catch (error: any) {
    console.error('Get mutual connections error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت ارتباطات متقابل',
      error: error.message
    });
  }
};

export default {
  followMember,
  unfollowMember,
  getMyFollowers,
  getMyFollowing,
  getUserFollowers,
  getUserFollowing,
  getConnectionStatus,
  blockMember,
  getMutualConnections
};
