import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Application, { ApplicationStatus } from '../models/Application';
import User, { UserRole } from '../models/User';
import NotificationService from '../services/notificationService';
import { ActivityService } from './activityController';

// Export document management functions
export {
  getDocuments,
  addDocument,
  deleteDocument,
  verifyDocument,
  rejectDocument,
  getPendingDocuments,
  requestDocumentInfo
} from './documentController';

/**
 * Submit new application (Applicant only)
 */
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({ userId });
    if (existingApplication) {
      res.status(400).json({
        success: false,
        error: 'Application already submitted',
        data: existingApplication,
      });
      return;
    }

    // Create application
    const application = new Application({
      userId,
      ...req.body,
      status: ApplicationStatus.PENDING,
      submittedAt: new Date(),
    });

    await application.save();

    console.log('📧 Sending notification for application:', {
      applicationId: application._id,
      userId,
    });

    // Send notification to user
    await NotificationService.notifyApplicationSubmitted(userId, (application._id as any).toString());

    // Log activity
    await ActivityService.logApplicationSubmitted(userId, (application._id as any).toString());

    console.log('✅ Application submitted and notification sent');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application',
    });
  }
};

/**
 * Update application (Applicant only, before review)
 */
export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const application = await Application.findOne({ _id: id, userId });

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Can only update pending applications
    if (application.status !== ApplicationStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: 'Cannot update application after review has started',
      });
      return;
    }

    // Update fields
    Object.assign(application, req.body);
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application',
    });
  }
};

/**
 * Get user's own application
 */
export const getMyApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const application = await Application.findOne({ userId })
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'No application found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get my application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application',
    });
  }
};

/**
 * Get application by user ID (for admin or own user)
 */
export const getApplicationByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requesterId = req.user?.id;

    if (!requesterId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Allow users to get their own application or admins to get any
    const isOwnApplication = userId === requesterId;
    const isAdmin = req.user?.role?.includes(UserRole.ADMIN) || req.user?.role?.includes(UserRole.MANAGER);

    if (!isOwnApplication && !isAdmin) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only view your own application',
      });
      return;
    }

    const application = await Application.findOne({ userId })
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'No application found for this user',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get application by user ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application',
    });
  }
};

/**
 * Get all applications (Admin/Manager only)
 */
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('userId', 'email isActive role membershipInfo') // ✅ Fix: Added role and membershipInfo
        .populate('reviewedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Application.countDocuments(query),
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
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get applications',
    });
  }
};

/**
 * Get single application by ID (Admin/Manager only)
 */
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('userId', 'email isActive createdAt')
      .populate('reviewedBy', 'firstName lastName email');

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application',
    });
  }
};

/**
 * Review application - Change status to under review (Admin/Manager only)
 */
export const reviewApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reviewerId = req.user?.id;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    if (application.status !== ApplicationStatus.PENDING) {
      res.status(400).json({
        success: false,
        error: 'Application is not pending',
      });
      return;
    }

    application.status = ApplicationStatus.UNDER_REVIEW;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated to under review',
      data: application,
    });
  } catch (error: any) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review application',
    });
  }
};

/**
 * Approve application (Admin/Manager only)
 * NOTE: User remains APPLICANT until promoted to CLUB_MEMBER via membership endpoint
 */
export const approveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    if (application.status === ApplicationStatus.APPROVED) {
      res.status(400).json({
        success: false,
        error: 'Application already approved',
      });
      return;
    }

    // Update application status
    application.status = ApplicationStatus.APPROVED;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;

    await application.save();

    // Update user profile with application data (keep APPLICANT role)
    const user = await User.findById(application.userId);
    if (user) {
      console.log('✅ Found user:', user.email);

      // Update user profile with application data
      user.phoneNumber = application.phoneNumber;
      user.university = application.university;
      user.major = application.major;
      user.studentId = application.studentId;
      user.expertise = application.technicalSkills;

      await user.save();
      console.log('✅ User profile updated');

      // Send notification to user about approval (with error handling)
      const userIdString = application.userId.toString();
      console.log('📧 Sending approval notification to user:', userIdString);

      try {
        await NotificationService.notifyApplicationApproved(
          userIdString,
          'approved'
        );
        console.log('✅ Notification sent');
      } catch (notifError: any) {
        console.error('⚠️ Notification error (non-critical):', notifError.message);
      }

      // Log activity (with error handling)
      try {
        await ActivityService.logApplicationApproved(
          userIdString,
          (application._id as any).toString(),
          'approved'
        );
        console.log('✅ Activity logged');
      } catch (activityError: any) {
        console.error('⚠️ Activity log error (non-critical):', activityError.message);
      }
    } else {
      console.warn('⚠️ User not found for application:', application.userId);
    }

    res.status(200).json({
      success: true,
      message: 'Application approved successfully. User can now be promoted to Club Member.',
      data: {
        application,
        user: user ? {
          id: user._id,
          email: user.email,
          roles: user.role,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('❌ Approve application error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to approve application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Reject application (Admin/Manager only)
 */
export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!reviewNotes) {
      res.status(400).json({
        success: false,
        error: 'Review notes are required for rejection',
      });
      return;
    }

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    if (application.status === ApplicationStatus.REJECTED) {
      res.status(400).json({
        success: false,
        error: 'Application already rejected',
      });
      return;
    }

    application.status = ApplicationStatus.REJECTED;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;

    await application.save();
    console.log('✅ Application rejected and saved');

    // Send notification to user about rejection (with error handling)
    const userIdString = application.userId.toString();
    console.log('📧 Sending rejection notification to user:', userIdString);

    try {
      await NotificationService.notifyApplicationRejected(
        userIdString,
        reviewNotes
      );
      console.log('✅ Notification sent');
    } catch (notifError: any) {
      console.error('⚠️ Notification error (non-critical):', notifError.message);
    }

    // Log activity (with error handling)
    try {
      await ActivityService.logApplicationRejected(
        userIdString,
        (application._id as any).toString(),
        reviewNotes
      );
      console.log('✅ Activity logged');
    } catch (activityError: any) {
      console.error('⚠️ Activity log error (non-critical):', activityError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application,
    });
  } catch (error: any) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject application',
    });
  }
};

/**
 * Get application statistics (Admin/Manager/Director only)
 */
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [total, pending, underReview, approved, rejected] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: ApplicationStatus.PENDING }),
      Application.countDocuments({ status: ApplicationStatus.UNDER_REVIEW }),
      Application.countDocuments({ status: ApplicationStatus.APPROVED }),
      Application.countDocuments({ status: ApplicationStatus.REJECTED }),
    ]);

    // Calculate approval rate
    const totalReviewed = approved + rejected;
    const approvalRate = totalReviewed > 0 ? Math.round((approved / totalReviewed) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        approvalRate,
      },
    });
  } catch (error: any) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
    });
  }
};

/**
 * Bulk approve applications (Admin/Manager only)
 */
export const bulkApproveApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationIds, reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Application IDs are required',
      });
      return;
    }

    const results = await Promise.allSettled(
      applicationIds.map(async (id: string) => {
        const application = await Application.findById(id).populate('userId', 'email');

        if (!application) {
          throw new Error(`Application ${id} not found`);
        }

        if (application.status === ApplicationStatus.APPROVED) {
          throw new Error(`Application ${id} already approved`);
        }

        // Update application
        application.status = ApplicationStatus.APPROVED;
        application.reviewedBy = reviewerId as any;
        application.reviewedAt = new Date();
        if (reviewNotes) application.reviewNotes = reviewNotes;
        await application.save();

        // Update user profile (keep APPLICANT role)
        const user = await User.findById(application.userId);
        if (user) {
          await user.save();

          // Send notifications
          const userIdString = application.userId.toString();
          console.log('📧 Bulk: Sending notifications to user:', userIdString);

          await NotificationService.notifyApplicationApproved(
            userIdString,
            'approved'
          );

          await NotificationService.notifyRoleChanged(
            userIdString,
            Array.isArray(user.role) ? user.role.join(', ') : user.role
          );
        }

        return { id, success: true };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `${successful} application(s) approved, ${failed} failed`,
      data: { successful, failed, results },
    });
  } catch (error: any) {
    console.error('Bulk approve error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve applications',
    });
  }
};

/**
 * Bulk reject applications (Admin/Manager only)
 */
export const bulkRejectApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationIds, reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Application IDs are required',
      });
      return;
    }

    if (!reviewNotes || !reviewNotes.trim()) {
      res.status(400).json({
        success: false,
        error: 'Review notes are required for rejection',
      });
      return;
    }

    const results = await Promise.allSettled(
      applicationIds.map(async (id: string) => {
        const application = await Application.findById(id).populate('userId', 'email');

        if (!application) {
          throw new Error(`Application ${id} not found`);
        }

        if (application.status === ApplicationStatus.REJECTED) {
          throw new Error(`Application ${id} already rejected`);
        }

        // Update application
        application.status = ApplicationStatus.REJECTED;
        application.reviewedBy = reviewerId as any;
        application.reviewedAt = new Date();
        application.reviewNotes = reviewNotes;
        await application.save();

        // Send notification
        const userIdString = application.userId.toString();
        console.log('📧 Bulk: Sending rejection notification to user:', userIdString);

        await NotificationService.notifyApplicationRejected(
          userIdString,
          reviewNotes
        );

        return { id, success: true };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `${successful} application(s) rejected, ${failed} failed`,
      data: { successful, failed, results },
    });
  } catch (error: any) {
    console.error('Bulk reject error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject applications',
    });
  }
};


/**
 * Update application details (Director only)
 */
export const updateApplicationDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phoneNumber',
      'university', 'major', 'degree', 'studentId'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (application as any)[field] = updates[field];
      }
    });

    await application.save();

    // Log activity (optional - using existing method)
    try {
      await ActivityService.logApplicationSubmitted(
        req.user?.id || '',
        id
      );
    } catch (error) {
      console.error('Activity log error:', error);
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Change application status (Director only)
 */
export const changeApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const reviewerId = req.user?.id;

    if (!status) {
      res.status(400).json({
        success: false,
        error: 'Status is required',
      });
      return;
    }

    if (!reviewNotes) {
      res.status(400).json({
        success: false,
        error: 'Review notes are required',
      });
      return;
    }

    // Validate status
    const validStatuses = Object.values(ApplicationStatus);
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
      return;
    }

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        error: 'Application not found',
      });
      return;
    }

    const oldStatus = application.status;
    application.status = status;
    application.reviewedBy = reviewerId ? new mongoose.Types.ObjectId(reviewerId) : undefined;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes;

    await application.save();

    // Send notification based on new status
    const userIdString = application.userId.toString();
    try {
      if (status === ApplicationStatus.APPROVED) {
        await NotificationService.notifyApplicationApproved(userIdString, 'approved');

        // Update user role if approved
        const user = await User.findById(application.userId);
        if (user && !user.role.includes(UserRole.CLUB_MEMBER)) {
          user.role.push(UserRole.CLUB_MEMBER);
          await user.save();
        }
      } else if (status === ApplicationStatus.REJECTED) {
        await NotificationService.notifyApplicationRejected(userIdString, reviewNotes);
      } else {
        // For other statuses, use generic notification
        await NotificationService.notifyApplicationSubmitted(userIdString, id);
      }
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }

    // Log activity (optional - using existing method)
    try {
      await ActivityService.logApplicationSubmitted(
        reviewerId || '',
        id
      );
    } catch (activityError) {
      console.error('Activity log error:', activityError);
    }

    res.status(200).json({
      success: true,
      message: `Application status changed to ${status}`,
      data: application,
    });
  } catch (error: any) {
    console.error('Change status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change application status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
