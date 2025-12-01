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
 * Shared Notification Client for all microservices
 * Sends notifications to User Service via internal endpoint
 */
export class NotificationClient {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Create a notification for single or multiple users
   */
  async create(data: NotificationData): Promise<void> {
    try {
      // If userId is array, send bulk notification
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

  // ====== TEAM NOTIFICATIONS ======
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

  // ====== EVENT NOTIFICATIONS ======
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
      title: '⏰ یادآوری رویداد',
      message: `${daysUntil} روز تا شروع رویداد "${eventTitle}" باقی مانده است.`,
      link: `/events/${eventId}`,
      metadata: { eventId, eventTitle, daysUntil, action: 'reminder' },
    });
  }

  // ====== TRAINING NOTIFICATIONS ======
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
      title: '🎓 دوره تکمیل شد',
      message: `تبریک! دوره "${trainingTitle}" را با موفقیت تکمیل کردید.`,
      link: `/trainings/${trainingId}`,
      metadata: { trainingId, trainingTitle, completed: true, action: 'completed' },
    });
  }

  // ====== EVALUATION NOTIFICATIONS ======
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

  // ====== FUNDING NOTIFICATIONS ======
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
      title: '✅ درخواست تامین مالی تایید شد',
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

  // ====== APPLICATION NOTIFICATIONS ======
  async notifyApplicationSubmitted(userId: string, applicationId: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      priority: 'medium',
      title: 'درخواست عضویت ثبت شد',
      message: 'درخواست عضویت شما با موفقیت ثبت شد و در انتظار بررسی است.',
      link: '/application-status',
      metadata: { applicationId, action: 'submitted' },
    });
  }

  async notifyApplicationApproved(userId: string, role: string, applicationId: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      priority: 'high',
      title: '✅ درخواست شما تایید شد',
      message: `تبریک! درخواست عضویت شما تایید شد و به عنوان ${role} به سیستم اضافه شدید.`,
      link: '/dashboard',
      metadata: { applicationId, status: 'approved', role, action: 'approved' },
    });
  }

  async notifyApplicationRejected(userId: string, applicationId: string, reason?: string): Promise<void> {
    await this.create({
      userId,
      type: 'application',
      priority: 'medium',
      title: 'درخواست رد شد',
      message: reason || 'متاسفانه درخواست عضویت شما رد شد.',
      link: '/application-status',
      metadata: { applicationId, status: 'rejected', reason, action: 'rejected' },
    });
  }

  // ====== SYSTEM NOTIFICATIONS ======
  async notifySystemMessage(userIds: string[], title: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): Promise<void> {
    await this.create({
      userId: userIds,
      type: 'system',
      priority,
      title,
      message,
      metadata: { action: 'system_message' },
    });
  }
}

export default NotificationClient;
