import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface ApplicationProgressIndicatorProps {
  applicationStatus?: string;
  documentsCompleted: boolean;
  profileCompleted: boolean;
  interviewScheduled: boolean;
  className?: string;
}

export default function ApplicationProgressIndicator({
  applicationStatus = 'not_submitted',
  documentsCompleted = false,
  profileCompleted = false,
  interviewScheduled = false,
  className
}: ApplicationProgressIndicatorProps) {
  
  // Define progress steps based on application flow
  const steps: ProgressStep[] = [
    {
      id: 'profile',
      title: 'تکمیل پروفایل',
      description: 'اطلاعات شخصی و تحصیلی',
      completed: profileCompleted,
      current: !profileCompleted && applicationStatus === 'not_submitted'
    },
    {
      id: 'application',
      title: 'ثبت درخواست',
      description: 'فرم درخواست عضویت',
      completed: applicationStatus !== 'not_submitted',
      current: profileCompleted && applicationStatus === 'not_submitted'
    },
    {
      id: 'documents',
      title: 'آپلود مدارک',
      description: 'مدارک مورد نیاز',
      completed: documentsCompleted && applicationStatus !== 'not_submitted',
      current: applicationStatus === 'pending' && !documentsCompleted
    },
    {
      id: 'review',
      title: 'بررسی درخواست',
      description: 'توسط کارشناسان',
      completed: applicationStatus === 'under_review' || applicationStatus === 'interview_scheduled' || applicationStatus === 'approved',
      current: applicationStatus === 'under_review'
    },
    {
      id: 'interview',
      title: 'مصاحبه',
      description: 'مصاحبه حضوری/آنلاین',
      completed: interviewScheduled && (applicationStatus === 'approved' || applicationStatus === 'rejected'),
      current: applicationStatus === 'interview_scheduled'
    },
    {
      id: 'decision',
      title: 'تصمیم نهایی',
      description: 'تایید یا رد درخواست',
      completed: applicationStatus === 'approved' || applicationStatus === 'rejected',
      current: false
    }
  ];

  // Calculate overall progress
  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Get current step info
  const currentStep = steps.find(s => s.current) || steps[completedSteps];

  return (
    <Card className={cn('border-2', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>پیشرفت درخواست</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-gray-600">
              {completedSteps} از {totalSteps}
            </span>
            <span className="text-2xl font-bold text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          {currentStep && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">مرحله فعلی:</span> {currentStep.title}
            </p>
          )}
        </div>

        {/* Step-by-step Progress */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                <div className={cn(
                  'flex items-start gap-3 p-3 rounded-lg transition-all',
                  step.completed && 'bg-green-50',
                  step.current && 'bg-blue-50 ring-2 ring-blue-200',
                  !step.completed && !step.current && 'bg-gray-50'
                )}>
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    step.completed && 'bg-green-500 text-white',
                    step.current && 'bg-blue-500 text-white animate-pulse',
                    !step.completed && !step.current && 'bg-gray-300 text-gray-600'
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.current ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      'font-medium leading-tight',
                      step.completed && 'text-green-900',
                      step.current && 'text-blue-900',
                      !step.completed && !step.current && 'text-gray-600'
                    )}>
                      {step.title}
                    </h4>
                    <p className={cn(
                      'text-sm leading-tight mt-0.5',
                      step.completed && 'text-green-700',
                      step.current && 'text-blue-700',
                      !step.completed && !step.current && 'text-gray-500'
                    )}>
                      {step.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {step.completed && (
                    <div className="flex-shrink-0">
                      <span className="text-xs font-semibold text-green-600">
                        ✓ انجام شد
                      </span>
                    </div>
                  )}
                  {step.current && (
                    <div className="flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">
                        در حال انجام
                      </span>
                    </div>
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className={cn(
                    'absolute right-[27px] top-[52px] w-0.5 h-3',
                    step.completed ? 'bg-green-400' : 'bg-gray-300'
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        {applicationStatus === 'approved' && (
          <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
            <p className="text-sm font-medium text-green-900 text-center">
              🎉 تبریک! درخواست شما تایید شد
            </p>
          </div>
        )}
        {applicationStatus === 'rejected' && (
          <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
            <p className="text-sm font-medium text-red-900 text-center">
              درخواست شما رد شد. لطفاً با پشتیبانی تماس بگیرید
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
