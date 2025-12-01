import { Response } from 'express';
import Evaluation from '../models/Evaluation';
import { AuthRequest } from '../middleware/auth';
import NotificationClient from '../utils/notificationClient';

// Create notification client instance
const notificationClient = new NotificationClient();

// Helper function to calculate total score
const calculateTotalScore = (criteria: any[]): number => {
  let totalScore = 0;
  let totalWeight = 0;
  
  criteria.forEach((c) => {
    const normalized = (c.score / c.maxScore) * 100;
    totalScore += normalized * c.weight;
    totalWeight += c.weight;
  });
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

export const getAllEvaluations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId, evaluatorId, evaluationType, status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    
    if (teamId) query.teamId = teamId;
    if (evaluatorId) query.evaluatorId = evaluatorId;
    if (evaluationType) query.evaluationType = evaluationType;
    if (status) query.status = status;

    const evaluations = await Evaluation.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Evaluation.countDocuments(query);

    res.json({
      success: true,
      data: { evaluations, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching evaluations' });
  }
};

export const getEvaluationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      res.status(404).json({ success: false, error: 'Evaluation not found' });
      return;
    }
    res.json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching evaluation' });
  }
};

export const createEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId, eventId, evaluationType, criteria, feedback, strengths, weaknesses, recommendations } = req.body;
    
    // Validate required fields
    if (!teamId || !evaluationType || !criteria || criteria.length === 0) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: teamId, evaluationType, and criteria are required' 
      });
      return;
    }

    const totalScore = calculateTotalScore(criteria);

    const evaluation = await Evaluation.create({
      teamId,
      eventId,
      evaluatorId: req.user!.id,
      evaluationType,
      criteria,
      totalScore,
      feedback,
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      recommendations: recommendations || [],
      status: 'draft',
    });

    res.status(201).json({ success: true, data: evaluation });
  } catch (error: any) {
    console.error('Create Evaluation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error creating evaluation',
      details: error.message 
    });
  }
};

export const updateEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      res.status(404).json({ success: false, error: 'Evaluation not found' });
      return;
    }

    if (evaluation.status === 'submitted') {
      res.status(400).json({ success: false, error: 'Cannot update submitted evaluation' });
      return;
    }

    if (req.body.criteria) {
      req.body.totalScore = calculateTotalScore(req.body.criteria);
    }

    const updated = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating evaluation' });
  }
};

export const deleteEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Evaluation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Evaluation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error deleting evaluation' });
  }
};

export const submitEvaluation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      res.status(404).json({ success: false, error: 'Evaluation not found' });
      return;
    }

    if (evaluation.status === 'submitted') {
      res.status(400).json({ success: false, error: 'Evaluation already submitted' });
      return;
    }

    evaluation.status = 'submitted';
    evaluation.submittedAt = new Date();
    await evaluation.save();
    
    console.log('📧 Sending evaluation notification');
    
    // Send notification to team members
    // Note: In real app, you'd fetch team members from Team Service
    // For now, we notify the team ID (you should expand this)
    await notificationClient.notifyEvaluationReceived(
      evaluation.teamId.toString(),
      'Evaluator',
      evaluation.totalScore,
      (evaluation._id as any).toString()
    );
    
    console.log('✅ Evaluation submitted and notification sent');

    res.json({ success: true, data: evaluation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error submitting evaluation' });
  }
};

export const getEvaluationsByTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const evaluations = await Evaluation.find({ teamId: req.params.teamId });
    res.json({ success: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching evaluations' });
  }
};

export const getTeamAverageScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { evaluationType } = req.query;
    
    const match: any = { teamId, status: 'submitted' };
    if (evaluationType) match.evaluationType = evaluationType;

    const result = await Evaluation.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$totalScore' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      res.json({ success: true, data: { avgScore: 0, count: 0 } });
      return;
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error calculating average score' });
  }
};

// Get Leaderboard
export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { evaluationType, limit = 50 } = req.query;
    const query: any = {};
    
    if (evaluationType) {
      query.evaluationType = evaluationType;
    }

    // Aggregate evaluations by teamId
    const leaderboard = await Evaluation.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$teamId',
          avgScore: { $avg: '$totalScore' },
          maxScore: { $max: '$totalScore' },
          minScore: { $min: '$totalScore' },
          evaluationCount: { $count: {} },
          latestEvaluation: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          teamId: '$_id',
          avgScore: { $round: ['$avgScore', 2] },
          maxScore: { $round: ['$maxScore', 2] },
          minScore: { $round: ['$minScore', 2] },
          evaluationCount: 1,
          latestEvaluation: 1,
          _id: 0,
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: Number(limit) },
    ]);

    // Add rank to each team
    const rankedLeaderboard = leaderboard.map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

    res.json({
      success: true,
      data: rankedLeaderboard,
      total: rankedLeaderboard.length,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, error: 'Error fetching leaderboard' });
  }
};
