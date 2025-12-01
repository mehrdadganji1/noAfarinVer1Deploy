import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Calendar,
  Award,
  Edit2,
  Trash2,
  MoreVertical,
  BookOpen,
  Star,
} from 'lucide-react';
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

const degreeGradients: Record<
  string,
  { bg: string; icon: string; badge: string }
> = {
  کارشناسی: {
    bg: 'from-blue-500 to-cyan-500',
    icon: 'from-blue-100 to-cyan-100',
    badge: 'bg-blue-50 text-blue-700 border-blue-300',
  },
  'کارشناسی ارشد': {
    bg: 'from-purple-500 to-pink-500',
    icon: 'from-purple-100 to-pink-100',
    badge: 'bg-purple-50 text-purple-700 border-purple-300',
  },
  دکتری: {
    bg: 'from-amber-500 to-orange-500',
    icon: 'from-amber-100 to-orange-100',
    badge: 'bg-amber-50 text-amber-700 border-amber-300',
  },
  دیپلم: {
    bg: 'from-green-500 to-emerald-500',
    icon: 'from-green-100 to-emerald-100',
    badge: 'bg-green-50 text-green-700 border-green-300',
  },
};

export function ModernEducationCard({
  education,
  index,
  onEdit,
  onDelete,
  variant = 'default',
}: ModernEducationCardProps) {
  const formatDate = (dateStr: string) => {
    return toPersianDate(dateStr, 'short');
  };

  const colors = degreeGradients[education.degree] || {
    bg: 'from-gray-500 to-slate-500',
    icon: 'from-gray-100 to-slate-100',
    badge: 'bg-gray-50 text-gray-700 border-gray-300',
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {education.degree} {education.major}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {education.institution}
          </p>
        </div>
        {education.current && (
          <Badge className="bg-blue-100 text-blue-700 border border-blue-300 text-[10px] px-1.5 py-0.5">
            در حال تحصیل
          </Badge>
        )}
      </motion.div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative pr-8"
      >
        <div
          className={`absolute right-3 top-0 bottom-0 w-0.5 bg-gradient-to-b ${colors.bg}`}
        />
        <div
          className={`absolute right-0 top-4 w-6 h-6 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg`}
        >
          <GraduationCap className="w-3 h-3 text-white" />
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">
                  {education.degree} {education.major}
                </h4>
                {education.current && (
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-300 text-xs">
                    در حال تحصیل
                  </Badge>
                )}
              </div>
              <p className="text-blue-600 font-medium text-sm">
                {education.institution}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(education.startDate)} -{' '}
                  {education.current
                    ? 'اکنون'
                    : formatDate(education.endDate || '')}
                </span>
                {education.gpa && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Star className="w-3 h-3 fill-amber-400" />
                    معدل: {education.gpa}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(education)}>
                    <Edit2 className="w-4 h-4 ml-2" />
                    ویرایش
                  </DropdownMenuItem>
                )}
                {onDelete && education._id && (
                  <DropdownMenuItem
                    onClick={() => onDelete(education._id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant - Compact card for grid layout
  if (variant === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative h-full"
      >
        <div className="h-full bg-white rounded-2xl border-2 border-gray-300 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
          {/* Top gradient bar */}
          <div className={`h-1.5 bg-gradient-to-l ${colors.bg}`} />

          <div className="p-4">
            {/* Header with icon and actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg shadow-blue-200/50`}
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                {education.current && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(education)}>
                      <Edit2 className="w-4 h-4 ml-2" />
                      ویرایش
                    </DropdownMenuItem>
                  )}
                  {onDelete && education._id && (
                    <DropdownMenuItem
                      onClick={() => onDelete(education._id!)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title and institution */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="text-base font-bold text-gray-900 line-clamp-1">
                  {education.degree} {education.major}
                </h4>
                {education.current && (
                  <Badge
                    className={`${colors.badge} border text-[10px] font-semibold px-2 py-0.5`}
                  >
                    در حال تحصیل
                  </Badge>
                )}
              </div>
              <p className="text-blue-600 font-semibold text-sm line-clamp-1">
                {education.institution}
              </p>
            </div>

            {/* Meta info */}
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {formatDate(education.startDate)} -{' '}
                  {education.current
                    ? 'در حال تحصیل'
                    : formatDate(education.endDate || '')}
                </span>
              </div>
            </div>

            {/* GPA badge */}
            {education.gpa && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-200">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700">
                    معدل: {education.gpa}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant - Full card design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="group relative"
    >
      <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
        {/* Top gradient bar */}
        <div className={`h-1.5 bg-gradient-to-l ${colors.bg}`} />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon with gradient background */}
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-xl shadow-blue-200/50`}
              >
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              {education.current && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-gray-900">
                      {education.degree} {education.major}
                    </h4>
                    {education.current && (
                      <Badge
                        className={`${colors.badge} border text-xs font-semibold`}
                      >
                        در حال تحصیل
                      </Badge>
                    )}
                  </div>
                  <p className="text-blue-600 font-semibold mt-0.5">
                    {education.institution}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(education)}
                      className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && education._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(education._id!)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDate(education.startDate)} -{' '}
                    {education.current
                      ? 'در حال تحصیل'
                      : formatDate(education.endDate || '')}
                  </span>
                </div>
                {education.gpa && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-700">
                      معدل: {education.gpa}
                    </span>
                  </div>
                )}
              </div>

              {/* Achievements */}
              {education.achievements && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {education.achievements}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
