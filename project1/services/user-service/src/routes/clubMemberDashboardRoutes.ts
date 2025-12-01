import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as dashboardController from '../controllers/clubMemberDashboardController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard stats
router.get('/stats', dashboardController.getDashboardStats);

// Activity timeline
router.get('/timeline', dashboardController.getActivityTimeline);

// Quick stats
router.get('/quick-stats', dashboardController.getQuickStats);

export default router;

