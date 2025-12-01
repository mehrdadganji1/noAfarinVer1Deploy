import express from 'express';
import { seedMemberProfiles } from '../controllers/seedController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Seed member profiles (Admin only)
router.post(
  '/member-profiles',
  authenticate,
  authorize(UserRole.ADMIN),
  seedMemberProfiles
);

export default router;
