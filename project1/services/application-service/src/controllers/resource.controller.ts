import { Request, Response } from 'express';
import Resource from '../models/Resource';

/**
 * Get all resources
 */
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user.role;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    // Build filter based on user role
    const filter: any = { isActive: true };
    
    // Applicants can see public and applicants resources
    if (userRole.includes('applicant') && !userRole.includes('club_member')) {
      filter.type = { $in: ['public', 'applicants'] };
    }
    // Club members can see all except admin-only
    else if (userRole.includes('club_member')) {
      filter.type = { $in: ['public', 'members_only', 'applicants'] };
    }

    if (category) {
      filter.category = category;
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Resource.countDocuments(filter);

    res.json({
      success: true,
      data: resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت منابع',
    });
  }
};

/**
 * Get resource by ID
 */
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'منبع یافت نشد',
      });
      return;
    }

    // Increment views
    resource.views += 1;
    await resource.save();

    res.json({
      success: true,
      data: resource,
    });
  } catch (error: any) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت منبع',
    });
  }
};

/**
 * Download resource
 */
export const downloadResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'منبع یافت نشد',
      });
      return;
    }

    // Increment downloads
    resource.downloads += 1;
    await resource.save();

    res.json({
      success: true,
      data: {
        url: resource.fileUrl || resource.externalUrl,
      },
    });
  } catch (error: any) {
    console.error('Download resource error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در دانلود منبع',
    });
  }
};

/**
 * Create resource (Admin/Manager)
 */
export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const userName = `${(req as any).user.firstName || ''} ${(req as any).user.lastName || ''}`.trim();
    
    const resource = await Resource.create({
      ...req.body,
      author: {
        userId,
        name: userName,
      },
    });

    res.status(201).json({
      success: true,
      message: 'منبع ایجاد شد',
      data: resource,
    });
  } catch (error: any) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد منبع',
    });
  }
};

/**
 * Update resource (Admin/Manager)
 */
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'منبع یافت نشد',
      });
      return;
    }

    res.json({
      success: true,
      message: 'منبع به‌روزرسانی شد',
      data: resource,
    });
  } catch (error: any) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در به‌روزرسانی منبع',
    });
  }
};

/**
 * Delete resource (Admin/Manager)
 */
export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      res.status(404).json({
        success: false,
        error: 'منبع یافت نشد',
      });
      return;
    }

    res.json({
      success: true,
      message: 'منبع حذف شد',
    });
  } catch (error: any) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      error: 'خطا در حذف منبع',
    });
  }
};
