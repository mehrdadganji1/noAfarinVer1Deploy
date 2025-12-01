import { Router } from 'express';
import {
  getRecentActivities,
  createActivity,
  getActivityStats,
  deleteOldActivities
} from '../controllers/activityController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User activity routes
router.get('/recent', getRecentActivities);
router.get('/stats', getActivityStats);
router.delete('/cleanup', deleteOldActivities);

// Internal route (can be used by other services)
router.post('/log', createActivity);

export default router;
