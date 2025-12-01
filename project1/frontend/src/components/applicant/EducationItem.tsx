import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';
import { Education } from '@/hooks/useProfile';
import { toPersianDate } from '@/utils/dateUtils';
import { useState } from 'react';

interface EducationItemProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export default function EducationItem({ education, onEdit, onDelete }: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format dates
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return toPersianDate(date, 'short');
  };

  const startDate = formatDate(education.startDate);
  const endDate = education.current ? 'در حال تحصیل' : formatDate(education.endDate);

  return (
    <div className="relative group/item">
      {/* Gradient left accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D9FF] to-[#00B8D9] rounded-r-lg opacity-100 group-hover/item:w-1.5 transition-all" />
      
      <Card className="hover:shadow-md hover:border-[#00D9FF]/30 transition-all duration-200 border-r-0">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#00D9FF]/15 to-[#00D9FF]/5 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5 text-[#00D9FF]" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {education.degree}
                    </h3>
                    {education.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 border border-green-200">
                        در حال تحصیل
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#00D9FF] font-medium">{education.major}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{education.institution}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(education)}
                    className="h-7 w-7 p-0 hover:bg-[#00D9FF]/10 hover:text-[#00D9FF]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => education._id && onDelete(education._id)}
                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{startDate} - {endDate}</span>
                </div>
                
                {/* GPA */}
                {education.gpa && (
                  <div className="flex items-center gap-1 text-xs">
                    <Award className="h-3 w-3 text-yellow-600" />
                    <span className="text-gray-600">
                      معدل: <span className="font-semibold text-gray-900">{education.gpa.toFixed(2)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Achievements - Expandable */}
              {education.achievements && (
                <div className="mt-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-[#00D9FF] hover:text-[#00B8D9] font-medium flex items-center gap-1"
                  >
                    {isExpanded ? 'بستن' : 'مشاهده'} دستاوردها
                  </button>
                  {isExpanded && (
                    <div className="mt-2 p-2 bg-gradient-to-br from-[#00D9FF]/5 to-transparent rounded-lg border border-[#00D9FF]/20">
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {education.achievements}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
