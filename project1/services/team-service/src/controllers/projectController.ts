import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (category) query.category = category;
    if (status) query.status = status;

    const projects = await Project.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('team.leader', 'firstName lastName')
      .populate('team.members', 'firstName lastName');

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
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, error: 'Error fetching projects' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team.leader', 'firstName lastName')
      .populate('team.members', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
      
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'Error fetching project' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user!.id,
      'team.leader': req.user!.id,
      'team.members': [req.user!.id],
    };

    const project = await Project.create(projectData);
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, error: 'Error creating project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Check if user is team leader or admin
    const isLeader = project.team.leader.toString() === req.user!.id;
    if (!isLeader && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, error: 'Error updating project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    const isLeader = project.team.leader.toString() === req.user!.id;
    if (!isLeader && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: 'Error deleting project' });
  }
};

export const joinProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    if (project.team.members.length >= project.team.maxMembers) {
      res.status(400).json({ success: false, error: 'Team is full' });
      return;
    }

    if (project.team.members.some((id: any) => id.toString() === req.user!.id)) {
      res.status(400).json({ success: false, error: 'Already a member' });
      return;
    }

    project.team.members.push(req.user!.id as any);
    await project.save();
    
    res.json({ success: true, message: 'Joined project successfully', data: project });
  } catch (error) {
    console.error('Join project error:', error);
    res.status(500).json({ success: false, error: 'Error joining project' });
  }
};

export const leaveProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Can't leave if you're the leader
    if (project.team.leader.toString() === req.user!.id) {
      res.status(400).json({ success: false, error: 'Leader cannot leave. Transfer leadership first' });
      return;
    }

    if (!project.team.members.some((id: any) => id.toString() === req.user!.id)) {
      res.status(400).json({ success: false, error: 'Not a member' });
      return;
    }

    project.team.members = project.team.members.filter(
      (id: any) => id.toString() !== req.user!.id
    );
    await project.save();
    
    res.json({ success: true, message: 'Left project successfully' });
  } catch (error) {
    console.error('Leave project error:', error);
    res.status(500).json({ success: false, error: 'Error leaving project' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, completed } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Check if user is team member
    const isMember = project.team.members.some((id: any) => id.toString() === req.user!.id);
    if (!isMember && !req.user!.role.includes('admin')) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const taskIndex = project.tasks.findIndex((t: any) => t._id?.toString() === taskId);
    if (taskIndex === -1) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    project.tasks[taskIndex].completed = completed;
    await project.save(); // This will trigger pre-save hook to recalculate progress
    
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, error: 'Error updating task' });
  }
};

export const getProjectStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalProjects = await Project.countDocuments();
    const planningProjects = await Project.countDocuments({ status: 'planning' });
    const inProgressProjects = await Project.countDocuments({ status: 'in-progress' });
    const reviewProjects = await Project.countDocuments({ status: 'review' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    
    // Get user's projects (only if authenticated)
    let userProjects = 0;
    let userLeadingProjects = 0;
    
    if (req.user?.id) {
      userProjects = await Project.countDocuments({
        'team.members': req.user.id
      });
      
      userLeadingProjects = await Project.countDocuments({
        'team.leader': req.user.id
      });
    }

    res.json({
      success: true,
      data: {
        total: totalProjects,
        planning: planningProjects,
        inProgress: inProgressProjects,
        review: reviewProjects,
        completed: completedProjects,
        userProjects,
        userLeading: userLeadingProjects,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Error fetching project stats' });
  }
};
