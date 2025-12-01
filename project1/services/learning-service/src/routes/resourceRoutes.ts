import express from 'express';
import {
  getAllResources,
  getResourceById,
  updateProgress,
  toggleBookmark,
  toggleLike,
  getUserStats
} from '../controllers/resourceController';

const router = express.Router();

// Get all resources with optional filters
router.get('/', getAllResources);

// Get user stats
router.get('/stats', getUserStats);

// Get single resource by ID
router.get('/:id', getResourceById);

// Update user progress
router.put('/:id/progress', updateProgress);

// Toggle bookmark
router.post('/:id/bookmark', toggleBookmark);

// Toggle like
router.post('/:id/like', toggleLike);

export default router;
