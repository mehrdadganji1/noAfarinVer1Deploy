import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  X,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NotificationBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function NotificationBanner({
  type,
  title,
  message,
  actionLabel,
  onAction,
  dismissible = true,
  onDismiss,
  className
}: NotificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle2,
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
          buttonVariant: 'default' as const
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          buttonVariant: 'destructive' as const
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          textColor: 'text-orange-900',
          buttonVariant: 'default' as const
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
          buttonVariant: 'default' as const
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <Alert
      className={cn(
        'border-2 shadow-md relative',
        style.bg,
        style.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn('h-6 w-6', style.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold mb-1', style.textColor)}>
            {title}
          </h3>
          <AlertDescription className={style.textColor}>
            {message}
          </AlertDescription>

          {/* Action Button */}
          {actionLabel && onAction && (
            <Button
              variant={style.buttonVariant}
              size="sm"
              className="mt-3"
              onClick={onAction}
            >
              {actionLabel}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors',
              style.textColor
            )}
            aria-label="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </Alert>
  );
}

// Smart Banner that shows based on application status
interface SmartBannerProps {
  applicationStatus?: string;
  reviewNotes?: string;
  profileCompletion: number;
  documentsUploaded: number;
  documentsRequired: number;
  onNavigate?: (path: string) => void;
}

export function SmartNotificationBanner({
  applicationStatus = 'not_submitted',
  reviewNotes,
  profileCompletion,
  documentsUploaded,
  documentsRequired,
  onNavigate
}: SmartBannerProps) {
  // Application approved
  if (applicationStatus === 'approved') {
    return (
      <NotificationBanner
        type="success"
        title="🎉 تبریک! درخواست شما تایید شد"
        message="شما اکنون می‌توانید از امکانات سیستم استفاده کنید"
        actionLabel="مشاهده پروفایل"
        onAction={() => onNavigate?.('/applicant/profile')}
      />
    );
  }

  // Application rejected
  if (applicationStatus === 'rejected') {
    return (
      <NotificationBanner
        type="error"
        title="درخواست رد شد"
        message={reviewNotes || 'متاسفانه درخواست شما تایید نشد. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید'}
        actionLabel="تماس با پشتیبانی"
        onAction={() => onNavigate?.('/applicant/help')}
      />
    );
  }

  // Interview scheduled
  if (applicationStatus === 'interview_scheduled') {
    return (
      <NotificationBanner
        type="info"
        title="📅 مصاحبه برنامه‌ریزی شد"
        message="زمان مصاحبه شما تعیین شده است. لطفاً جزئیات را مشاهده کنید"
        actionLabel="مشاهده مصاحبه"
        onAction={() => onNavigate?.('/applicant/interviews')}
      />
    );
  }

  // Under review
  if (applicationStatus === 'under_review') {
    return (
      <NotificationBanner
        type="info"
        title="🔍 در حال بررسی"
        message="درخواست شما توسط کارشناسان در حال بررسی است"
        dismissible={true}
      />
    );
  }

  // Incomplete profile
  if (applicationStatus === 'not_submitted' && profileCompletion < 80) {
    return (
      <NotificationBanner
        type="warning"
        title="⚠️ پروفایل ناقص است"
        message={`پروفایل شما ${profileCompletion}% تکمیل شده. لطفاً برای ثبت درخواست، پروفایل خود را تکمیل کنید`}
        actionLabel="تکمیل پروفایل"
        onAction={() => onNavigate?.('/applicant/profile')}
      />
    );
  }

  // Incomplete documents
  if (applicationStatus === 'pending' && documentsUploaded < documentsRequired) {
    return (
      <NotificationBanner
        type="warning"
        title="📄 مدارک ناقص"
        message={`${documentsRequired - documentsUploaded} مدرک باقی‌مانده است. لطفاً مدارک خود را تکمیل کنید`}
        actionLabel="آپلود مدارک"
        onAction={() => onNavigate?.('/applicant/documents')}
      />
    );
  }

  return null;
}
