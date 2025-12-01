import { Request, Response } from 'express';
import Application from '../models/Application';

/**
 * Get current user's application
 */
export const getMyApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const application = await Application.findOne({ userId }).lean();

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get my application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست عضویت',
    });
  }
};

/**
 * Create or update application
 */
export const saveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const applicationData = req.body;

    // Check if application exists
    let application = await Application.findOne({ userId });

    if (application) {
      // Update existing application
      Object.assign(application, applicationData);
      await application.save();
    } else {
      // Create new application
      application = await Application.create({
        userId,
        ...applicationData,
      });
    }

    res.json({
      success: true,
      message: 'درخواست عضویت ذخیره شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Save application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ذخیره درخواست عضویت',
    });
  }
};

/**
 * Submit application
 */
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const application = await Application.findOne({ userId });

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    if (application.status !== 'draft') {
      res.status(400).json({
        success: false,
        error: 'این درخواست قبلاً ارسال شده است',
      });
      return;
    }

    application.status = 'submitted';
    application.submittedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'درخواست عضویت با موفقیت ارسال شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ارسال درخواست عضویت',
    });
  }
};

/**
 * Withdraw application
 */
export const withdrawApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const application = await Application.findOne({ userId });

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    if (application.status === 'accepted' || application.status === 'rejected') {
      res.status(400).json({
        success: false,
        error: 'نمی‌توانید این درخواست را پس بگیرید',
      });
      return;
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'درخواست عضویت پس گرفته شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در پس گرفتن درخواست عضویت',
    });
  }
};

/**
 * Get all applications (Admin/Manager)
 */
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست‌های عضویت',
    });
  }
};

/**
 * Get application by ID (Admin/Manager)
 */
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .lean();

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت درخواست عضویت',
    });
  }
};

/**
 * Review application (Admin/Manager)
 */
export const reviewApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const reviewerId = (req as any).user.id;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    application.status = status;
    application.reviewNotes = reviewNotes;
    application.reviewedBy = reviewerId;
    application.reviewedAt = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'درخواست عضویت بررسی شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بررسی درخواست عضویت',
    });
  }
};

/**
 * Get application statistics
 */
export const getApplicationStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    const underReview = await Application.countDocuments({ status: 'under-review' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        underReview,
        approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت آمار درخواست‌ها',
    });
  }
};

/**
 * Get pending documents for review (Admin/Manager)
 */
export const getPendingDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Find applications with documents uploaded
    const applications = await Application.find({
      $or: [
        { 'documents.resume': { $exists: true, $ne: null } },
        { 'documents.transcript': { $exists: true, $ne: null } },
        { 'documents.idCard': { $exists: true, $ne: null } },
        { 'documents.photo': { $exists: true, $ne: null } }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Application.countDocuments({
      $or: [
        { 'documents.resume': { $exists: true, $ne: null } },
        { 'documents.transcript': { $exists: true, $ne: null } },
        { 'documents.idCard': { $exists: true, $ne: null } },
        { 'documents.photo': { $exists: true, $ne: null } }
      ]
    });

    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get pending documents error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت مدارک',
    });
  }
};

/**
 * Verify document (Admin/Manager)
 */
export const verifyDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId, documentType } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'درخواست عضویت یافت نشد',
      });
      return;
    }

    // Verify the document type exists
    const validTypes = ['resume', 'transcript', 'idCard', 'photo'];
    if (!validTypes.includes(documentType)) {
      res.status(400).json({
        success: false,
        error: 'نوع مدرک نامعتبر است',
      });
      return;
    }

    // Update review status
    application.reviewNotes = notes || application.reviewNotes;
    application.status = status === 'verified' ? 'under_review' : application.status;
    
    await application.save();

    res.json({
      success: true,
      message: 'مدرک بررسی شد',
      data: application,
    });
  } catch (error: any) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در بررسی مدرک',
    });
  }
};
