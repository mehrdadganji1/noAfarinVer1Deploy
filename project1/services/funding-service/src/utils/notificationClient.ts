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
 * Notification Client for Funding Service
 */
export class NotificationClient {
  private serviceName = 'Funding Service';

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

  async notifyFundingSubmitted(userId: string, amount: number, fundingId: string): Promise<void> {
    await this.create({
      userId,
      type: 'funding',
      priority: 'medium',
      title: 'درخواست تامین مالی ثبت شد',
      message: `درخواست تامین مالی به مبلغ ${amount.toLocaleString('fa-IR')} تومان ثبت شد.`,
      link: `/fundings/${fundingId}`,
      metadata: { fundingId, amount, action: 'submitted' },
    });
  }

  async notifyFundingApproved(userId: string, amount: number, fundingId: string): Promise<void> {
    await this.create({
      userId,
      type: 'funding',
      priority: 'high',
      title: 'درخواست تامین مالی تایید شد',
      message: `تبریک! درخواست تامین مالی شما به مبلغ ${amount.toLocaleString('fa-IR')} تومان تایید شد.`,
      link: `/fundings/${fundingId}`,
      metadata: { fundingId, amount, status: 'approved', action: 'approved' },
    });
  }

  async notifyFundingRejected(userId: string, fundingId: string, reason?: string): Promise<void> {
    await this.create({
      userId,
      type: 'funding',
      priority: 'medium',
      title: 'درخواست تامین مالی رد شد',
      message: reason || 'متاسفانه درخواست تامین مالی شما تایید نشد.',
      link: `/fundings/${fundingId}`,
      metadata: { fundingId, status: 'rejected', reason, action: 'rejected' },
    });
  }
}

export default NotificationClient;
