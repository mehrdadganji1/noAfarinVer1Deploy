import express from 'express';
import { getAdminStats, getUserGrowth, getActivityLog } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

/**
 * @route   GET /api/stats/admin
 * @desc    Get comprehensive admin statistics
 * @access  Admin, Manager
 */
router.get(
  '/admin',
  authenticate,
  requireRole(['admin', 'manager']),
  getAdminStats
);

/**
 * @route   GET /api/stats/user-growth
 * @desc    Get user growth data for charts
 * @access  Admin, Manager
 */
router.get(
  '/user-growth',
  authenticate,
  requireRole(['admin', 'manager']),
  getUserGrowth
);

/**
 * @route   GET /api/stats/activity-log
 * @desc    Get system activity log
 * @access  Admin, Manager
 */
router.get(
  '/activity-log',
  authenticate,
  requireRole(['admin', 'manager']),
  getActivityLog
);

export default router;
