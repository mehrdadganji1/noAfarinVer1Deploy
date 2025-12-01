import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { toPersianDate } from '@/utils/dateUtils';
import {
  CheckCircle2,
  Clock,
  Calendar,
  FileSearch,
  Users,
  Award
} from 'lucide-react';

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  icon: any;
  days: string;
  status: 'completed' | 'in-progress' | 'pending';
}

/**
 * Estimated Timeline Component
 * Shows the expected timeline for application review process
 */
export const EstimatedTimeline: FC = () => {
  const { data: applicationData } = useApplicationStatus();
  const status = applicationData?.status || 'submitted';

  // Calculate submission date
  const submissionDate = applicationData?.application?.createdAt 
    ? new Date(applicationData.application.createdAt)
    : new Date();

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date: Date) => {
    return toPersianDate(date, 'short');
  };

  // Determine stage status based on application status
  const getStageStatus = (stageId: string): 'completed' | 'in-progress' | 'pending' => {
    const statusMap: Record<string, string[]> = {
      'submitted': ['submission'],
      'under_review': ['submission', 'initial_review'],
      'interview_scheduled': ['submission', 'initial_review', 'detailed_review'],
      'accepted': ['submission', 'initial_review', 'detailed_review', 'interview', 'decision'],
      'rejected': ['submission', 'initial_review', 'detailed_review', 'decision']
    };

    const completedStages = statusMap[status] || ['submission'];
    
    if (completedStages.includes(stageId)) {
      return 'completed';
    }
    
    const stageOrder = ['submission', 'initial_review', 'detailed_review', 'interview', 'decision'];
    const lastCompleted = completedStages[completedStages.length - 1];
    const lastCompletedIndex = stageOrder.indexOf(lastCompleted);
    const currentIndex = stageOrder.indexOf(stageId);
    
    if (currentIndex === lastCompletedIndex + 1) {
      return 'in-progress';
    }
    
    return 'pending';
  };

  const stages: TimelineStage[] = [
    {
      id: 'submission',
      title: 'ثبت درخواست',
      description: 'درخواست شما با موفقیت ثبت شد',
      icon: CheckCircle2,
      days: formatDate(submissionDate),
      status: getStageStatus('submission')
    },
    {
      id: 'initial_review',
      title: 'بررسی اولیه',
      description: 'بررسی مدارک و اطلاعات پایه',
      icon: FileSearch,
      days: `${formatDate(addDays(submissionDate, 1))} - ${formatDate(addDays(submissionDate, 3))}`,
      status: getStageStatus('initial_review')
    },
    {
      id: 'detailed_review',
      title: 'بررسی تخصصی',
      description: 'ارزیابی دقیق مهارت‌ها و تجربیات',
      icon: Users,
      days: `${formatDate(addDays(submissionDate, 4))} - ${formatDate(addDays(submissionDate, 7))}`,
      status: getStageStatus('detailed_review')
    },
    {
      id: 'interview',
      title: 'مصاحبه',
      description: 'تعیین وقت و برگزاری مصاحبه',
      icon: Calendar,
      days: `${formatDate(addDays(submissionDate, 8))} - ${formatDate(addDays(submissionDate, 14))}`,
      status: getStageStatus('interview')
    },
    {
      id: 'decision',
      title: 'تصمیم نهایی',
      description: 'اعلام نتیجه نهایی',
      icon: Award,
      days: `${formatDate(addDays(submissionDate, 15))} - ${formatDate(addDays(submissionDate, 21))}`,
      status: getStageStatus('decision')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'pending':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">زمان‌بندی تقریبی</h3>
            <p className="text-sm text-gray-600">مراحل بررسی درخواست شما</p>
          </div>
        </div>

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isLast = index === stages.length - 1;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative"
              >
                <div className={`
                  p-4 rounded-xl border-2 transition-all
                  ${getStatusColor(stage.status)}
                `}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      p-3 rounded-lg flex-shrink-0 bg-white
                      ${stage.status === 'in-progress' ? 'animate-pulse' : ''}
                    `}>
                      <Icon className={`w-5 h-5 ${getIconColor(stage.status)}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{stage.title}</h4>
                        {stage.status === 'in-progress' && (
                          <span className="flex items-center gap-1 text-xs text-blue-600">
                            <Clock className="w-3 h-3" />
                            در حال انجام
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{stage.days}</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    {stage.status === 'completed' && (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="absolute right-[38px] top-[72px] w-0.5 h-4 bg-gray-300" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
        >
          <p className="text-sm text-blue-800">
            <strong>توجه:</strong> زمان‌های ذکر شده تقریبی هستند و ممکن است بسته به حجم درخواست‌ها متفاوت باشند.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};
