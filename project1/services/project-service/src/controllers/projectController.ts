import { Response } from 'express';
import Project, { ProjectStatus, MilestoneStatus, MemberRole } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// 1. Get all projects with filters
export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      category,
      status,
      search,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    console.log('📋 Get all projects request:', { category, status, search, page, limit, user: req.user?.id });

    const query: any = {};

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search as string };
    }

    // Only show public projects (unless admin/owner)
    if (!req.user?.role?.includes('admin')) {
      query.$or = [
        { isPublic: true },
        { createdBy: req.user?.id },
        { 'teamMembers.userId': req.user?.id },
      ];
    }

    console.log('🔍 Query:', JSON.stringify(query));

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    // Populate with error handling
    let projects = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    console.log('✅ Found projects:', projects.length);

    // Try to populate user data, but don't fail if User model doesn't exist
    try {
      projects = await Project.find(query)
        .populate('createdBy', 'firstName lastName avatar email')
        .populate('teamMembers.userId', 'firstName lastName avatar email')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean();
      console.log('✅ Populated user data');
    } catch (populateError) {
      console.warn('⚠️ Could not populate user data:', populateError);
      // Continue with unpopulated data
    }

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('❌ Get projects error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, error: 'خطا در دریافت پروژه‌ها', details: error.message });
  }
};

// 2. Get project by ID
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let project = await Project.findById(req.params.id).lean();

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Try to populate, but don't fail if it doesn't work
    try {
      project = await Project.findById(req.params.id)
        .populate('createdBy', 'firstName lastName avatar email')
        .populate('teamMembers.userId', 'firstName lastName avatar email')
        .populate('milestones.assignedTo', 'firstName lastName avatar')
        .lean();
    } catch (populateError) {
      console.warn('⚠️ Could not populate user data for project:', populateError);
    }

    // Check if user can view this project
    if (project && !project.isPublic) {
      const isTeamMember = project.teamMembers?.some(
        (member: any) => member.userId?._id?.toString() === req.user?.id || member.userId?.toString() === req.user?.id
      );
      const isCreator = project.createdBy?._id?.toString() === req.user?.id || project.createdBy?.toString() === req.user?.id;
      const isAdmin = req.user?.role?.includes('admin');

      if (!isTeamMember && !isCreator && !isAdmin) {
        res.status(403).json({ success: false, error: 'شما دسترسی به این پروژه ندارید' });
        return;
      }
    }

    // Increment view count
    await Project.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json({ success: true, data: project });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت پروژه' });
  }
};

// 3. Get my projects
export const getMyProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'احراز هویت لازم است' });
      return;
    }

    const { status, page = 1, limit = 12 } = req.query;
    const query: any = {
      $or: [
        { createdBy: req.user.id },
        { 'teamMembers.userId': req.user.id },
      ],
    };

    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    let projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Try to populate
    try {
      projects = await Project.find(query)
        .populate('createdBy', 'firstName lastName avatar')
        .populate('teamMembers.userId', 'firstName lastName avatar')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } catch (populateError) {
      console.warn('⚠️ Could not populate user data:', populateError);
    }

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Get my projects error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت پروژه‌های شما' });
  }
};

// 4. Create project
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'احراز هویت لازم است' });
      return;
    }

    const projectData = {
      ...req.body,
      createdBy: req.user.id,
      teamMembers: [
        {
          userId: req.user.id,
          role: MemberRole.LEADER,
          joinedAt: new Date(),
        },
      ],
    };

    const project = await Project.create(projectData);

    // Award XP for project creation (async, don't block)
    try {
      const axios = require('axios');
      await axios.post(
        process.env.XP_SERVICE_URL || 'http://localhost:3011' + '/api/xp/webhooks/project/create',
        {
          userId: req.user.id,
          projectId: project._id.toString(),
        },
        { timeout: 5000 }
      );
      console.log('✅ XP awarded for project creation');
    } catch (xpError: any) {
      console.error('⚠️ Failed to award XP (non-critical):', xpError.message);
      // Don't fail the main operation
    }

    res.status(201).json({
      success: true,
      message: 'پروژه با موفقیت ایجاد شد',
      data: project,
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'خطا در ایجاد پروژه' });
  }
};

// 5. Update project
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Check permission
    const isCreator = project.createdBy.toString() === req.user?.id;
    const isLeader = project.teamMembers.some(
      (member: any) =>
        member.userId.toString() === req.user?.id && member.role === MemberRole.LEADER
    );
    const isAdmin = req.user?.role?.includes('admin');

    if (!isCreator && !isLeader && !isAdmin) {
      res.status(403).json({ success: false, error: 'شما مجاز به ویرایش این پروژه نیستید' });
      return;
    }

    const oldStatus = project.status;
    let updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    // Award XP for project completion (async, don't block)
    if (oldStatus !== ProjectStatus.COMPLETED && req.body.status === ProjectStatus.COMPLETED) {
      try {
        const axios = require('axios');
        await axios.post(
          process.env.XP_SERVICE_URL || 'http://localhost:3011' + '/api/xp/webhooks/project/complete',
          {
            userId: req.user?.id,
            projectId: req.params.id,
          },
          { timeout: 5000 }
        );
        console.log('✅ XP awarded for project completion');
      } catch (xpError: any) {
        console.error('⚠️ Failed to award XP (non-critical):', xpError.message);
      }
    }

    // Try to populate
    try {
      updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate('createdBy', 'firstName lastName avatar')
        .populate('teamMembers.userId', 'firstName lastName avatar')
        .lean();
    } catch (populateError) {
      console.warn('⚠️ Could not populate user data:', populateError);
    }

    res.json({
      success: true,
      message: 'پروژه با موفقیت بروزرسانی شد',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'خطا در بروزرسانی پروژه' });
  }
};

// 6. Delete project
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Only creator or admin can delete
    const isCreator = project.createdBy.toString() === req.user?.id;
    const isAdmin = req.user?.role?.includes('admin');

    if (!isCreator && !isAdmin) {
      res.status(403).json({ success: false, error: 'شما مجاز به حذف این پروژه نیستید' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'پروژه با موفقیت حذف شد' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف پروژه' });
  }
};

// 7. Join project
export const joinProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'احراز هویت لازم است' });
      return;
    }

    const { role = MemberRole.DEVELOPER } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Check if already member
    const isMember = project.teamMembers.some(
      (member: any) => member.userId.toString() === req.user?.id
    );

    if (isMember) {
      res.status(400).json({ success: false, error: 'شما قبلاً عضو این پروژه هستید' });
      return;
    }

    // Check team size
    if (project.teamMembers.length >= project.maxTeamSize) {
      res.status(400).json({ success: false, error: 'تیم این پروژه کامل است' });
      return;
    }

    project.teamMembers.push({
      userId: req.user.id as any,
      role,
      joinedAt: new Date(),
    });

    await project.save();

    res.json({
      success: true,
      message: 'شما با موفقیت به پروژه پیوستید',
      data: project,
    });
  } catch (error: any) {
    console.error('Join project error:', error);
    res.status(500).json({ success: false, error: 'خطا در پیوستن به پروژه' });
  }
};

// 8. Leave project
export const leaveProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'احراز هویت لازم است' });
      return;
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Can't leave if creator
    if (project.createdBy.toString() === req.user.id) {
      res.status(400).json({ success: false, error: 'سازنده پروژه نمی‌تواند آن را ترک کند' });
      return;
    }

    // Remove from team
    project.teamMembers = project.teamMembers.filter(
      (member: any) => member.userId.toString() !== req.user?.id
    );

    await project.save();

    res.json({ success: true, message: 'شما با موفقیت از پروژه خارج شدید' });
  } catch (error: any) {
    console.error('Leave project error:', error);
    res.status(500).json({ success: false, error: 'خطا در خروج از پروژه' });
  }
};

// 9. Update milestone
export const updateMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { milestoneId } = req.params;
    const { status, completedAt } = req.body;

    const project = await Project.findOne({ 'milestones._id': milestoneId });

    if (!project) {
      res.status(404).json({ success: false, error: 'مایلستون یافت نشد' });
      return;
    }

    // Check permission
    const isMember = project.teamMembers.some(
      (member: any) => member.userId.toString() === req.user?.id
    );
    const isAdmin = req.user?.role?.includes('admin');

    if (!isMember && !isAdmin) {
      res.status(403).json({ success: false, error: 'شما مجاز به ویرایش این مایلستون نیستید' });
      return;
    }

    const milestone = (project.milestones as any).id(milestoneId);
    if (milestone) {
      if (status) milestone.status = status;
      if (status === MilestoneStatus.COMPLETED && completedAt) {
        milestone.completedAt = completedAt;
      }
    }

    // Recalculate progress
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(
      (m: any) => m.status === MilestoneStatus.COMPLETED
    ).length;
    project.progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    await project.save();

    // Award XP for milestone completion (async, don't block)
    if (status === MilestoneStatus.COMPLETED) {
      try {
        const axios = require('axios');
        await axios.post(
          process.env.XP_SERVICE_URL || 'http://localhost:3011' + '/api/xp/webhooks/milestone/complete',
          {
            userId: req.user?.id,
            milestoneId: milestoneId,
          },
          { timeout: 5000 }
        );
        console.log('✅ XP awarded for milestone completion');
      } catch (xpError: any) {
        console.error('⚠️ Failed to award XP (non-critical):', xpError.message);
      }
    }

    res.json({
      success: true,
      message: 'مایلستون با موفقیت بروزرسانی شد',
      data: project,
    });
  } catch (error: any) {
    console.error('Update milestone error:', error);
    res.status(500).json({ success: false, error: 'خطا در بروزرسانی مایلستون' });
  }
};

// 10. Get project stats
export const getProjectStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = await Project.countDocuments();
    const planning = await Project.countDocuments({ status: ProjectStatus.PLANNING });
    const inProgress = await Project.countDocuments({ status: ProjectStatus.IN_PROGRESS });
    const completed = await Project.countDocuments({ status: ProjectStatus.COMPLETED });

    // User's projects (if authenticated)
    let myProjects = 0;
    let myActiveProjects = 0;

    if (req.user?.id) {
      myProjects = await Project.countDocuments({
        $or: [
          { createdBy: req.user.id },
          { 'teamMembers.userId': req.user.id },
        ],
      });

      myActiveProjects = await Project.countDocuments({
        $or: [
          { createdBy: req.user.id },
          { 'teamMembers.userId': req.user.id },
        ],
        status: { $in: [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS] },
      });
    }

    res.json({
      success: true,
      data: {
        total,
        planning,
        inProgress,
        completed,
        myProjects,
        myActiveProjects,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت آمار' });
  }
};

// 11. Add milestone
export const addMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const milestoneData = req.body;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Check permission
    const isMember = project.teamMembers.some(
      (member: any) => member.userId.toString() === req.user?.id
    );
    const isAdmin = req.user?.role?.includes('admin');

    if (!isMember && !isAdmin) {
      res.status(403).json({ success: false, error: 'شما مجاز به افزودن مایلستون نیستید' });
      return;
    }

    project.milestones.push(milestoneData);
    await project.save();

    res.json({
      success: true,
      message: 'مایلستون با موفقیت اضافه شد',
      data: project,
    });
  } catch (error: any) {
    console.error('Add milestone error:', error);
    res.status(500).json({ success: false, error: 'خطا در افزودن مایلستون' });
  }
};

// 12. Delete milestone
export const deleteMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ success: false, error: 'پروژه یافت نشد' });
      return;
    }

    // Check permission
    const isMember = project.teamMembers.some(
      (member: any) => member.userId.toString() === req.user?.id
    );
    const isAdmin = req.user?.role?.includes('admin');

    if (!isMember && !isAdmin) {
      res.status(403).json({ success: false, error: 'شما مجاز به حذف مایلستون نیستید' });
      return;
    }

    project.milestones = project.milestones.filter(
      (m: any) => m._id.toString() !== milestoneId
    );

    await project.save();

    res.json({
      success: true,
      message: 'مایلستون با موفقیت حذف شد',
      data: project,
    });
  } catch (error: any) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ success: false, error: 'خطا در حذف مایلستون' });
  }
};