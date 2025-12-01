import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { UserRole, MembershipLevel, MembershipStatus } from '../models/User';
import Application from '../models/Application';
import MemberProfile from '../models/MemberProfile';
import emailService from '../services/emailService';

/**
 * Generate unique member ID
 * Format: NI-YYYY-XXXX (NI = Noafarineventor, YYYY = Year, XXXX = Sequential)
 */
const generateMemberId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `NI-${year}-`;
  
  // Find the last member ID with this prefix
  const lastMember = await User.findOne({
    'membershipInfo.memberId': new RegExp(`^${prefix}`)
  })
    .sort({ 'membershipInfo.memberId': -1 })
    .limit(1);
  
  let sequence = 1;
  if (lastMember?.membershipInfo?.memberId) {
    const lastSequence = parseInt(lastMember.membershipInfo.memberId.split('-')[2]);
    sequence = lastSequence + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(4, '0')}`;
};

/**
 * @route   POST /api/users/:userId/promote
 * @desc    Promote applicant to club member
 * @access  Admin
 */
export const promoteToClubMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.id;
    
    console.log('🔄 Promotion request:', { userId, adminId });
    
    // Find user
    const user = await User.findById(userId);
    console.log('👤 User found:', user ? { id: user._id, email: user.email, roles: user.role } : 'NOT FOUND');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }
    
    // Check if user is an applicant
    if (!user.role.includes(UserRole.APPLICANT)) {
      console.log('❌ User is not an applicant. Roles:', user.role);
      return res.status(400).json({
        success: false,
        message: 'کاربر باید در نقش متقاضی باشد'
      });
    }
    
    // Check if user has approved application
    const application = await Application.findOne({ 
      userId: userId,
      status: 'approved'
    });
    
    console.log('📝 Application found:', application ? { id: application._id, status: application.status } : 'NOT FOUND');
    
    if (!application) {
      console.log('❌ No approved application found for user');
      return res.status(400).json({
        success: false,
        message: 'کاربر باید درخواست تایید شده داشته باشد'
      });
    }
    
    // Check if already a club member
    if (user.role.includes(UserRole.CLUB_MEMBER)) {
      console.log('❌ User is already a club member');
      return res.status(400).json({
        success: false,
        message: 'کاربر هم‌اکنون عضو باشگاه است'
      });
    }
    
    // Generate member ID
    const memberId = await generateMemberId();
    
    // Update user role and add membership info
    user.role.push(UserRole.CLUB_MEMBER);
    user.membershipInfo = {
      memberId,
      memberSince: new Date(),
      membershipLevel: MembershipLevel.BRONZE,
      points: 0,
      status: MembershipStatus.ACTIVE,
      promotedBy: new mongoose.Types.ObjectId(adminId),
      promotedAt: new Date(),
      lastActivityAt: new Date()
    };
    
    // Initialize member stats
    user.memberStats = {
      eventsAttended: 0,
      projectsCompleted: 0,
      coursesCompleted: 0,
      achievementsEarned: 0,
      totalPoints: 0
    };
    
    await user.save();
    
    // Create Member Profile
    try {
      await MemberProfile.create({
        userId: user._id,
        bio: `عضو باشگاه نوآفرینان از ${new Date().toLocaleDateString('fa-IR')}`,
        headline: 'عضو باشگاه نوآفرینان',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        telegram: '',
        skills: [],
        interests: [],
        languages: [{ name: 'فارسی', proficiency: 'native' }],
        availability: {
          status: 'available',
          lookingFor: [],
          preferredRoles: []
        },
        visibility: {
          profile: 'public',
          email: false,
          phone: false,
          projects: true,
          achievements: true,
          skills: true
        },
        stats: {
          profileViews: 0,
          connectionsCount: 0,
          endorsementsReceived: 0,
          lastActiveAt: new Date()
        },
        featuredProjects: [],
        featuredAchievements: []
      });
      console.log('✅ MemberProfile created successfully');
    } catch (profileError) {
      console.error('❌ Failed to create MemberProfile:', profileError);
      // Don't fail the whole promotion if profile creation fails
    }
    
    // Send welcome email
    try {
      await emailService.sendEmail({
        to: user.email,
        subject: 'خوش آمدید به باشگاه نوآفرینان! 🎉',
        html: `
          <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
            <h2 style="color: #3B82F6;">تبریک! شما عضو باشگاه نوآفرینان شدید</h2>
            <p>سلام ${user.firstName} ${user.lastName} عزیز،</p>
            <p>با کمال افتخار اعلام می‌کنیم که شما به عنوان عضو رسمی باشگاه نوآفرینان پذیرفته شدید.</p>
            
            <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E40AF;">اطلاعات عضویت شما:</h3>
              <p><strong>شناسه عضویت:</strong> ${memberId}</p>
              <p><strong>سطح عضویت:</strong> برنز (Bronze)</p>
              <p><strong>تاریخ عضویت:</strong> ${new Date().toLocaleDateString('fa-IR')}</p>
            </div>
            
            <h3>امکانات جدید:</h3>
            <ul style="line-height: 1.8;">
              <li>دسترسی به رویدادها و کارگاه‌های حضوری</li>
              <li>شرکت در پروژه‌های گروهی</li>
              <li>دسترسی به دوره‌های آموزشی آنلاین</li>
              <li>عضویت در شبکه اعضای باشگاه</li>
              <li>کسب نشان‌ها و امتیازات</li>
              <li>دسترسی به منابع اختصاصی</li>
            </ul>
            
            <p style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL}/club-member/dashboard" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                ورود به داشبورد عضویت
              </a>
            </p>
            
            <p>از اینکه به جمع ما پیوستید خوشحالیم!</p>
            <p>تیم باشگاه نوآفرینان</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the promotion if email fails
    }
    
    return res.status(200).json({
      success: true,
      message: 'کاربر با موفقیت به عضو باشگاه ارتقا یافت',
      data: {
        userId: user._id,
        memberId: user.membershipInfo.memberId,
        memberSince: user.membershipInfo.memberSince,
        membershipLevel: user.membershipInfo.membershipLevel
      }
    });
    
  } catch (error: any) {
    console.error('Error promoting to club member:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در ارتقای کاربر',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/users/club-members
 * @desc    Get all club members with filters
 * @access  Admin/ClubMember
 */
export const getClubMembers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      level,
      status,
      sortBy = 'memberSince',
      sortOrder = 'desc',
      search
    } = req.query;
    
    // Build filter query
    const filter: any = {
      role: UserRole.CLUB_MEMBER
    };
    
    if (level) {
      filter['membershipInfo.membershipLevel'] = level;
    }
    
    if (status) {
      filter['membershipInfo.status'] = status;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'membershipInfo.memberId': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sort: any = {};
    sort[`membershipInfo.${sortBy}`] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const members = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('membershipInfo.promotedBy', 'firstName lastName email');
    
    const total = await User.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching club members:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست اعضا',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/users/:userId/membership-stats
 * @desc    Get member statistics
 * @access  ClubMember/Admin
 */
export const getMembershipStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('role membershipInfo memberStats');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }
    
    if (!user.role.includes(UserRole.CLUB_MEMBER)) {
      return res.status(403).json({
        success: false,
        message: 'کاربر عضو باشگاه نیست'
      });
    }
    
    if (!user.membershipInfo) {
      return res.status(404).json({
        success: false,
        message: 'اطلاعات عضویت یافت نشد'
      });
    }
    
    // Calculate membership duration
    const memberSince = user.membershipInfo.memberSince;
    const duration = memberSince 
      ? Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // Get rank among all members (based on total points)
    const rank = await User.countDocuments({
      role: UserRole.CLUB_MEMBER,
      'memberStats.totalPoints': { $gt: user.memberStats?.totalPoints || 0 }
    }) + 1;
    
    return res.status(200).json({
      success: true,
      data: {
        membershipInfo: user.membershipInfo,
        stats: {
          ...(user.memberStats || {}),
          rank,
          membershipDays: duration
        }
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching membership stats:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار عضویت',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/users/:userId/membership-level
 * @desc    Update membership level
 * @access  Admin
 */
export const updateMembershipLevel = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { level } = req.body;
    
    if (!Object.values(MembershipLevel).includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'سطح عضویت نامعتبر است'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user || !user.membershipInfo) {
      return res.status(404).json({
        success: false,
        message: 'عضو یافت نشد'
      });
    }
    
    const oldLevel = user.membershipInfo.membershipLevel;
    user.membershipInfo.membershipLevel = level;
    await user.save();
    
    // Send notification email
    try {
      await emailService.sendEmail({
        to: user.email,
        subject: 'ارتقای سطح عضویت! 🎉',
        html: `
          <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
            <h2>تبریک! سطح عضویت شما ارتقا یافت</h2>
            <p>سلام ${user.firstName} عزیز،</p>
            <p>سطح عضویت شما از <strong>${oldLevel}</strong> به <strong>${level}</strong> ارتقا یافت.</p>
            <p>با این ارتقا، امکانات و مزایای بیشتری در اختیار شما قرار می‌گیرد.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending level upgrade email:', emailError);
    }
    
    return res.status(200).json({
      success: true,
      message: 'سطح عضویت با موفقیت به‌روزرسانی شد',
      data: {
        oldLevel,
        newLevel: level
      }
    });
    
  } catch (error: any) {
    console.error('Error updating membership level:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی سطح عضویت',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/users/:userId/membership-status
 * @desc    Update membership status (suspend/activate)
 * @access  Admin
 */
export const updateMembershipStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;
    
    if (!Object.values(MembershipStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت عضویت نامعتبر است'
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user || !user.membershipInfo) {
      return res.status(404).json({
        success: false,
        message: 'عضو یافت نشد'
      });
    }
    
    user.membershipInfo.status = status;
    await user.save();
    
    // Send notification
    if (status === MembershipStatus.SUSPENDED) {
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: 'تعلیق عضویت',
          html: `
            <div style="font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
              <h2>عضویت شما به‌طور موقت تعلیق شد</h2>
              <p>سلام ${user.firstName} عزیز،</p>
              <p>عضویت شما در باشگاه نوآفرینان به‌طور موقت تعلیق شده است.</p>
              ${reason ? `<p><strong>دلیل:</strong> ${reason}</p>` : ''}
              <p>برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending suspension email:', emailError);
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'وضعیت عضویت با موفقیت به‌روزرسانی شد',
      data: {
        status
      }
    });
    
  } catch (error: any) {
    console.error('Error updating membership status:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت عضویت',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/users/promotion-history
 * @desc    Get promotion history
 * @access  Admin
 */
export const getPromotionHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const promotions = await User.find({
      'membershipInfo.promotedAt': { $exists: true }
    })
      .select('firstName lastName email membershipInfo')
      .populate('membershipInfo.promotedBy', 'firstName lastName email')
      .sort({ 'membershipInfo.promotedAt': -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments({
      'membershipInfo.promotedAt': { $exists: true }
    });
    
    return res.status(200).json({
      success: true,
      data: promotions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching promotion history:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در دریافت تاریخچه ارتقاها',
      error: error.message
    });
  }
};
