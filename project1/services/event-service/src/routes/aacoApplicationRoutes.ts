import { Router, RequestHandler } from 'express';
import {
  submitApplication,
  getMyApplication,
  updateApplication,
  checkApplicationStatus,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/aacoApplicationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken as RequestHandler);

// Applicant routes
router.post('/submit', submitApplication as RequestHandler);
router.get('/my-application', getMyApplication as RequestHandler);
router.put('/:id', updateApplication as RequestHandler);
router.get('/check-status', checkApplicationStatus as RequestHandler);

// Admin/Director routes
router.get('/', getAllApplications as RequestHandler);
router.patch('/:id/status', updateApplicationStatus as RequestHandler);
router.delete('/:id', deleteApplication as RequestHandler);

export default router;
