import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as eventController from '../controllers/eventController';

const router = Router();

// Public routes (optional auth - works with or without login)
router.get('/stats', optionalAuth, eventController.getEventStats);
router.get('/analytics', optionalAuth, eventController.getEventAnalytics);
router.get('/', optionalAuth, eventController.getAllEvents);
router.get('/:id', optionalAuth, eventController.getEventById);

// Protected routes (auth required)
router.post('/', authenticate, eventController.createEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);
router.post('/:id/register', authenticate, eventController.registerForEvent);
router.delete('/:id/register', authenticate, eventController.cancelRegistration);
router.post('/:id/attendance', authenticate, eventController.markAttendance);

export default router;
