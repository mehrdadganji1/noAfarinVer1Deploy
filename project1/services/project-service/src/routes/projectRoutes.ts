import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as projectController from '../controllers/projectController';

const router = Router();

// Public routes (optional auth)
router.get('/projects/stats', optionalAuth, projectController.getProjectStats);
router.get('/projects', optionalAuth, projectController.getAllProjects);
router.get('/projects/:id', optionalAuth, projectController.getProjectById);

// Protected routes (authentication required)
router.post('/projects', authenticate, projectController.createProject);
router.put('/projects/:id', authenticate, projectController.updateProject);
router.delete('/projects/:id', authenticate, projectController.deleteProject);

// My projects
router.get('/my-projects', authenticate, projectController.getMyProjects);

// Team management
router.post('/projects/:id/join', authenticate, projectController.joinProject);
router.delete('/projects/:id/leave', authenticate, projectController.leaveProject);

// Milestone management
router.post('/projects/:id/milestones', authenticate, projectController.addMilestone);
router.put('/milestones/:milestoneId', authenticate, projectController.updateMilestone);
router.delete('/projects/:projectId/milestones/:milestoneId', authenticate, projectController.deleteMilestone);

export default router;
