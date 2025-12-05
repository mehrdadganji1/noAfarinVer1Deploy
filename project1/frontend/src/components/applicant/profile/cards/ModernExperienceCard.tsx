import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Calendar, Edit2, Trash2, MoreVertical, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toPersianDate } from '@/utils/dateUtils';

interface Experience {
  _id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  location?: string;
}

interface ModernExperienceCardProps {
  experience: Experience;
  index: number;
  onEdit?: (exp: Experience) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'timeline' | 'grid';
}

export function ModernExperienceCard({
  experience,
  index,
  onEdit,
  onDelete,
  variant = 'grid',
}: ModernExperienceCardProps) {
  const formatDate = (dateStr: string) => toPersianDate(dateStr, 'short');

  const calculateDuration = () => {
    const start = new Date(experience.startDate);
    const end = experience.current ? new Date() : new Date(experience.endDate || new Date());
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) return `${years} سال و ${remainingMonths} ماه`;
    if (years > 0) return `${years} سال`;
    return `${months} ماه`;
  };

  const handleCardClick = () => {
    if (onEdit) onEdit(experience);
  };

  // Grid variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group relative h-full cursor-pointer"
    >
      <div className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all duration-200 active:shadow-inner">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-l from-purple-500 to-indigo-600" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              {experience.current && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(experience); }}>
                    <Edit2 className="w-4 h-4 ml-2" />
                    ویرایش
                  </DropdownMenuItem>
                )}
                {onDelete && experience._id && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(experience._id!); }} className="text-red-600">
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{experience.position}</h4>
              {experience.current && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full border border-emerald-200">
                  فعلی
                </span>
              )}
            </div>
            
            <p className="text-purple-600 font-medium text-xs line-clamp-1">{experience.company}</p>

            {/* Location */}
            {experience.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{experience.location}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDate(experience.startDate)} - {experience.current ? 'اکنون' : formatDate(experience.endDate || '')}
              </span>
            </div>

            {/* Duration */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-semibold text-purple-700">{calculateDuration()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
