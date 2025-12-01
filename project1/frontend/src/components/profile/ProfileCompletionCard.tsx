import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ProfileCompletion } from '@/types/profile';

interface ProfileCompletionCardProps {
  completion: ProfileCompletion;
}

export default function ProfileCompletionCard({ completion }: ProfileCompletionCardProps) {
  const { completion: percentage, missingFields, completedSections } = completion;

  const sections = [
    { key: 'basicInfo', label: 'اطلاعات پایه', completed: completedSections.basicInfo },
    { key: 'contactInfo', label: 'اطلاعات تماس', completed: completedSections.contactInfo },
    { key: 'bio', label: 'بیوگرافی', completed: completedSections.bio },
    { key: 'avatar', label: 'تصویر پروفایل', completed: completedSections.avatar },
    { key: 'education', label: 'سوابق تحصیلی', completed: completedSections.education },
    { key: 'experience', label: 'سوابق کاری', completed: completedSections.experience },
    { key: 'skills', label: 'مهارت‌ها', completed: completedSections.skills },
    { key: 'certifications', label: 'گواهینامه‌ها', completed: completedSections.certifications },
    { key: 'socialLinks', label: 'لینک‌های اجتماعی', completed: completedSections.socialLinks }
  ];

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };

  const color = getCompletionColor(percentage);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          تکمیل پروفایل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">درصد تکمیل</span>
            <span className={`text-2xl font-bold text-${color}-600`}>
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Sections Checklist */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-3">
            بخش‌های پروفایل:
          </p>
          {sections.map((section) => (
            <div
              key={section.key}
              className="flex items-center gap-2 text-sm"
            >
              {section.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
              <span className={section.completed ? 'text-gray-700' : 'text-gray-500'}>
                {section.label}
              </span>
            </div>
          ))}
        </div>

        {/* Missing Fields */}
        {missingFields.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              برای تکمیل پروفایل:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              {missingFields.map((field, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}

        {percentage === 100 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                پروفایل شما کامل است! 🎉
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
