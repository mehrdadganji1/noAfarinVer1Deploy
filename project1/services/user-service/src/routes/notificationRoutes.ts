import express from 'express'
import { authenticate } from '../middleware/auth'
import {
  getNotifications,
  getNotificationStats,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} from '../controllers/notificationController'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Get notifications with filters
router.get('/', getNotifications)

// Get notification stats
router.get('/stats', getNotificationStats)

// Get unread count
router.get('/unread-count', getUnreadCount)

// Mark notification as read
router.patch('/:id/read', markAsRead)

// Mark all as read
router.patch('/mark-all-read', markAllAsRead)

// Delete notification
router.delete('/:id', deleteNotification)

// Delete all read notifications
router.delete('/read/all', deleteAllRead)

export default router
