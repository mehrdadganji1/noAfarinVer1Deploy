import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Clock, 
  ArrowRight,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Deadline {
  id: string;
  title: string;
  description: string;
  daysLeft: number;
  type: 'urgent' | 'warning' | 'info';
  action?: {
    label: string;
    path: string;
  };
  icon?: any;
}

interface DeadlineReminderProps {
  applicationStatus?: string;
  profileCompletion: number;
  documentsUploaded: number;
  documentsRequired: number;
  interviewDate?: string;
  className?: string;
}

export default function DeadlineReminder({
  applicationStatus = 'not_submitted',
  profileCompletion = 0,
  documentsUploaded = 0,
  documentsRequired = 8,
  interviewDate,
  className
}: DeadlineReminderProps) {
  const navigate = useNavigate();

  // Calculate deadlines based on application state
  const deadlines: Deadline[] = [];

  // Profile completion deadline
  if (profileCompletion < 100) {
    deadlines.push({
      id: 'profile',
      title: 'تکمیل پروفایل',
      description: `پروفایل شما ${profileCompletion}% تکمیل شده است`,
      daysLeft: profileCompletion < 50 ? 7 : 14, // Arbitrary, can be from backend
      type: profileCompletion < 50 ? 'urgent' : 'warning',
      action: {
        label: 'تکمیل کنید',
        path: '/applicant/profile'
      },
      icon: UserCheck
    });
  }

  // Document upload deadline
  if (documentsUploaded < documentsRequired && applicationStatus !== 'not_submitted') {
    const missingDocs = documentsRequired - documentsUploaded;
    deadlines.push({
      id: 'documents',
      title: 'آپلود مدارک',
      description: `${missingDocs} مدرک باقی‌مانده برای تکمیل`,
      daysLeft: 10, // Can be calculated from backend
      type: missingDocs > documentsRequired / 2 ? 'urgent' : 'warning',
      action: {
        label: 'آپلود مدارک',
        path: '/applicant/documents'
      },
      icon: FileText
    });
  }

  // Interview reminder
  if (interviewDate) {
    const now = new Date();
    const interview = new Date(interviewDate);
    const daysUntilInterview = Math.ceil((interview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilInterview >= 0 && daysUntilInterview <= 7) {
      deadlines.push({
        id: 'interview',
        title: 'مصاحبه نزدیک است',
        description: `مصاحبه شما ${daysUntilInterview} روز دیگر برگزار می‌شود`,
        daysLeft: daysUntilInterview,
        type: daysUntilInterview <= 2 ? 'urgent' : daysUntilInterview <= 5 ? 'warning' : 'info',
        action: {
          label: 'مشاهده جزئیات',
          path: '/applicant/interviews'
        },
        icon: Calendar
      });
    }
  }

  // Application submission reminder
  if (applicationStatus === 'not_submitted' && profileCompletion >= 80) {
    deadlines.push({
      id: 'submit',
      title: 'آماده ثبت درخواست',
      description: 'پروفایل شما آماده است. درخواست خود را ثبت کنید',
      daysLeft: 30, // Arbitrary
      type: 'info',
      action: {
        label: 'ثبت درخواست',
        path: '/application-form'
      },
      icon: FileText
    });
  }

  // If no deadlines, don't render
  if (deadlines.length === 0) {
    return null;
  }

  // Sort by urgency and days left
  const sortedDeadlines = deadlines.sort((a, b) => {
    const urgencyOrder = { urgent: 0, warning: 1, info: 2 };
    if (urgencyOrder[a.type] !== urgencyOrder[b.type]) {
      return urgencyOrder[a.type] - urgencyOrder[b.type];
    }
    return a.daysLeft - b.daysLeft;
  });

  const getTypeStyle = (type: Deadline['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700'
        };
    }
  };

  return (
    <Card className={cn('border-2', className)}>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-lg">یادآوری‌های مهم</h3>
          </div>

          {sortedDeadlines.map((deadline) => {
            const style = getTypeStyle(deadline.type);
            const Icon = deadline.icon || Clock;

            return (
              <Alert
                key={deadline.id}
                className={cn('border-2', style.bg, style.border)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', style.bg)}>
                    <Icon className={cn('h-5 w-5', style.icon)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {deadline.title}
                      </h4>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0',
                        style.badge
                      )}>
                        {deadline.daysLeft === 0 ? 'امروز' : `${deadline.daysLeft} روز`}
                      </span>
                    </div>
                    <AlertDescription className="text-gray-700">
                      {deadline.description}
                    </AlertDescription>

                    {/* Action Button */}
                    {deadline.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full sm:w-auto"
                        onClick={() => navigate(deadline.action!.path)}
                      >
                        {deadline.action.label}
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            );
          })}

          {/* Summary */}
          {sortedDeadlines.length > 2 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600 text-center">
                {sortedDeadlines.length} یادآوری فعال
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
