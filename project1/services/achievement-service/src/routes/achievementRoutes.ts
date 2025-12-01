import express from 'express';
import {
  getAllAchievements,
  getAchievementById,
  getUserAchievements,
  checkAndUnlockAchievement,
  createAchievement,
} from '../controllers/achievementController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected routes (must come before dynamic routes)
router.get('/achievements/my/achievements', authenticateToken, getUserAchievements);
router.post('/achievements/create', authenticateToken, createAchievement);
router.post('/achievements/:achievementId/unlock', authenticateToken, checkAndUnlockAchievement);

// Public routes
router.get('/achievements', getAllAchievements);
router.get('/achievements/:id', getAchievementById);

export default router;
