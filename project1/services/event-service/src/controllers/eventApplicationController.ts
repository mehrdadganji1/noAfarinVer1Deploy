import { Request, Response } from 'express';
import EventApplication, { EventApplicationStatus } from '../models/EventApplication';
import Event from '../models/Event';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Submit event application
 */
export const submitEventApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { eventId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        success: false,
        error: 'رویداد یافت نشد',
      });
      return;
    }

    // Check if already applied
    const existingApplication = await EventApplication.findOne({
      eventId,
      userId,
    });

    if (existingApplication) {
      res.status(400).json({
        success: false,
        error: 'شما قبلاً برای این رویداد درخواست ثبت کرده‌اید',
        data: existingApplication,
      });
      return;
    }

    // Create application
    const application = new EventApplication({
      eventId,
      userId,
      ...req.body,
      status: EventApplicationStatus.PENDING,
      submittedAt: new Date(),
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'درخواست شما با موفقیت ثبت شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Submit event application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت درخواست',
    });
  }
};

/**
 * Get my event applications
 */
export const getMyEventApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const applications = await EventApplication.find({ userId })
      .populate('eventId', 'title startDate endDate location')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    console.error('Get my event applications error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست‌ها',
    });
  }
};

/**
 * Get all event applications (Admin/Director only)
 */
export const getAllEventApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, eventId, page = 1, limit = 20, search } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (eventId) {
      query.eventId = eventId;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      EventApplication.find(query)
        .populate('eventId', 'title startDate endDate location')
        .populate('userId', 'email firstName lastName')
        .populate('reviewedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      EventApplication.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get all event applications error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست‌ها',
    });
  }
};

/**
 * Get event application by ID
 */
export const getEventApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await EventApplication.findById(id)
      .populate('eventId', 'title startDate endDate location description')
      .populate('userId', 'email firstName lastName phoneNumber')
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست یافت نشد',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get event application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست',
    });
  }
};

/**
 * Review event application (Admin/Director only)
 */
export const reviewEventApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id;

    const application = await EventApplication.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست یافت نشد',
      });
      return;
    }

    if (application.status !== EventApplicationStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: 'این درخواست قبلاً بررسی شده است',
      });
      return;
    }

    application.status = EventApplicationStatus.UNDER_REVIEW;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();

    await application.save();

    res.status(200).json({
      success: true,
      message: 'وضعیت درخواست به "در حال بررسی" تغییر کرد',
      data: application,
    });
  } catch (error: any) {
    console.error('Review event application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بررسی درخواست',
    });
  }
};

/**
 * Approve event application (Admin/Director only)
 */
export const approveEventApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    const application = await EventApplication.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست یافت نشد',
      });
      return;
    }

    if (application.status === EventApplicationStatus.APPROVED) {
      res.status(400).json({
        success: false,
        error: 'این درخواست قبلاً تایید شده است',
      });
      return;
    }

    application.status = EventApplicationStatus.APPROVED;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;

    await application.save();

    // TODO: Send notification to user
    // TODO: Add user to event participants

    res.status(200).json({
      success: true,
      message: 'درخواست تایید شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Approve event application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تایید درخواست',
    });
  }
};

/**
 * Reject event application (Admin/Director only)
 */
export const rejectEventApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!reviewNotes) {
      res.status(400).json({
        success: false,
        error: 'دلیل رد درخواست الزامی است',
      });
      return;
    }

    const application = await EventApplication.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست یافت نشد',
      });
      return;
    }

    if (application.status === EventApplicationStatus.REJECTED) {
      res.status(400).json({
        success: false,
        error: 'این درخواست قبلاً رد شده است',
      });
      return;
    }

    application.status = EventApplicationStatus.REJECTED;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;

    await application.save();

    // TODO: Send notification to user

    res.status(200).json({
      success: true,
      message: 'درخواست رد شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Reject event application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در رد درخواست',
    });
  }
};

/**
 * Get event application stats (Admin/Director only)
 */
export const getEventApplicationStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.query;

    const query: any = eventId ? { eventId } : {};

    const [total, pending, underReview, approved, rejected, waitlist] = await Promise.all([
      EventApplication.countDocuments(query),
      EventApplication.countDocuments({ ...query, status: EventApplicationStatus.PENDING }),
      EventApplication.countDocuments({ ...query, status: EventApplicationStatus.UNDER_REVIEW }),
      EventApplication.countDocuments({ ...query, status: EventApplicationStatus.APPROVED }),
      EventApplication.countDocuments({ ...query, status: EventApplicationStatus.REJECTED }),
      EventApplication.countDocuments({ ...query, status: EventApplicationStatus.WAITLIST }),
    ]);

    const approvalRate = (approved + rejected) > 0 
      ? Math.round((approved / (approved + rejected)) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        waitlist,
        approvalRate,
      },
    });
  } catch (error: any) {
    console.error('Get event application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار',
    });
  }
};

/**
 * Bulk approve event applications (Admin/Director only)
 */
export const bulkApproveEventApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationIds, reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'لیست درخواست‌ها الزامی است',
      });
      return;
    }

    const results = await Promise.allSettled(
      applicationIds.map(async (id: string) => {
        const application = await EventApplication.findById(id);

        if (!application) {
          throw new Error(`درخواست ${id} یافت نشد`);
        }

        if (application.status === EventApplicationStatus.APPROVED) {
          throw new Error(`درخواست ${id} قبلاً تایید شده`);
        }

        application.status = EventApplicationStatus.APPROVED;
        application.reviewedBy = reviewerId as any;
        application.reviewedAt = new Date();
        if (reviewNotes) application.reviewNotes = reviewNotes;

        await application.save();

        return { id, success: true };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `${successful} درخواست تایید شد، ${failed} درخواست با خطا مواجه شد`,
      data: { successful, failed, results },
    });
  } catch (error: any) {
    console.error('Bulk approve error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در تایید گروهی',
    });
  }
};

/**
 * Bulk reject event applications (Admin/Director only)
 */
export const bulkRejectEventApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { applicationIds, reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'لیست درخواست‌ها الزامی است',
      });
      return;
    }

    if (!reviewNotes || !reviewNotes.trim()) {
      res.status(400).json({
        success: false,
        error: 'دلیل رد درخواست الزامی است',
      });
      return;
    }

    const results = await Promise.allSettled(
      applicationIds.map(async (id: string) => {
        const application = await EventApplication.findById(id);

        if (!application) {
          throw new Error(`درخواست ${id} یافت نشد`);
        }

        if (application.status === EventApplicationStatus.REJECTED) {
          throw new Error(`درخواست ${id} قبلاً رد شده`);
        }

        application.status = EventApplicationStatus.REJECTED;
        application.reviewedBy = reviewerId as any;
        application.reviewedAt = new Date();
        application.reviewNotes = reviewNotes;

        await application.save();

        return { id, success: true };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `${successful} درخواست رد شد، ${failed} درخواست با خطا مواجه شد`,
      data: { successful, failed, results },
    });
  } catch (error: any) {
    console.error('Bulk reject error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در رد گروهی',
    });
  }
};

