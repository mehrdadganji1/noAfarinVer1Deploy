import express from 'express';
import {
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainingAnalytics
} from '../controllers/trainingController';

const router = express.Router();

router.get('/', getTrainings);
router.get('/analytics', getTrainingAnalytics);
router.get('/:id', getTrainingById);
router.post('/', createTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

export default router;
