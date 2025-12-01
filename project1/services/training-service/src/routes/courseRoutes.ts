import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as courseController from '../controllers/courseController';

const router = Router();

// Public routes (optional auth)
router.get('/courses/stats', optionalAuth, courseController.getCourseStats);
router.get('/courses', optionalAuth, courseController.getAllCourses);
router.get('/courses/:id', optionalAuth, courseController.getCourseById);

// Protected routes
router.post('/courses', authenticate, courseController.createCourse);
router.put('/courses/:id', authenticate, courseController.updateCourse);
router.delete('/courses/:id', authenticate, courseController.deleteCourse);
router.post('/courses/:id/enroll', authenticate, courseController.enrollCourse);
router.delete('/courses/:id/drop', authenticate, courseController.dropCourse);
router.put('/courses/:id/progress', authenticate, courseController.updateProgress);
router.post('/courses/:id/review', authenticate, courseController.addReview);

export default router;
