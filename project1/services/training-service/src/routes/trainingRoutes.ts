import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as trainingController from '../controllers/trainingController';

const router = Router();

router.use(authenticate);

router.get('/', trainingController.getAllTrainings);
router.post('/', trainingController.createTraining);
router.get('/:id', trainingController.getTrainingById);
router.put('/:id', trainingController.updateTraining);
router.delete('/:id', trainingController.deleteTraining);
router.post('/:id/enroll', trainingController.enrollTraining);
router.post('/:id/complete', trainingController.completeTraining);

export default router;
