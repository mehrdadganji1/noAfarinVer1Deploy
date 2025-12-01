import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { useApplicationProgress } from '@/hooks/useApplicationProgress';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  Mail,
  Calendar
} from 'lucide-react';

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  action?: string;
  actionLabel?: string;
  completed: boolean;
}

/**
 * Next Steps Card Component
 * Shows recommended next actions for the applicant
 */
export const NextStepsCard: FC = () => {
  const navigate = useNavigate();
  const { data: applicationData } = useApplicationStatus();
  const { percentage, missingSteps } = useApplicationProgress();
  const status = applicationData?.status || 'submitted';

  // Determine next steps based on status and progress
  const getNextSteps = (): NextStep[] => {
    const steps: NextStep[] = [];

    // Check profile completion
    if (percentage < 100) {
      steps.push({
        id: 'complete_profile',
        title: 'تکمیل پروفایل',
        description: `${missingSteps.join('، ')} را تکمیل کنید`,
        icon: FileText,
        action: '/applicant/profile',
        actionLabel: 'رفتن به پروفایل',
        completed: false
      });
    } else {
      steps.push({
        id: 'profile_complete',
        title: 'پروفایل کامل است',
        description: 'تمام بخش‌های پروفایل تکمیل شده',
        icon: CheckCircle2,
        completed: true
      });
    }

    // Check document upload
    const hasAllDocuments = (applicationData?.application?.documents?.length || 0) >= 5;
    if (!hasAllDocuments) {
      steps.push({
        id: 'upload_documents',
        title: 'آپلود مدارک',
        description: 'مدارک مورد نیاز را آپلود کنید',
        icon: Upload,
        action: '/applicant/profile',
        actionLabel: 'آپلود مدارک',
        completed: false
      });
    } else {
      steps.push({
        id: 'documents_uploaded',
        title: 'مدارک آپلود شده',
        description: 'تمام مدارک با موفقیت آپلود شده',
        icon: CheckCircle2,
        completed: true
      });
    }

    // Status-based steps
    if (status === 'submitted' || status === 'under_review') {
      steps.push({
        id: 'wait_review',
        title: 'منتظر بررسی باشید',
        description: 'تیم ما در حال بررسی درخواست شماست',
        icon: Mail,
        completed: false
      });
    }

    if (status === 'interview_scheduled') {
      steps.push({
        id: 'prepare_interview',
        title: 'آماده‌سازی مصاحبه',
        description: 'برای مصاحبه آماده شوید',
        icon: Calendar,
        action: '/applicant/help',
        actionLabel: 'نکات مصاحبه',
        completed: false
      });
    }

    // Always show: Check email
    steps.push({
      id: 'check_email',
      title: 'ایمیل خود را چک کنید',
      description: 'ممکن است پیام‌های مهمی دریافت کرده باشید',
      icon: Mail,
      completed: false
    });

    return steps;
  };

  const nextSteps = getNextSteps();
  const incompleteSteps = nextSteps.filter(step => !step.completed);

  return (
    <Card className="border-2 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">مراحل بعدی</h3>
            <p className="text-sm text-gray-600 mt-1">
              {incompleteSteps.length} مرحله باقی مانده
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {nextSteps.filter(s => s.completed).length}/{nextSteps.length}
            </div>
            <div className="text-xs text-gray-500">انجام شده</div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {nextSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-purple-300'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    p-3 rounded-lg flex-shrink-0
                    ${step.completed ? 'bg-green-100' : 'bg-purple-100'}
                  `}>
                    <Icon className={`w-5 h-5 ${step.completed ? 'text-green-600' : 'text-purple-600'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold mb-1 ${step.completed ? 'text-green-800' : 'text-gray-800'}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {step.description}
                    </p>

                    {/* Action Button */}
                    {step.action && !step.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={() => navigate(step.action!)}
                      >
                        {step.actionLabel}
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </Button>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {step.completed && (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Message */}
        {incompleteSteps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-bold text-green-800 mb-2">عالی! همه مراحل انجام شد</h4>
            <p className="text-sm text-green-700">
              درخواست شما کامل است. منتظر نتیجه بررسی باشید.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
