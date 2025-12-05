import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Award, Edit2, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toPersianDate } from '@/utils/dateUtils';

interface Education {
  _id?: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  achievements?: string;
}

interface ModernEducationCardProps {
  education: Education;
  index: number;
  onEdit?: (edu: Education) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'timeline' | 'grid';
}

const degreeColors: Record<string, { bg: string; text: string; border: string }> = {
  'کارشناسی': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'کارشناسی ارشد': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  'دکتری': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  'دیپلم': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

export function ModernEducationCard({
  education,
  index,
  onEdit,
  onDelete,
  variant = 'grid',
}: ModernEducationCardProps) {
  const formatDate = (dateStr: string) => toPersianDate(dateStr, 'short');
  const colors = degreeColors[education.degree] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

  const handleCardClick = () => {
    if (onEdit) onEdit(education);
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
      <div className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-violet-300 hover:shadow-lg transition-all duration-200 active:shadow-inner">
        {/* Top accent */}
        <div className={`h-1 bg-gradient-to-l from-violet-500 to-purple-600`} />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md`}>
              <GraduationCap className="w-5 h-5 text-white" />
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
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(education); }}>
                    <Edit2 className="w-4 h-4 ml-2" />
                    ویرایش
                  </DropdownMenuItem>
                )}
                {onDelete && education._id && (
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onDelete(education._id!); }}
                    className="text-red-600"
                  >
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
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                {education.degree} {education.major}
              </h4>
              {education.current && (
                <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-[10px] font-semibold rounded-full border ${colors.border}`}>
                  در حال تحصیل
                </span>
              )}
            </div>
            
            <p className="text-violet-600 font-medium text-xs line-clamp-1">
              {education.institution}
            </p>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDate(education.startDate)} - {education.current ? 'اکنون' : formatDate(education.endDate || '')}
              </span>
            </div>

            {/* GPA */}
            {education.gpa && (
              <div className="pt-2 mt-2 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700">معدل: {education.gpa}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
