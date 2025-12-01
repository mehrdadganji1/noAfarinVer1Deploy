import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  FileText,
  Calendar,
  Eye,
  Edit,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toPersianDate } from '@/utils/dateUtils';

interface ApplicationStatusCardProps {
  status: 'draft' | 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected';
  progress: number;
  submittedAt?: string;
  reviewedAt?: string;
  interviewDate?: string;
}

type StatusType = 'draft' | 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected';

const statusConfig: Record<StatusType, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
}> = {
  draft: {
    label: 'پیش‌نویس',
    icon: FileText,
    color: 'text-slate-600 bg-slate-100',
    bgColor: 'bg-slate-50',
    description: 'درخواست شما هنوز ارسال نشده است'
  },
  submitted: {
    label: 'ارسال شده',
    icon: CheckCircle2,
    color: 'text-purple-600 bg-purple-100',
    bgColor: 'bg-purple-50',
    description: 'درخواست شما با موفقیت ارسال شد'
  },
  under_review: {
    label: 'در حال بررسی',
    icon: Clock,
    color: 'text-orange-600 bg-orange-100',
    bgColor: 'bg-orange-50',
    description: 'تیم ما در حال بررسی مدارک شماست'
  },
  interview_scheduled: {
    label: 'مصاحبه تعیین شده',
    icon: Calendar,
    color: 'text-fuchsia-600 bg-fuchsia-100',
    bgColor: 'bg-fuchsia-50',
    description: 'زمان مصاحبه شما تعیین شده است'
  },
  accepted: {
    label: 'پذیرفته شده',
    icon: CheckCircle2,
    color: 'text-emerald-600 bg-emerald-100',
    bgColor: 'bg-emerald-50',
    description: 'تبریک! شما پذیرفته شدید'
  },
  rejected: {
    label: 'رد شده',
    icon: FileText,
    color: 'text-rose-600 bg-rose-100',
    bgColor: 'bg-rose-50',
    description: 'متأسفانه درخواست شما رد شد'
  }
};

const normalizeStatus = (status: string): StatusType => {
  const validStatuses: StatusType[] = ['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected'];
  return validStatuses.includes(status as StatusType) ? (status as StatusType) : 'draft';
};

export function ApplicationStatusCard({
  status,
  progress,
  submittedAt,
  interviewDate
}: ApplicationStatusCardProps) {
  const navigate = useNavigate();
  const normalizedStatus = normalizeStatus(status);
  const config = statusConfig[normalizedStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("border rounded-xl hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md", config.bgColor, "border-gray-200")}>
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", config.color.split(' ')[1])}>
                <FileText className={cn("w-4 h-4", config.color.split(' ')[0])} />
              </div>
              <h3 className="text-base font-bold text-gray-900">وضعیت درخواست</h3>
            </div>
            <Badge className={cn("px-2 py-1 text-xs font-semibold", config.color)}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pb-3">
          {/* Progress Section - Compact */}
          <div className="p-3 rounded-lg bg-white/60 border border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">پیشرفت تکمیل</span>
              <span className="text-lg font-bold text-gray-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Info Cards - Inline */}
          {(submittedAt || interviewDate) && (
            <div className="flex gap-2">
              {submittedAt && (
                <div className="flex-1 p-2.5 rounded-lg bg-white/60 border border-gray-200/50">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] text-gray-500">ارسال</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    {toPersianDate(submittedAt, 'short')}
                  </p>
                </div>
              )}
              {interviewDate && (
                <div className="flex-1 p-2.5 rounded-lg bg-white/60 border border-gray-200/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className={cn("w-3.5 h-3.5", config.color.split(' ')[0])} />
                    <span className="text-[10px] text-gray-500">مصاحبه</span>
                  </div>
                  <p className={cn("text-xs font-bold mt-0.5", config.color.split(' ')[0])}>
                    {toPersianDate(interviewDate, 'short')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/applicant/application-status')}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg py-2.5 text-xs font-semibold transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              مشاهده جزئیات
            </button>
            
            {status === 'draft' ? (
              <button
                onClick={() => navigate('/application-form')}
                className="flex items-center justify-center gap-1.5 bg-white border border-purple-300 hover:border-purple-500 text-purple-600 rounded-lg py-2.5 text-xs font-semibold transition-all"
              >
                <Edit className="w-3.5 h-3.5" />
                ادامه فرم
              </button>
            ) : (
              <button
                onClick={() => navigate('/applicant/application-status')}
                className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg py-2.5 text-xs font-semibold transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                مراحل پیشرفت
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
