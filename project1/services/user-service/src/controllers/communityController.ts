import { Request, Response } from 'express';
import MemberProfile from '../models/MemberProfile';
import Connection from '../models/Connection';
import User from '../models/User';
import { z } from 'zod';

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  headline: z.string().max(120).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  interests: z.array(z.string()).optional(),
  availability: z.object({
    status: z.enum(['available', 'busy', 'not_available']).optional(),
    lookingFor: z.array(z.enum(['collaboration', 'mentorship', 'job', 'learning'])).optional(),
    preferredRoles: z.array(z.string()).optional()
  }).optional()
});

const visibilitySchema = z.object({
  profile: z.enum(['public', 'members_only', 'private']).optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  projects: z.boolean().optional(),
  achievements: z.boolean().optional(),
  skills: z.boolean().optional()
});

const skillSchema = z.object({
  name: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
});

const languageSchema = z.object({
  name: z.string().min(1),
  proficiency: z.enum(['basic', 'conversational', 'fluent', 'native'])
});

// =====================================================
// PROFILE MANAGEMENT
// =====================================================

/**
 * @route   GET /api/community/profiles
 * @desc    Get all member profiles با فیلتر
 * @access  Private (Club Members)
 */
export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const {
      search,
      skill,
      level,
      location,
      availability,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query: any = {};

    // Search در bio, headline, skills
    if (search) {
      query.$or = [
        { bio: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { 'skills.name': { $regex: search, $options: 'i' } },
        { interests: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skill
    if (skill) {
      query['skills.name'] = { $regex: skill, $options: 'i' };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by availability
    if (availability) {
      query['availability.status'] = availability;
    }

    // Filter by visibility (فقط public و members_only)
    query['visibility.profile'] = { $in: ['public', 'members_only'] };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const profiles = await MemberProfile.find(query)
      .populate('userId', 'firstName lastName email avatar membershipInfo')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await MemberProfile.countDocuments(query);

    // Filter by membership level
    let filteredProfiles = profiles;
    if (level) {
      filteredProfiles = profiles.filter((p: any) => 
        p.userId?.membershipInfo?.level === level
      );
    }

    // Add connection status for each profile
    const currentUserId = req.user?.id;
    const profilesWithStatus = await Promise.all(
      filteredProfiles.map(async (profile: any) => {
        const profileObj = profile.toObject();
        
        // Check if current user is following this profile
        if (currentUserId && profile.userId?._id.toString() !== currentUserId) {
          const connection = await Connection.findOne({
            followerId: currentUserId,
            followingId: profile.userId._id,
            status: 'active'
          });
          profileObj.isFollowing = !!connection;
        } else {
          profileObj.isFollowing = false;
        }
        
        return profileObj;
      })
    );

    res.json({
      success: true,
      data: profilesWithStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل‌ها',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/profiles/:userId
 * @desc    Get specific member profile
 * @access  Private (Club Members)
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;

    const profile = await MemberProfile.findOne({ userId })
      .populate('userId', 'firstName lastName email avatar university major membershipInfo memberStats')
      .populate('featuredProjects')
      .populate('featuredAchievements');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل یافت نشد'
      });
    }

    // Check visibility
    const user = profile.userId as any;
    const isOwnProfile = viewerId === userId;
    const visibility = profile.visibility.profile;

    if (!isOwnProfile && visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'دسترسی به این پروفایل محدود است'
      });
    }

    // Increment view count (not for own profile)
    if (!isOwnProfile) {
      // Increment views
      profile.stats.profileViews = (profile.stats.profileViews || 0) + 1;
      await profile.save();
    }

    // Check connection status
    const connection = await Connection.findOne({
      follower: viewerId,
      following: userId,
      status: 'accepted'
    });
    const isFollowing = !!connection;

    res.json({
      success: true,
      data: {
        profile,
        isFollowing,
        isOwnProfile
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/profiles/me
 * @desc    Update my profile
 * @access  Private
 */
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Validate input
    const validatedData = updateProfileSchema.parse(req.body);

    let profile = await MemberProfile.findOne({ userId });

    // Create profile if doesn't exist
    if (!profile) {
      profile = new MemberProfile({
        userId,
        ...validatedData
      });
    } else {
      // Update existing profile
      Object.assign(profile, validatedData);
    }

    await profile.save();

    const populatedProfile = await MemberProfile.findById(profile._id)
      .populate('userId', 'firstName lastName email avatar membershipInfo');

    res.json({
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      data: populatedProfile
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پروفایل',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/community/profiles/me/visibility
 * @desc    Update visibility settings
 * @access  Private
 */
export const updateVisibility = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const validatedData = visibilitySchema.parse(req.body);

    let profile = await MemberProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل یافت نشد'
      });
    }

    profile.visibility = {
      ...profile.visibility,
      ...validatedData
    };

    await profile.save();

    res.json({
      success: true,
      message: 'تنظیمات حریم خصوصی به‌روزرسانی شد',
      data: profile.visibility
    });
  } catch (error: any) {
    console.error('Update visibility error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی تنظیمات',
      error: error.message
    });
  }
};

// =====================================================
// PROFILE STATS
// =====================================================

/**
 * @route   GET /api/community/profiles/:userId/stats
 * @desc    Get member stats
 * @access  Private
 */
export const getProfileStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await MemberProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل یافت نشد'
      });
    }

    // Get connection counts
    const followersCount = await Connection.countDocuments({ following: userId, status: 'accepted' });
    const followingCount = await Connection.countDocuments({ follower: userId, status: 'accepted' });

    // Update profile stats
    profile.stats.connectionsCount = followersCount;
    await profile.save();

    res.json({
      success: true,
      data: {
        ...profile.stats,
        followersCount,
        followingCount
      }
    });
  } catch (error: any) {
    console.error('Get profile stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/profiles/:userId/view
 * @desc    Record profile view
 * @access  Private
 */
export const recordProfileView = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.id;

    // Don't record if viewing own profile
    if (viewerId === userId) {
      return res.json({ success: true });
    }

    const profile = await MemberProfile.findOne({ userId });

    if (profile) {
      // Increment views
      profile.stats.profileViews = (profile.stats.profileViews || 0) + 1;
      await profile.save();
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Record view error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت بازدید',
      error: error.message
    });
  }
};

// =====================================================
// SKILLS & ENDORSEMENTS
// =====================================================

/**
 * @route   POST /api/community/profiles/me/skills
 * @desc    Add skill to profile
 * @access  Private
 */
export const addSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const validatedData = skillSchema.parse(req.body);

    let profile = await MemberProfile.findOne({ userId });

    if (!profile) {
      profile = new MemberProfile({ userId });
    }

    // Add skill
    profile.skills.push({
      name: validatedData.name,
      level: validatedData.level,
      endorsements: 0,
      endorsedBy: []
    });
    await profile.save();

    res.json({
      success: true,
      message: 'مهارت اضافه شد',
      data: profile.skills
    });
  } catch (error: any) {
    console.error('Add skill error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های نامعتبر',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در افزودن مهارت',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/community/profiles/:userId/endorse
 * @desc    Endorse a member's skill
 * @access  Private
 */
export const endorseSkill = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { skillName } = req.body;
    const endorserId = req.user?.id;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'نام مهارت الزامی است'
      });
    }

    if (userId === endorserId) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید مهارت خود را تایید کنید'
      });
    }

    const profile = await MemberProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل یافت نشد'
      });
    }

    // Endorse skill
    const skill = profile.skills.find((s: any) => s.name === skillName);
    if (skill && endorserId && !skill.endorsedBy.some((id: any) => id.toString() === endorserId.toString())) {
      skill.endorsements += 1;
      skill.endorsedBy.push(endorserId as any);
      await profile.save();
    }

    res.json({
      success: true,
      message: 'مهارت تایید شد',
      data: profile.skills
    });
  } catch (error: any) {
    console.error('Endorse skill error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تایید مهارت',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/profiles/:userId/endorsers
 * @desc    Get list of people who endorsed user's skills
 * @access  Private
 */
export const getEndorsers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await MemberProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'پروفایل یافت نشد'
      });
    }

    // Get unique endorser IDs
    const endorserIds = new Set();
    profile.skills.forEach(skill => {
      skill.endorsedBy.forEach(id => endorserIds.add(id.toString()));
    });

    // Get endorser details
    const endorsers = await User.find({
      _id: { $in: Array.from(endorserIds) }
    }).select('firstName lastName avatar membershipInfo');

    res.json({
      success: true,
      data: endorsers
    });
  } catch (error: any) {
    console.error('Get endorsers error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست تاییدکنندگان',
      error: error.message
    });
  }
};

// =====================================================
// SEARCH & SUGGESTIONS
// =====================================================

/**
 * @route   GET /api/community/search
 * @desc    Advanced member search
 * @access  Private
 */
export const advancedSearch = async (req: Request, res: Response) => {
  try {
    const { query, filters } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'عبارت جستجو الزامی است'
      });
    }

    // Search profiles
    const profiles = await MemberProfile.find({
      $or: [
        { bio: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } },
        { 'skills.name': { $regex: query, $options: 'i' } },
        { interests: { $regex: query, $options: 'i' } }
      ],
      'visibility.profile': { $in: ['public', 'members_only'] }
    })
      .populate('userId', 'firstName lastName avatar')
      .limit(20);

    res.json({
      success: true,
      data: profiles
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در جستجو',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/community/suggestions
 * @desc    Get connection suggestions
 * @access  Private
 */
export const getConnectionSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const limit = Number(req.query.limit) || 10;

    // Get suggested connections (simple implementation)
    const suggestions = await MemberProfile.find({
      userId: { $ne: userId },
      'visibility.profile': { $in: ['public', 'members_only'] }
    })
      .populate('userId', 'firstName lastName avatar')
      .limit(limit);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error: any) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیشنهادات',
      error: error.message
    });
  }
};

export default {
  getAllProfiles,
  getProfile,
  updateMyProfile,
  updateVisibility,
  getProfileStats,
  recordProfileView,
  addSkill,
  endorseSkill,
  getEndorsers,
  advancedSearch,
  getConnectionSuggestions
};
