import express from 'express';
import {
  getMyStreak,
  checkIn,
  getStreakLeaderboard,
  getStreakHistory,
  getStreakStats,
} from '../controllers/streakController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get current user's streak
router.get('/my-streak', authenticate, getMyStreak);

// Check in for today
router.post('/check-in', authenticate, checkIn);

// Get streak leaderboard
router.get('/leaderboard', getStreakLeaderboard);

// Get streak history (calendar view)
router.get('/history', authenticate, getStreakHistory);

// Get streak statistics (admin/public)
router.get('/stats', getStreakStats);

export default router;
