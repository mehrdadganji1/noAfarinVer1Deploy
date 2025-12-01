import { Router } from 'express';
import {
  getMyXP,
  addXP,
  getXPHistory,
  getLeaderboard,
  getLevelInfo,
  calculateXP,
  getMyRank,
} from '../controllers/xpController';
import { authenticate } from '../middleware/auth';

const router = Router();

// همه route ها نیاز به احراز هویت دارند
router.use(authenticate);

// User XP routes
router.get('/my/xp', getMyXP);
router.post('/add', addXP);
router.get('/history', getXPHistory);
router.get('/my/rank', getMyRank);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

// Level info
router.get('/level-info/:level', getLevelInfo);

// Calculate XP
router.post('/calculate', calculateXP);

export default router;
