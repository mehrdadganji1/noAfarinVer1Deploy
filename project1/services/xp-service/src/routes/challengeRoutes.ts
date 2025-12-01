import express from 'express';
import {
  getActiveChallenges,
  getMyProgress,
  updateProgress,
  claimReward,
  getChallengeStats,
  createChallenge,
} from '../controllers/challengeController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getActiveChallenges);
router.get('/stats', getChallengeStats);

// Protected routes
router.get('/my-progress', authenticate, getMyProgress);
router.post('/:id/claim', authenticate, claimReward);

// Internal webhook (should be protected in production)
router.post('/progress', updateProgress);

// Admin routes (should add admin middleware)
router.post('/create', createChallenge);

export default router;
