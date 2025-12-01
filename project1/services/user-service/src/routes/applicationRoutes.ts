import { Router } from 'express';
import {
  submitApplication,
  updateApplication,
  getMyApplication,
  getApplicationByUserId,
  getAllApplications,
  getApplicationById,
  reviewApplication,
  approveApplication,
  rejectApplication,
  getApplicationStats,
  bulkApproveApplications,
  bulkRejectApplications,
  addDocument,
  getDocuments,
  deleteDocument,
  verifyDocument,
  rejectDocument,
  getPendingDocuments,
  requestDocumentInfo,
  updateApplicationDetails,
  changeApplicationStatus,
} from '../controllers/applicationController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin/Manager/Director routes (specific routes MUST come before dynamic routes)
router.get('/stats', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), getApplicationStats);
router.get('/documents/pending', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), getPendingDocuments);
router.post('/bulk-approve', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), bulkApproveApplications);
router.post('/bulk-reject', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), bulkRejectApplications);

// Applicant routes (allow all authenticated users to submit)
router.post('/', submitApplication);
router.post('/submit', submitApplication); // ✅ Add explicit /submit route for frontend compatibility
router.get('/my-application', getMyApplication);
router.get('/user/:userId', getApplicationByUserId); // New route
router.put('/:id', updateApplication);

// Document management routes (Applicant)
router.get('/:id/documents', getDocuments);
router.post('/:id/documents', addDocument);
router.delete('/:id/documents/:documentId', deleteDocument);

// Document verification routes (Admin/Manager/Director only)
router.put('/:id/documents/:documentId/verify', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), verifyDocument);
router.put('/:id/documents/:documentId/reject', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), rejectDocument);
router.post('/:id/documents/:documentId/request-info', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), requestDocumentInfo);

// Admin/Manager/Director routes (dynamic routes)
router.get('/', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), getAllApplications);
router.get('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), getApplicationById);
router.patch('/:id', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), updateApplicationDetails);
router.patch('/:id/status', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), changeApplicationStatus);
router.patch('/:id/review', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), reviewApplication);
router.patch('/:id/approve', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), approveApplication);
router.patch('/:id/reject', authorize(UserRole.MANAGER, UserRole.ADMIN, UserRole.DIRECTOR), rejectApplication);

export default router;
