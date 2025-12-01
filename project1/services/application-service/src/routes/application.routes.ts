import express from 'express';
import {
  getMyApplication,
  saveApplication,
  submitApplication,
  withdrawApplication,
  getAllApplications,
  getApplicationById,
  reviewApplication,
  getApplicationStats,
  getPendingDocuments,
  verifyDocument,
} from '../controllers/application.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Applicant routes
router.get('/my-application', getMyApplication);
router.post('/save', saveApplication);
router.post('/submit', submitApplication);
router.post('/withdraw', withdrawApplication);

// Admin/Manager/Director routes - stats and documents must come before /:id
router.get('/stats', authorize('admin', 'manager', 'director'), getApplicationStats);
router.get('/documents/pending', authorize('admin', 'manager', 'director'), getPendingDocuments);
router.post('/:applicationId/documents/:documentType/verify', authorize('admin', 'manager', 'director'), verifyDocument);
router.get('/', authorize('admin', 'manager', 'director'), getAllApplications);
router.get('/:id', authorize('admin', 'manager', 'director'), getApplicationById);
router.put('/:id/review', authorize('admin', 'manager', 'director'), reviewApplication);

export default router;
