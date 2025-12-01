import { Response } from 'express';
import Team from '../models/Team';
import { AuthRequest } from '../middleware/auth';
import NotificationClient from '../utils/notificationClient';

// Create notification client instance
const notificationClient = new NotificationClient();

export const getAllTeams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, phase, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (status) query.status = status;
    if (phase) query.phase = phase;

    const teams = await Team.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Team.countDocuments(query);

    res.json({
      success: true,
      data: { teams, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching teams' });
  }
};

export const getTeamById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching team' });
  }
};

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const teamData = {
      ...req.body,
      members: [{ userId, role: 'founder', joinedAt: new Date() }],
    };

    const team = await Team.create(teamData);
    
    console.log('📧 Sending team creation notification:', {
      teamId: team._id,
      teamName: team.name,
      userId,
    });
    
    // Send notification to team founder
    await notificationClient.notifyTeamCreated([userId], team.name, (team._id as any).toString());
    
    console.log('✅ Team created and notification sent');
    
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ success: false, error: 'Error creating team' });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ success: false, error: 'Team not found' });
      return;
    }

    const isFounder = team.members.some(
      m => m.userId === req.user!.id && m.role === 'founder'
    );

    const isAdmin = req.user!.role.includes('admin');
    const isDirector = req.user!.role.includes('director');

    if (!isFounder && !isAdmin && !isDirector) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating team' });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error deleting team' });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $push: { members: { userId, role, joinedAt: new Date() } } },
      { new: true }
    );
    
    if (team) {
      // Send notification to the new member
      await notificationClient.notifyMemberAdded(
        userId,
        team.name,
        (team._id as any).toString(),
        req.user!.id
      );
    }
    
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error adding member' });
  }
};

export const removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id);
    
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: { userId: req.params.userId } } },
      { new: true }
    );
    
    if (team) {
      // Send notification to the removed member
      await notificationClient.notifyMemberRemoved(
        req.params.userId,
        team.name
      );
    }
    
    res.json({ success: true, data: updatedTeam });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error removing member' });
  }
};

export const addMentor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { mentorId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $push: { mentors: mentorId } },
      { new: true }
    );
    
    if (team) {
      // Send notification to the mentor
      await notificationClient.notifyMentorAssigned(
        mentorId,
        team.name,
        (team._id as any).toString()
      );
    }
    
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error adding mentor' });
  }
};
