import { FC } from 'react';
import { Bell, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';

export const PendingTopBar: FC = () => {
  const { data: applicationData } = useApplicationStatus();

  const getStatusInfo = () => {
    const status = applicationData?.status || 'submitted';
    
    switch (status) {
      case 'submitted':
        return {
          text: 'درخواست ارسال شده',
          color: 'bg-blue-100 text-blue-800',
          icon: Clock
        };
      case 'under_review':
        return {
          text: 'در حال بررسی',
          color: 'bg-purple-100 text-purple-800',
          icon: Clock
        };
      case 'interview_scheduled':
        return {
          text: 'مصاحبه تعیین شده',
          color: 'bg-green-100 text-green-800',
          icon: AlertCircle
        };
      case 'rejected':
        return {
          text: 'رد شده',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle
        };
      default:
        return {
          text: 'در انتظار',
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Status Badge */}
        <div className="flex items-center gap-4">
          <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-medium`}>
            <StatusIcon className="w-4 h-4 ml-2" />
            {statusInfo.text}
          </Badge>
          
          <div className="hidden md:block text-sm text-gray-600">
            شماره پیگیری: <span className="font-mono font-semibold">{applicationData?.application?._id?.slice(-8) || 'N/A'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Help Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/applicant/help'}
          >
            راهنما
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      {applicationData?.status === 'under_review' && (
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <p className="text-sm text-purple-800">
            درخواست شما در حال بررسی است. معمولاً این فرآیند 3-5 روز کاری طول می‌کشد.
          </p>
        </div>
      )}
    </div>
  );
};
