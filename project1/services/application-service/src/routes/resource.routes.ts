import express from 'express';
import {
  getResources,
  getResourceById,
  downloadResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// User routes
router.get('/', getResources);
router.get('/:id', getResourceById);
router.get('/:id/download', downloadResource);

// Admin/Manager/Director routes
router.post('/', authorize('admin', 'manager', 'director'), createResource);
router.put('/:id', authorize('admin', 'manager', 'director'), updateResource);
router.delete('/:id', authorize('admin', 'manager', 'director'), deleteResource);

export default router;
