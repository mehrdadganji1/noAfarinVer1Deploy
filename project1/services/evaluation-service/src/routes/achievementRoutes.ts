import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as achievementController from '../controllers/achievementController';

const router = Router();

// Public routes (optional auth)
router.get('/achievements/stats', optionalAuth, achievementController.getAchievementStats);
router.get('/achievements', optionalAuth, achievementController.getAllAchievements);
router.get('/achievements/user/:userId?', optionalAuth, achievementController.getUserAchievements);
router.get('/achievements/:id', optionalAuth, achievementController.getAchievementById);

// Protected routes
router.post('/achievements', authenticate, achievementController.createAchievement);
router.put('/achievements/:id', authenticate, achievementController.updateAchievement);
router.post('/achievements/:id/award', authenticate, achievementController.awardAchievement);

export default router;
