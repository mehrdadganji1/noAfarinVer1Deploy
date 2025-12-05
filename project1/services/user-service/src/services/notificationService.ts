import mongoose from 'mongoose';
import Notification from '../models/Notification';
import socketManager from '../socket/socketManager';

interface NotificationData {
  userId: string | mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  link?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  /**
   * Create a notification and optionally send via socket
   */
  async create(data: NotificationData): Promise<any> {
    try {
      // Convert userId to string if it's an ObjectId
      const userIdStr = typeof data.userId === 'string' ? data.userId : data.userId.toString();
      
      const notification = await Notification.create({
        userId: userIdStr,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || 'medium',
        link: data.link,
        metadata: data.metadata,
      });

      console.log(`📧 [Notification] Created notification for user ${userIdStr}:`, data.title);

      // Try to send via socket if available
      try {
        socketManager.sendNotification(userIdStr, {
          _id: notification._id,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority || 'medium',
          createdAt: notification.createdAt,
        });
      } catch (socketError) {
        console.warn('Socket notification failed (non-critical):', socketError);
      }

      return notification;
    } catch (error) {
      console.error('❌ [Notification] Create error:', error);
      throw error;
    }
  }

  /**
   * Notify user when application is approved
   */
  async notifyApplicationApproved(userId: string, status: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      title: 'درخواست شما تایید شد! 🎉',
      message: `درخواست عضویت شما با وضعیت "${status}" تایید شد. به باشگاه نوآفرین خوش آمدید!`,
      priority: 'high',
      link: '/dashboard',
      metadata: { status },
    });
  }

  /**
   * Notify user when application is rejected
   */
  async notifyApplicationRejected(userId: string, reason: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      title: 'وضعیت درخواست شما',
      message: reason || 'متأسفانه درخواست شما در این مرحله تایید نشد.',
      priority: 'medium',
      link: '/application/status',
      metadata: { reason },
    });
  }

  /**
   * Notify user when application is submitted
   */
  async notifyApplicationSubmitted(userId: string, applicationId: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      title: 'درخواست شما ثبت شد ✅',
      message: 'درخواست عضویت شما با موفقیت ثبت شد و در حال بررسی است.',
      priority: 'medium',
      link: '/application/status',
      metadata: { applicationId },
    });
  }

  /**
   * Notify user when role is changed
   */
  async notifyRoleChanged(userId: string, newRole: string): Promise<void> {
    await this.create({
      userId,
      type: 'role-change',
      title: 'نقش شما تغییر کرد',
      message: `نقش شما به "${newRole}" تغییر یافت.`,
      priority: 'high',
      link: '/profile',
      metadata: { newRole },
    });
  }

  /**
   * Notify user about status change
   */
  async notifyStatusChange(userId: string, oldStatus: string, newStatus: string): Promise<void> {
    await this.create({
      userId,
      type: 'status-change',
      title: 'وضعیت درخواست شما تغییر کرد',
      message: `وضعیت درخواست شما از "${oldStatus}" به "${newStatus}" تغییر یافت.`,
      priority: 'medium',
      link: '/application/status',
      metadata: { oldStatus, newStatus },
    });
  }

  /**
   * Notify user about new event
   */
  async notifyNewEvent(userId: string, eventTitle: string, eventId: string): Promise<void> {
    await this.create({
      userId,
      type: 'event',
      title: 'رویداد جدید 📅',
      message: `رویداد جدید "${eventTitle}" اضافه شد.`,
      priority: 'medium',
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle },
    });
  }

  /**
   * Notify user about interview scheduled
   */
  async notifyInterviewScheduled(userId: string, date: Date, location: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      title: 'مصاحبه شما تنظیم شد 📋',
      message: `مصاحبه شما برای تاریخ ${new Date(date).toLocaleDateString('fa-IR')} در ${location} تنظیم شد.`,
      priority: 'urgent',
      link: '/interview',
      metadata: { date, location },
    });
  }

  /**
   * Send bulk notifications
   */
  async bulkCreate(notifications: NotificationData[]): Promise<any[]> {
    const results = [];
    for (const notif of notifications) {
      try {
        const result = await this.create(notif);
        results.push(result);
      } catch (error) {
        console.error('Bulk notification error:', error);
      }
    }
    return results;
  }
}

export default new NotificationService();
