import express from 'express';
import {
  promoteToClubMember,
  getClubMembers,
  getMembershipStats,
  updateMembershipLevel,
  updateMembershipStatus,
  getPromotionHistory
} from '../controllers/membershipController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Test endpoint - NO AUTH for testing
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Membership routes are working!',
    timestamp: new Date().toISOString()
  });
});

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/membership/promote/:userId
 * @desc    Promote applicant to club member
 * @access  Admin only
 */
router.post(
  '/promote/:userId',
  authorize(UserRole.ADMIN),
  promoteToClubMember
);

/**
 * @route   GET /api/membership/members
 * @desc    Get all club members
 * @access  Admin and Club Members
 */
router.get(
  '/members',
  authorize(UserRole.ADMIN, UserRole.CLUB_MEMBER),
  getClubMembers
);

/**
 * @route   GET /api/membership/stats/:userId
 * @desc    Get membership statistics
 * @access  Club Member (own stats) or Admin
 */
router.get(
  '/stats/:userId',
  authorize(UserRole.ADMIN, UserRole.CLUB_MEMBER),
  getMembershipStats
);

/**
 * @route   PUT /api/membership/level/:userId
 * @desc    Update membership level
 * @access  Admin only
 */
router.put(
  '/level/:userId',
  authorize(UserRole.ADMIN),
  updateMembershipLevel
);

/**
 * @route   PUT /api/membership/status/:userId
 * @desc    Update membership status (suspend/activate)
 * @access  Admin only
 */
router.put(
  '/status/:userId',
  authorize(UserRole.ADMIN),
  updateMembershipStatus
);

/**
 * @route   GET /api/membership/history
 * @desc    Get promotion history
 * @access  Admin only
 */
router.get(
  '/history',
  authorize(UserRole.ADMIN),
  getPromotionHistory
);

export default router;
