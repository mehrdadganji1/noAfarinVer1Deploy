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
 * Notification Client for Training Service
 */
export class NotificationClient {
  private serviceName = 'Training Service';

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

  async notifyTrainingCreated(userIds: string[], trainingTitle: string, trainingId: string): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'training',
      priority: 'medium',
      title: 'دوره آموزشی جدید',
      message: `دوره آموزشی "${trainingTitle}" ایجاد شد.`,
      link: `/trainings/${trainingId}`,
      metadata: { trainingId, trainingTitle, action: 'created' },
    });
  }

  async notifyTrainingEnrollment(userId: string, trainingTitle: string, trainingId: string): Promise<void> {
    await this.create({
      userId,
      type: 'training',
      priority: 'high',
      title: 'ثبت نام در دوره آموزشی',
      message: `شما در دوره "${trainingTitle}" ثبت نام کردید.`,
      link: `/trainings/${trainingId}`,
      metadata: { trainingId, trainingTitle, action: 'enrolled' },
    });
  }

  async notifyTrainingCompleted(userId: string, trainingTitle: string, trainingId: string): Promise<void> {
    await this.create({
      userId,
      type: 'training',
      priority: 'high',
      title: 'دوره تکمیل شد',
      message: `تبریک! دوره "${trainingTitle}" را با موفقیت تکمیل کردید.`,
      link: `/trainings/${trainingId}`,
      metadata: { trainingId, trainingTitle, completed: true, action: 'completed' },
    });
  }
}

export default NotificationClient;
