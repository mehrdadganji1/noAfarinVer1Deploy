import { Response } from 'express';
import Training from '../models/Training';
import { AuthRequest } from '../middleware/auth';
import NotificationClient from '../utils/notificationClient';

// Create notification client instance
const notificationClient = new NotificationClient();

export const getAllTrainings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, level, status, page = 1, limit = 10 } = req.query;
    const query: any = {};
    if (type) query.type = type;
    if (level) query.level = level;
    if (status) query.status = status;

    const trainings = await Training.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Training.countDocuments(query);

    res.json({
      success: true,
      data: { trainings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching trainings' });
  }
};

export const getTrainingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      res.status(404).json({ success: false, error: 'Training not found' });
      return;
    }
    res.json({ success: true, data: training });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching training' });
  }
};

export const createTraining = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Re-enable role check in production
    // if (!req.user!.role.includes('admin') && !req.user!.role.includes('faculty')) {
    //   res.status(403).json({ success: false, error: 'Forbidden' });
    //   return;
    // }
    const trainingData = {
      ...req.body,
      createdBy: req.user!.id,
    };
    
    const training = await Training.create(trainingData);
    
    console.log('📧 Sending training creation notification');
    
    // Send notification (to creator for now)
    await notificationClient.notifyTrainingCreated(
      [req.user!.id],
      training.title,
      (training._id as any).toString()
    );
    
    console.log('✅ Training created and notification sent');
    
    res.status(201).json({ success: true, data: training });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error creating training' });
  }
};

export const updateTraining = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Training not found' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating training' });
  }
};

export const deleteTraining = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Training.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Training deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error deleting training' });
  }
};

export const enrollTraining = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      res.status(404).json({ success: false, error: 'Training not found' });
      return;
    }

    if (training.enrolledUsers.some((id: any) => id.toString() === req.user!.id)) {
      res.status(400).json({ success: false, error: 'Already enrolled' });
      return;
    }

    training.enrolledUsers.push(req.user!.id as any);
    await training.save();
    
    // Send enrollment notification
    await notificationClient.notifyTrainingEnrollment(
      req.user!.id,
      training.title,
      (training._id as any).toString()
    );
    
    res.json({ success: true, message: 'Enrolled successfully', data: training });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error enrolling in training' });
  }
};

export const completeTraining = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      res.status(404).json({ success: false, error: 'Training not found' });
      return;
    }

    if (!training.completedUsers.some((id: any) => id.toString() === req.user!.id)) {
      training.completedUsers.push(req.user!.id as any);
      await training.save();
      
      // Send completion notification
      await notificationClient.notifyTrainingCompleted(
        req.user!.id,
        training.title,
        (training._id as any).toString()
      );
    }

    res.json({ success: true, message: 'Training completed', data: training });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error completing training' });
  }
};
