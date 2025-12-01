import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { WorkExperience } from '@/hooks/useProfile';
import { toPersianDate } from '@/utils/dateUtils';
import { useState } from 'react';

interface ExperienceItemProps {
  experience: WorkExperience;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: string) => void;
}

export default function ExperienceItem({ experience, onEdit, onDelete }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format dates
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return toPersianDate(date, 'short');
  };

  // Calculate duration
  const calculateDuration = () => {
    const start = new Date(experience.startDate);
    const end = experience.current ? new Date() : new Date(experience.endDate || '');
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} سال و ${remainingMonths} ماه`;
    } else if (years > 0) {
      return `${years} سال`;
    } else {
      return `${remainingMonths} ماه`;
    }
  };

  const startDate = formatDate(experience.startDate);
  const endDate = experience.current ? 'در حال حاضر' : formatDate(experience.endDate);
  const duration = calculateDuration();

  return (
    <div className="relative group/item">
      {/* Gradient left accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7209B7] to-[#AB47BC] rounded-r-lg opacity-100 group-hover/item:w-1.5 transition-all" />
      
      <Card className="hover:shadow-md hover:border-[#7209B7]/30 transition-all duration-200 border-r-0">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#7209B7]/15 to-[#7209B7]/5 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <Briefcase className="h-5 w-5 text-[#7209B7]" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {experience.position}
                    </h3>
                    {experience.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 border border-green-200">
                        شغل فعلی
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7209B7] font-medium">{experience.company}</p>
                  {experience.location && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-600">{experience.location}</p>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(experience)}
                    className="h-7 w-7 p-0 hover:bg-[#7209B7]/10 hover:text-[#7209B7]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => experience._id && onDelete(experience._id)}
                    className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{startDate} - {endDate}</span>
                </div>
                
                {/* Duration */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-600">{duration}</span>
                </div>
              </div>

              {/* Description - Expandable */}
              {experience.description && (
                <div className="mt-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-[#7209B7] hover:text-[#AB47BC] font-medium flex items-center gap-1"
                  >
                    {isExpanded ? 'بستن' : 'مشاهده'} شرح وظایف
                  </button>
                  {isExpanded && (
                    <div className="mt-2 p-2 bg-gradient-to-br from-[#7209B7]/5 to-transparent rounded-lg border border-[#7209B7]/20">
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {experience.description}
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
