import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as fundingController from '../controllers/fundingController';

const router = Router();

router.use(authenticate);

router.get('/', fundingController.getAllFundings);
router.post('/', fundingController.applyForFunding);
router.put('/:id/status', fundingController.updateFundingStatus);

export default router;
