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
 * Notification Client for Team Service
 */
export class NotificationClient {
  private serviceName = 'Team Service';

  /**
   * Create a notification for single or multiple users
   */
  async create(data: NotificationData): Promise<void> {
    try {
      // If userId is array, send bulk notification
      if (Array.isArray(data.userId)) {
        console.log(`🔔 [${this.serviceName}] Sending notification to ${data.userId.length} users:`, data.title);
        
        // Send notification to each user
        await Promise.all(
          data.userId.map(userId =>
            axios.post(INTERNAL_NOTIFICATION_URL, {
              ...data,
              userId,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 5000,
            })
          )
        );
      } else {
        console.log('🔔 [Team Service] Sending notification:', { 
          userId: data.userId, 
          title: data.title,
          url: INTERNAL_NOTIFICATION_URL 
        });
        
        const response = await axios.post(INTERNAL_NOTIFICATION_URL, data, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        });

        console.log('✅ [Team Service] Response from User Service:', response.data);
      }
      
      console.log('✅ [Team Service] Notification sent successfully');
    } catch (error: any) {
      // Don't throw error - just log it
      // We don't want notification failures to break the main flow
      console.error('❌ [Team Service] Failed to send notification:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        userId: data.userId,
        title: data.title,
        url: INTERNAL_NOTIFICATION_URL,
      });
    }
  }

  /**
   * Team-related notifications
   */
  async notifyTeamCreated(userIds: string[], teamName: string, teamId: string): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'team',
      priority: 'medium',
      title: 'تیم جدید ایجاد شد',
      message: `تیم "${teamName}" با موفقیت ایجاد شد.`,
      link: `/teams/${teamId}`,
      metadata: { teamId, teamName, action: 'created' },
    });
  }

  async notifyMemberAdded(userId: string, teamName: string, teamId: string, addedBy: string): Promise<void> {
    await this.create({
      userId,
      type: 'team',
      priority: 'high',
      title: 'به تیم جدید اضافه شدید',
      message: `شما به تیم "${teamName}" اضافه شدید.`,
      link: `/teams/${teamId}`,
      metadata: { teamId, teamName, addedBy, action: 'member_added' },
    });
  }

  async notifyMemberRemoved(userId: string, teamName: string): Promise<void> {
    await this.create({
      userId,
      type: 'team',
      priority: 'medium',
      title: 'از تیم حذف شدید',
      message: `شما از تیم "${teamName}" حذف شدید.`,
      metadata: { teamName, action: 'member_removed' },
    });
  }

  async notifyMentorAssigned(mentorId: string, teamName: string, teamId: string): Promise<void> {
    await this.create({
      userId: mentorId,
      type: 'team',
      priority: 'high',
      title: 'منتور تیم جدید شدید',
      message: `شما به عنوان منتور تیم "${teamName}" انتخاب شدید.`,
      link: `/teams/${teamId}`,
      metadata: { teamId, teamName, action: 'mentor_assigned' },
    });
  }

  async notifyTeamUpdated(userIds: string[], teamName: string, teamId: string): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'team',
      priority: 'low',
      title: 'تیم بروزرسانی شد',
      message: `اطلاعات تیم "${teamName}" بروزرسانی شد.`,
      link: `/teams/${teamId}`,
      metadata: { teamId, teamName, action: 'updated' },
    });
  }

  async notifyTeamDeleted(userIds: string[], teamName: string): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'team',
      priority: 'high',
      title: 'تیم حذف شد',
      message: `تیم "${teamName}" حذف شد.`,
      metadata: { teamName, action: 'deleted' },
    });
  }
}

export default NotificationClient;
