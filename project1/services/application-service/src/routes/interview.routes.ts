import express from 'express';
import {
  getMyInterviews,
  getUpcomingInterviews,
  getInterviewById,
  confirmInterview,
  requestReschedule,
  cancelInterview,
  createInterview,
  getAllInterviews,
} from '../controllers/interview.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Applicant routes
router.get('/my-interviews', getMyInterviews);
router.get('/upcoming', getUpcomingInterviews);
router.get('/:id', getInterviewById);
router.put('/:id/confirm', confirmInterview);
router.post('/:id/reschedule-request', requestReschedule);

// Admin/Manager/Director routes
router.get('/', authorize('admin', 'manager', 'director'), getAllInterviews);
router.post('/', authorize('admin', 'manager', 'director'), createInterview);
router.put('/:id/cancel', authorize('admin', 'manager', 'director'), cancelInterview);

export default router;
