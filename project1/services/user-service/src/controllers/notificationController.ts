import { Request, Response } from 'express'
import Notification from '../models/Notification'

// Get user notifications with filters
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }
    
    const { page = 1, limit = 10, type, isRead, search, priority } = req.query

    const query: any = { userId }

    if (type && type !== 'all') {
      query.type = type
    }

    if (isRead !== undefined && isRead !== 'all') {
      query.isRead = isRead === 'true'
    }

    if (priority && priority !== 'all') {
      query.priority = priority
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Notification.countDocuments(query)

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    })
  } catch (error: any) {
    console.error('Get notifications error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اعلانات',
      error: error.message,
    })
  }
}

// Get notification stats
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }

    const [total, unread, read, priorityStats, typeStats] = await Promise.all([
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, isRead: false }),
      Notification.countDocuments({ userId, isRead: true }),
      Notification.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Notification.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
    ])

    const priorityDistribution: any = {}
    priorityStats.forEach((stat: any) => {
      priorityDistribution[stat._id] = stat.count
    })

    const typeDistribution: any = {}
    typeStats.forEach((stat: any) => {
      typeDistribution[stat._id] = stat.count
    })

    res.json({
      success: true,
      data: {
        total,
        unread,
        read,
        readRate: total > 0 ? ((read / total) * 100).toFixed(1) : 0,
        priorityDistribution,
        typeDistribution,
      },
    })
  } catch (error: any) {
    console.error('Get notification stats error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار اعلانات',
      error: error.message,
    })
  }
}

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
        count: 0,
      })
    }
    
    const count = await Notification.countDocuments({ userId, isRead: false })

    res.json({
      success: true,
      count,
    })
  } catch (error: any) {
    console.error('Get unread count error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تعداد اعلانات خوانده نشده',
      error: error.message,
    })
  }
}

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }
    
    const { id } = req.params

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اعلان یافت نشد',
      })
    }

    res.json({
      success: true,
      data: notification,
    })
  } catch (error: any) {
    console.error('Mark as read error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در علامت‌گذاری اعلان',
      error: error.message,
    })
  }
}

// Mark all as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({
      success: true,
      message: `${result.modifiedCount} اعلان به عنوان خوانده شده علامت‌گذاری شد`,
      data: { count: result.modifiedCount },
    })
  } catch (error: any) {
    console.error('Mark all as read error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در علامت‌گذاری اعلانات',
      error: error.message,
    })
  }
}

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }
    
    const { id } = req.params

    const notification = await Notification.findOneAndDelete({ _id: id, userId })

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'اعلان یافت نشد',
      })
    }

    res.json({
      success: true,
      message: 'اعلان حذف شد',
    })
  } catch (error: any) {
    console.error('Delete notification error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در حذف اعلان',
      error: error.message,
    })
  }
}

// Delete all read notifications
export const deleteAllRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'کاربر احراز هویت نشده است',
      })
    }

    const result = await Notification.deleteMany({ userId, isRead: true })

    res.json({
      success: true,
      message: `${result.deletedCount} اعلان خوانده شده حذف شد`,
      data: { count: result.deletedCount },
    })
  } catch (error: any) {
    console.error('Delete all read error:', error)
    res.status(500).json({
      success: false,
      message: 'خطا در حذف اعلانات',
      error: error.message,
    })
  }
}

// Create notification (for system use)
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  priority: string = 'medium',
  link?: string,
  metadata?: Record<string, any>
) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      priority,
      link,
      metadata,
    })

    return notification
  } catch (error) {
    console.error('Create notification error:', error)
    throw error
  }
}

// Bulk create notifications
export const bulkCreateNotifications = async (notifications: any[]) => {
  try {
    const result = await Notification.insertMany(notifications)
    return result
  } catch (error) {
    console.error('Bulk create notifications error:', error)
    throw error
  }
}
