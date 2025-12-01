import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/useProfile';

interface ProfileCompletionProps {
  userId: string;
}

export default function ProfileCompletion({ userId }: ProfileCompletionProps) {
  const { data, isLoading } = useProfileCompletion(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تکمیل پروفایل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completion = data?.completion || 0;
  const completedSections = data?.completedSections || {};

  // Calculate color based on completion
  const getColor = () => {
    if (completion >= 80) return 'text-green-600 border-green-600';
    if (completion >= 50) return 'text-orange-600 border-orange-600';
    return 'text-red-600 border-red-600';
  };

  const getBackgroundColor = () => {
    if (completion >= 80) return 'bg-green-50';
    if (completion >= 50) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <Card className={getBackgroundColor()}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm sm:text-base">
          <span>تکمیل پروفایل</span>
          {completion === 100 ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-orange-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {/* Compact Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - completion / 100)}`}
                className={`${getColor()} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getColor()}`}>
                {completion}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600 text-center">
            {completion === 100
              ? 'پروفایل شما کامل است!'
              : `${100 - completion}% باقی مانده`}
          </p>
        </div>

        {/* Completed Sections */}
        <div className="space-y-1">
          <h4 className="font-semibold text-xs mb-2">بخش‌های پروفایل:</h4>
          
          <SectionItem 
            label="اطلاعات پایه"
            completed={completedSections.basicInfo}
          />
          <SectionItem 
            label="اطلاعات تماس"
            completed={completedSections.contactInfo}
          />
          <SectionItem 
            label="بیوگرافی"
            completed={completedSections.bio}
          />
          <SectionItem 
            label="تصویر پروفایل"
            completed={completedSections.avatar}
          />
          <SectionItem 
            label="سوابق تحصیلی"
            completed={completedSections.education}
          />
          <SectionItem 
            label="سوابق کاری"
            completed={completedSections.experience}
          />
          <SectionItem 
            label="مهارت‌ها"
            completed={completedSections.skills}
          />
          <SectionItem 
            label="گواهینامه‌ها"
            completed={completedSections.certifications}
          />
          <SectionItem 
            label="لینک‌های اجتماعی"
            completed={completedSections.socialLinks}
          />
        </div>

        {/* Motivational Message */}
        {completion < 100 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-[10px] text-gray-500 text-center">
              💡 تکمیل پروفایل شانس پذیرش را افزایش می‌دهد
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component
function SectionItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/50 transition-colors">
      <span className="text-xs text-gray-700">{label}</span>
      {completed ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-gray-300" />
      )}
    </div>
  );
}
