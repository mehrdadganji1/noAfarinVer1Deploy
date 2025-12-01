import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as projectController from '../controllers/projectController';

const router = Router();

// Public routes (optional auth)
router.get('/projects/stats', optionalAuth, projectController.getProjectStats);
router.get('/projects', optionalAuth, projectController.getAllProjects);
router.get('/projects/:id', optionalAuth, projectController.getProjectById);

// Protected routes
router.post('/projects', authenticate, projectController.createProject);
router.put('/projects/:id', authenticate, projectController.updateProject);
router.delete('/projects/:id', authenticate, projectController.deleteProject);
router.post('/projects/:id/join', authenticate, projectController.joinProject);
router.delete('/projects/:id/leave', authenticate, projectController.leaveProject);
router.put('/projects/:id/task', authenticate, projectController.updateTask);

export default router;
