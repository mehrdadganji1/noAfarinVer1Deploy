import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  MoreVertical,
  Clock,
} from 'lucide-react';
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
  variant = 'default',
}: ModernExperienceCardProps) {
  const formatDate = (dateStr: string) => {
    return toPersianDate(dateStr, 'short');
  };

  const calculateDuration = () => {
    const start = new Date(experience.startDate);
    const end = experience.current
      ? new Date()
      : new Date(experience.endDate || new Date());
    const months = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} سال و ${remainingMonths} ماه`;
    } else if (years > 0) {
      return `${years} سال`;
    } else {
      return `${months} ماه`;
    }
  };

  // Compact variant for sidebar or small spaces
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {experience.position}
          </h4>
          <p className="text-xs text-gray-500 truncate">{experience.company}</p>
        </div>
        {experience.current && (
          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-[10px] px-1.5 py-0.5">
            فعلی
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
        <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-indigo-500" />
        <div className="absolute right-0 top-4 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Briefcase className="w-3 h-3 text-white" />
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 hover:border-purple-300 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{experience.position}</h4>
                {experience.current && (
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs">
                    شغل فعلی
                  </Badge>
                )}
              </div>
              <p className="text-purple-600 font-medium text-sm">
                {experience.company}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(experience.startDate)} -{' '}
                  {experience.current
                    ? 'اکنون'
                    : formatDate(experience.endDate || '')}
                </span>
                <span className="text-purple-600 font-medium">
                  • {calculateDuration()}
                </span>
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
                  <DropdownMenuItem onClick={() => onEdit(experience)}>
                    <Edit2 className="w-4 h-4 ml-2" />
                    ویرایش
                  </DropdownMenuItem>
                )}
                {onDelete && experience._id && (
                  <DropdownMenuItem
                    onClick={() => onDelete(experience._id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {experience.description && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">
              {experience.description}
            </p>
          )}
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
        <div className="h-full bg-white rounded-2xl border-2 border-gray-300 overflow-hidden hover:border-purple-400 hover:shadow-2xl transition-all duration-300">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-l from-purple-500 via-indigo-500 to-violet-600" />

          <div className="p-4">
            {/* Header with icon and actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200/50">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                {experience.current && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
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
                    <DropdownMenuItem onClick={() => onEdit(experience)}>
                      <Edit2 className="w-4 h-4 ml-2" />
                      ویرایش
                    </DropdownMenuItem>
                  )}
                  {onDelete && experience._id && (
                    <DropdownMenuItem
                      onClick={() => onDelete(experience._id!)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title and company */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="text-base font-bold text-gray-900 line-clamp-1">
                  {experience.position}
                </h4>
                {experience.current && (
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5">
                    شغل فعلی
                  </Badge>
                )}
              </div>
              <p className="text-purple-600 font-semibold text-sm line-clamp-1">
                {experience.company}
              </p>
            </div>

            {/* Meta info */}
            <div className="space-y-2 text-xs text-gray-500">
              {experience.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{experience.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {formatDate(experience.startDate)} -{' '}
                  {experience.current
                    ? 'حال حاضر'
                    : formatDate(experience.endDate || '')}
                </span>
              </div>
            </div>

            {/* Duration badge */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-full border border-purple-200">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-semibold text-purple-700">
                  {calculateDuration()}
                </span>
              </div>
            </div>
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
      <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden hover:border-purple-400 hover:shadow-2xl transition-all duration-300">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-l from-purple-500 via-indigo-500 to-violet-600" />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon with gradient background */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-200/50">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              {experience.current && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-gray-900">
                      {experience.position}
                    </h4>
                    {experience.current && (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold">
                        شغل فعلی
                      </Badge>
                    )}
                  </div>
                  <p className="text-purple-600 font-semibold mt-0.5">
                    {experience.company}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(experience)}
                      className="h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && experience._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(experience._id!)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                {experience.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{experience.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {formatDate(experience.startDate)} -{' '}
                    {experience.current
                      ? 'در حال حاضر'
                      : formatDate(experience.endDate || '')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-50 rounded-full border border-purple-200">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">
                    {calculateDuration()}
                  </span>
                </div>
              </div>

              {/* Description */}
              {experience.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
