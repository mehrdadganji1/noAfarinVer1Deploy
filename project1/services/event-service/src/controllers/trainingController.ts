import { Request, Response } from 'express';
import Training from '../models/Training';

// Get all trainings with filters
export const getTrainings = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      type, 
      status, 
      level,
      page = 1, 
      limit = 12 
    } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) query.type = type;
    if (status) query.status = status;
    if (level) query.level = level;

    const skip = (Number(page) - 1) * Number(limit);
    
    const trainings = await Training.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Training.countDocuments(query);

    res.json({
      trainings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get training by ID
export const getTrainingById = async (req: Request, res: Response) => {
  try {
    const training = await Training.findById(req.params.id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    res.json(training);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create training
export const createTraining = async (req: Request, res: Response) => {
  try {
    const training = new Training(req.body);
    await training.save();
    res.status(201).json(training);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update training
export const updateTraining = async (req: Request, res: Response) => {
  try {
    const training = await Training.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    res.json(training);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete training
export const deleteTraining = async (req: Request, res: Response) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    res.json({ message: 'Training deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get training analytics
export const getTrainingAnalytics = async (req: Request, res: Response) => {
  try {
    const total = await Training.countDocuments();
    const active = await Training.countDocuments({ status: 'active' });
    const upcoming = await Training.countDocuments({ status: 'upcoming' });
    const completed = await Training.countDocuments({ status: 'completed' });

    const totalParticipants = await Training.aggregate([
      { $group: { _id: null, total: { $sum: '$participants.length' } } }
    ]);

    const avgRating = await Training.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    const byType = await Training.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const byLevel = await Training.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    res.json({
      overview: {
        total,
        active,
        upcoming,
        completed,
        totalParticipants: totalParticipants[0]?.total || 0,
        avgRating: avgRating[0]?.avg || 0
      },
      byType,
      byLevel
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
