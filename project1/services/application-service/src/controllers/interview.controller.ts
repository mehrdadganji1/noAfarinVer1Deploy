import { Request, Response } from 'express';
import Interview from '../models/Interview';
import mongoose from 'mongoose';

/**
 * @desc    Get all interviews for current user
 * @route   GET /api/interviews/my-interviews
 * @access  Private (Applicant)
 */
export const getMyInterviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const interviews = await Interview.find({ userId })
      .populate('interviewers', 'firstName lastName email avatar')
      .populate('applicationId', 'status')
      .sort({ interviewDate: 1 });
    
    return res.json({
      success: true,
      data: interviews,
    });
  } catch (error: any) {
    console.error('Get my interviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست مصاحبه‌ها',
    });
  }
};

/**
 * @desc    Get upcoming interviews for current user
 * @route   GET /api/interviews/upcoming
 * @access  Private (Applicant)
 */
export const getUpcomingInterviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const now = new Date();
    
    const interviews = await Interview.find({
      userId,
      interviewDate: { $gte: now },
      status: { $in: ['scheduled', 'confirmed'] },
    })
      .populate('interviewers', 'firstName lastName email avatar')
      .populate('applicationId', 'status')
      .sort({ interviewDate: 1 })
      .limit(10);
    
    return res.json({
      success: true,
      data: interviews,
    });
  } catch (error: any) {
    console.error('Get upcoming interviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در دریافت مصاحبه‌های آینده',
    });
  }
};

/**
 * @desc    Get interview by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getInterviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'شناسه مصاحبه نامعتبر است',
      });
    }
    
    const interview = await Interview.findOne({ _id: id, userId })
      .populate('interviewers', 'firstName lastName email avatar phoneNumber')
      .populate('applicationId', 'status firstName lastName email');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'مصاحبه یافت نشد',
      });
    }
    
    return res.json({
      success: true,
      data: interview,
    });
  } catch (error: any) {
    console.error('Get interview by ID error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در دریافت اطلاعات مصاحبه',
    });
  }
};

/**
 * @desc    Confirm interview
 * @route   PUT /api/interviews/:id/confirm
 * @access  Private (Applicant)
 */
export const confirmInterview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const interview = await Interview.findOne({ _id: id, userId });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'مصاحبه یافت نشد',
      });
    }
    
    // Check if can confirm
    if (interview.status !== 'scheduled' || interview.interviewDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'امکان تایید این مصاحبه وجود ندارد',
      });
    }
    
    interview.status = 'confirmed';
    await interview.save();
    
    // TODO: Send notification to interviewers
    
    return res.json({
      success: true,
      data: interview,
      message: 'مصاحبه با موفقیت تایید شد',
    });
  } catch (error: any) {
    console.error('Confirm interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در تایید مصاحبه',
    });
  }
};

/**
 * @desc    Request interview reschedule
 * @route   POST /api/interviews/:id/reschedule-request
 * @access  Private (Applicant)
 */
export const requestReschedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user.id;
    
    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'لطفاً دلیل درخواست تغییر زمان را به طور کامل توضیح دهید (حداقل 10 کاراکتر)',
      });
    }
    
    const interview = await Interview.findOne({ _id: id, userId });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'مصاحبه یافت نشد',
      });
    }
    
    // Check if can reschedule (24 hours before)
    const now = new Date();
    const interviewDateTime = new Date(interview.interviewDate);
    const hoursUntilInterview = (interviewDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilInterview <= 24 || !['scheduled', 'confirmed'].includes(interview.status)) {
      return res.status(400).json({
        success: false,
        error: 'امکان درخواست تغییر زمان برای این مصاحبه وجود ندارد. حداقل 24 ساعت قبل از مصاحبه می‌توانید درخواست دهید.',
      });
    }
    
    interview.status = 'rescheduled';
    interview.rescheduleReason = reason;
    interview.rescheduleRequestedAt = new Date();
    interview.rescheduleRequestedBy = new mongoose.Types.ObjectId(userId);
    await interview.save();
    
    // TODO: Send notification to admin/interviewers
    
    return res.json({
      success: true,
      data: interview,
      message: 'درخواست تغییر زمان با موفقیت ثبت شد. به زودی با شما تماس گرفته خواهد شد.',
    });
  } catch (error: any) {
    console.error('Request reschedule error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در ثبت درخواست تغییر زمان',
    });
  }
};

/**
 * @desc    Cancel interview (Admin only)
 * @route   PUT /api/interviews/:id/cancel
 * @access  Private (Admin/Manager)
 */
export const cancelInterview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user.id;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'دلیل لغو مصاحبه الزامی است',
      });
    }
    
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'مصاحبه یافت نشد',
      });
    }
    
    interview.status = 'cancelled';
    interview.cancelledReason = reason;
    interview.cancelledAt = new Date();
    interview.cancelledBy = new mongoose.Types.ObjectId(userId);
    await interview.save();
    
    // TODO: Send notification to applicant
    
    return res.json({
      success: true,
      data: interview,
      message: 'مصاحبه لغو شد',
    });
  } catch (error: any) {
    console.error('Cancel interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در لغو مصاحبه',
    });
  }
};

/**
 * @desc    Create interview (Admin only)
 * @route   POST /api/interviews
 * @access  Private (Admin/Manager)
 */
export const createInterview = async (req: Request, res: Response) => {
  try {
    const {
      applicationId,
      userId,
      interviewDate,
      interviewTime,
      duration,
      location,
      meetingLink,
      meetingPassword,
      officeAddress,
      phoneNumber,
      interviewers,
      interviewType,
      notes,
    } = req.body;
    
    // Validation
    if (!applicationId || !userId || !interviewDate || !interviewTime || !location) {
      return res.status(400).json({
        success: false,
        error: 'لطفاً تمام فیلدهای الزامی را پر کنید',
      });
    }
    
    // Validate location-specific fields
    if (location === 'online' && !meetingLink) {
      return res.status(400).json({
        success: false,
        error: 'لینک جلسه آنلاین الزامی است',
      });
    }
    
    if (location === 'office' && !officeAddress) {
      return res.status(400).json({
        success: false,
        error: 'آدرس دفتر الزامی است',
      });
    }
    
    if (location === 'phone' && !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'شماره تماس الزامی است',
      });
    }
    
    const interview = await Interview.create({
      applicationId,
      userId,
      interviewDate,
      interviewTime,
      duration: duration || 60,
      location,
      meetingLink,
      meetingPassword,
      officeAddress,
      phoneNumber,
      interviewers: interviewers || [],
      interviewType: interviewType || 'hr',
      notes,
    });
    
    // TODO: Send notification to applicant
    
    return res.status(201).json({
      success: true,
      data: interview,
      message: 'مصاحبه با موفقیت ایجاد شد',
    });
  } catch (error: any) {
    console.error('Create interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در ایجاد مصاحبه',
    });
  }
};

/**
 * @desc    Get all interviews (Admin only)
 * @route   GET /api/interviews
 * @access  Private (Admin/Manager)
 */
export const getAllInterviews = async (req: Request, res: Response) => {
  try {
    const { status, date, userId } = req.query;
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.interviewDate = { $gte: startDate, $lt: endDate };
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    const interviews = await Interview.find(filter)
      .populate('userId', 'firstName lastName email phoneNumber')
      .populate('interviewers', 'firstName lastName email')
      .populate('applicationId', 'status')
      .sort({ interviewDate: -1 })
      .limit(100);
    
    return res.json({
      success: true,
      data: interviews,
      count: interviews.length,
    });
  } catch (error: any) {
    console.error('Get all interviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست مصاحبه‌ها',
    });
  }
};
