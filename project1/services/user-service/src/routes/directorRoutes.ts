import express from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { UserRole } from '../models/User'
import * as directorStatsController from '../controllers/directorStatsController'

const router = express.Router()

// All routes require authentication and director role
router.use(authenticate)
router.use(authorize(UserRole.DIRECTOR))

// Get complete director stats
router.get('/stats', directorStatsController.getDirectorStats)

// Get user statistics
router.get('/stats/users', directorStatsController.getUserStats)

// Get system health
router.get('/stats/system-health', directorStatsController.getSystemHealth)

export default router
