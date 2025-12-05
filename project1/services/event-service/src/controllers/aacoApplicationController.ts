import { Request, Response } from 'express';
import AACOApplication, { AACOApplicationStatus } from '../models/AACOApplication';

// Extended Request interface with user property
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    id: string;
    email: string;
    role: string | string[];
  };
}

/**
 * Submit or update AACo application
 */
export const submitApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('📝 AACo Application Submit Request:', {
      user: req.user,
      body: req.body,
      headers: req.headers.authorization ? 'Present' : 'Missing'
    });

    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      console.error('❌ No userId found in request');
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized - No user ID found' 
      });
    }

    console.log('💾 Saving application for user:', userId);

    // Check if application already exists
    const existingApplication = await AACOApplication.findOne({ userId });

    let application;
    if (existingApplication) {
      console.log('📝 Updating existing application');
      
      // Prepare update data
      const updateData: any = {
        ...req.body,
        userId,
        updatedAt: new Date(),
      };
      
      // If application was approved and now being edited, reset to submitted
      if (existingApplication.status === AACOApplicationStatus.APPROVED) {
        updateData.status = AACOApplicationStatus.SUBMITTED;
        console.log('⚠️ Application was approved, resetting to submitted status');
      } else {
        // Keep current status or set to submitted
        updateData.status = existingApplication.status || AACOApplicationStatus.SUBMITTED;
      }
      
      // Update existing application
      application = await AACOApplication.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      console.log('✨ Creating new application');
      // Create new application with submitted status
      const applicationData = {
        ...req.body,
        userId,
        status: AACOApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      };
      application = await AACOApplication.create(applicationData);
    }

    if (!application) {
      console.error('❌ Failed to save application');
      return res.status(500).json({
        success: false,
        error: 'Failed to save application'
      });
    }

    console.log('✅ Application saved successfully:', application._id);

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error: any) {
    console.error('❌ Error submitting AACo application:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: any = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        validationErrors
      });
    }
    
    // Handle duplicate key error (user already has application)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: 'You have already submitted an application'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error submitting application',
      details: error.message 
    });
  }
};

/**
 * Get user's AACo application
 */
export const getMyApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }

    const application = await AACOApplication.findOne({ userId });

    if (!application) {
      return res.status(404).json({ 
        success: false,
        error: 'No application found' 
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Error fetching AACo application:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching application',
      details: error.message 
    });
  }
};

/**
 * Update user's AACo application
 */
export const updateApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('📝 AACo Application Update Request:', {
      user: req.user,
      applicationId: req.params.id,
      body: req.body
    });

    const userId = req.user?.userId || req.user?.id;
    const applicationId = req.params.id;
    
    if (!userId) {
      console.error('❌ No userId found in request');
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized - No user ID found' 
      });
    }

    // Find the application and verify ownership
    const existingApplication = await AACOApplication.findOne({ 
      _id: applicationId, 
      userId 
    });

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        error: 'Application not found or access denied'
      });
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      userId, // Ensure userId stays the same
      updatedAt: new Date(),
    };

    // If application was approved and now being edited, reset to submitted
    if (existingApplication.status === AACOApplicationStatus.APPROVED) {
      updateData.status = AACOApplicationStatus.SUBMITTED;
      console.log('📝 Application was approved, resetting to submitted status');
    }

    console.log('💾 Updating application:', applicationId);

    const updatedApplication = await AACOApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedApplication) {
      console.error('❌ Failed to update application');
      return res.status(500).json({
        success: false,
        error: 'Failed to update application'
      });
    }

    console.log('✅ Application updated successfully:', updatedApplication._id);

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApplication,
      statusChanged: existingApplication.status === AACOApplicationStatus.APPROVED
    });
  } catch (error: any) {
    console.error('❌ Error updating AACo application:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: any = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error updating application',
      details: error.message 
    });
  }
};

/**
 * Check if user has submitted AACo application
 */
export const checkApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const application = await AACOApplication.findOne({ userId });

    res.status(200).json({
      hasApplication: !!application,
      status: application?.status || null,
      submittedAt: application?.submittedAt || null,
    });
  } catch (error: any) {
    console.error('Error checking AACo application status:', error);
    res.status(500).json({ 
      message: 'Error checking application status',
      error: error.message 
    });
  }
};

/**
 * Get all AACo applications (Admin/Director only)
 */
export const getAllApplications = async (req: AuthenticatedRequest, res: Response) => {
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
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      AACOApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AACOApplication.countDocuments(query),
    ]);

    res.status(200).json({
      applications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching AACo applications:', error);
    res.status(500).json({ 
      message: 'Error fetching applications',
      error: error.message 
    });
  }
};

/**
 * Update application status (Admin/Director only)
 * 
 * Flow:
 * - approved: پیش ثبت‌نام تایید شده، کاربر وارد مرحله مصاحبه می‌شود
 * - نقش کاربر تغییر نمی‌کند (همچنان applicant می‌ماند)
 * - بعد از مصاحبه و تایید نهایی، نقش به club_member تغییر می‌کند
 */
export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const reviewerId = req.user?.userId || req.user?.id;

    // First get the application to check userId
    const existingApplication = await AACOApplication.findById(id);
    if (!existingApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = await AACOApplication.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Note: تایید پیش ثبت‌نام AACO به معنی تایید نهایی نیست
    // کاربر همچنان در داشبورد pending می‌ماند و وارد مرحله مصاحبه می‌شود
    // نقش کاربر تغییر نمی‌کند (همچنان applicant)
    // بعد از مصاحبه و تایید نهایی، نقش به club_member تغییر خواهد کرد
    
    console.log(`✅ Application status updated to ${status} for userId: ${application.userId}`);
    console.log(`📋 User remains as applicant - will enter interview stage`);

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
      // نقش تغییر نمی‌کند - کاربر وارد مرحله مصاحبه می‌شود
      nextStep: status === AACOApplicationStatus.APPROVED ? 'interview' : null,
    });
  } catch (error: any) {
    console.error('Error updating AACo application status:', error);
    res.status(500).json({ 
      message: 'Error updating application status',
      error: error.message 
    });
  }
};

/**
 * Delete application (Admin only)
 */
export const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await AACOApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting AACo application:', error);
    res.status(500).json({ 
      message: 'Error deleting application',
      error: error.message 
    });
  }
};
