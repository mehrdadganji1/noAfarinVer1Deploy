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
 * Notification Client for Evaluation Service
 */
export class NotificationClient {
  private serviceName = 'Evaluation Service';

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

  async notifyEvaluationReceived(userId: string, evaluatorName: string, score: number, evaluationId: string): Promise<void> {
    await this.create({
      userId,
      type: 'evaluation',
      priority: 'high',
      title: 'ارزیابی جدید دریافت شد',
      message: `${evaluatorName} شما را ارزیابی کرد. امتیاز: ${score}/100`,
      link: `/evaluations/${evaluationId}`,
      metadata: { evaluationId, evaluatorName, score, action: 'received' },
    });
  }

  async notifyEvaluationRequested(userId: string, teamName: string, evaluationId: string): Promise<void> {
    await this.create({
      userId,
      type: 'evaluation',
      priority: 'high',
      title: 'درخواست ارزیابی',
      message: `از شما درخواست ارزیابی تیم "${teamName}" شده است.`,
      link: `/evaluations/${evaluationId}`,
      metadata: { evaluationId, teamName, action: 'requested' },
    });
  }
}

export default NotificationClient;
