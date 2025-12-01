import { Router } from 'express';
import {
  getUserRoles,
  assignRoles,
  addRole,
  removeRole,
  getAllRoles,
  getUsersByRole,
} from '../controllers/roleController';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireManager } from '../middleware/permission';

const router = Router();

// Public routes (authenticated users)
router.get('/roles', authenticate, getAllRoles);
router.get('/user/:id/roles', authenticate, getUserRoles);

// Admin/Manager routes
router.get('/users/role/:role', authenticate, requireManager, getUsersByRole);

// Admin only routes
router.post('/assign', authenticate, requireAdmin, assignRoles);
router.post('/add', authenticate, requireAdmin, addRole);
router.post('/remove', authenticate, requireAdmin, removeRole);

export default router;
