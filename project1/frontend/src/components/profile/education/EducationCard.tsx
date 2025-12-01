import { GraduationCap, Calendar, Edit2, Trash2, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toPersianDate } from '@/utils/dateUtils';
import type { Education } from '@/types/profile';

interface EducationCardProps {
  education: Education;
  onEdit?: (education: Education) => void;
  onDelete?: (id: string) => void;
  isOwnProfile: boolean;
}

export default function EducationCard({ education, onEdit, onDelete, isOwnProfile }: EducationCardProps) {
  const formatDate = (date: string) => {
    return toPersianDate(date, 'short');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {education.degree} - {education.major}
                </h3>
                <p className="text-gray-600 mt-1">{education.institution}</p>
              </div>

              {isOwnProfile && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(education)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => education._id && onDelete?.(education._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(education.startDate)}
                {' - '}
                {education.current ? 'در حال تحصیل' : education.endDate ? formatDate(education.endDate) : 'نامشخص'}
              </span>
              {education.current && (
                <Badge variant="secondary" className="text-xs">
                  در حال تحصیل
                </Badge>
              )}
            </div>

            {/* GPA */}
            {education.gpa && (
              <div className="flex items-center gap-2 mt-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-gray-700">
                  معدل: <span className="font-bold">{education.gpa}</span>
                </span>
              </div>
            )}

            {/* Achievements */}
            {education.achievements && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {education.achievements}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
