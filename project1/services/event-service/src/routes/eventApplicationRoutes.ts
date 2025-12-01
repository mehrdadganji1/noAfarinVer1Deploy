import { Router } from 'express';
import {
  submitEventApplication,
  getMyEventApplications,
  getAllEventApplications,
  getEventApplicationById,
  reviewEventApplication,
  approveEventApplication,
  rejectEventApplication,
  getEventApplicationStats,
  bulkApproveEventApplications,
  bulkRejectEventApplications,
} from '../controllers/eventApplicationController';

const router = Router();

// Public routes (authenticated users)
router.post('/events/:eventId/apply', submitEventApplication);
router.get('/my-event-applications', getMyEventApplications);

// Admin/Director routes
router.get('/event-applications/stats', getEventApplicationStats);
router.get('/event-applications', getAllEventApplications);
router.get('/event-applications/:id', getEventApplicationById);
router.patch('/event-applications/:id/review', reviewEventApplication);
router.patch('/event-applications/:id/approve', approveEventApplication);
router.patch('/event-applications/:id/reject', rejectEventApplication);
router.post('/event-applications/bulk-approve', bulkApproveEventApplications);
router.post('/event-applications/bulk-reject', bulkRejectEventApplications);

export default router;
