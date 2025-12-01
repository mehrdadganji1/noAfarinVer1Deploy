import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const INTERNAL_NOTIFICATION_URL = `${USER_SERVICE_URL}/notifications/internal/create`;

interface NotificationData {
  userId: string | string[];
  type: string;
  priority?: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Notification Client for Event Service
 */
export class NotificationClient {
  private serviceName = 'Event Service';

  async create(data: NotificationData): Promise<void> {
    try {
      if (Array.isArray(data.userId)) {
        console.log(`🔔 [${this.serviceName}] Sending notification to ${data.userId.length} users:`, data.title);
        
        await Promise.all(
          data.userId.map(userId =>
            axios.post(INTERNAL_NOTIFICATION_URL, {
              ...data,
              userId,
            }, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 5000,
            })
          )
        );
      } else {
        console.log(`🔔 [${this.serviceName}] Sending notification:`, { 
          userId: data.userId, 
          title: data.title,
        });
        
        const response = await axios.post(INTERNAL_NOTIFICATION_URL, data, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
        });

        console.log(`✅ [${this.serviceName}] Response:`, response.data.success);
      }
      
      console.log(`✅ [${this.serviceName}] Notification sent successfully`);
    } catch (error: any) {
      console.error(`❌ [${this.serviceName}] Failed to send notification:`, {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        userId: data.userId,
        title: data.title,
      });
    }
  }

  async notifyEventCreated(userIds: string[], eventTitle: string, eventId: string, eventDate: Date): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'event',
      priority: 'medium',
      title: 'رویداد جدید ایجاد شد',
      message: `رویداد "${eventTitle}" در تاریخ ${new Date(eventDate).toLocaleDateString('fa-IR')} برگزار می‌شود.`,
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle, eventDate, action: 'created' },
    });
  }

  async notifyEventUpdated(userIds: string[], eventTitle: string, eventId: string): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'event',
      priority: 'medium',
      title: 'رویداد بروزرسانی شد',
      message: `اطلاعات رویداد "${eventTitle}" بروزرسانی شد.`,
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle, action: 'updated' },
    });
  }

  async notifyEventRegistered(userId: string, eventTitle: string, eventId: string): Promise<void> {
    await this.create({
      userId,
      type: 'event',
      priority: 'high',
      title: 'ثبت نام در رویداد',
      message: `شما در رویداد "${eventTitle}" ثبت نام کردید.`,
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle, action: 'registered' },
    });
  }

  async notifyEventReminder(userId: string, eventTitle: string, eventId: string, daysUntil: number): Promise<void> {
    await this.create({
      userId,
      type: 'event',
      priority: 'high',
      title: 'یادآوری رویداد',
      message: `${daysUntil} روز تا شروع رویداد "${eventTitle}" باقی مانده است.`,
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle, daysUntil, action: 'reminder' },
    });
  }
}

export default NotificationClient;
