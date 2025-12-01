import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certification } from '@/hooks/useProfile';
import { ModernSectionHeader } from '../cards/ModernSectionHeader';
import { ModernEmptyState } from '../cards/ModernEmptyState';
import { toPersianDate } from '@/utils/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModernCertificationsSectionProps {
  certifications: Certification[];
  onAdd: () => void;
  onDelete: (certId: string) => void;
}

function ModernCertificationCard({
  certification,
  index,
  onDelete,
}: {
  certification: Certification;
  index: number;
  onDelete: (id: string) => void;
}) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return toPersianDate(dateStr, 'short');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative h-full"
    >
      <div className="h-full bg-white rounded-2xl border-2 border-gray-300 overflow-hidden hover:border-emerald-400 hover:shadow-2xl transition-all duration-300">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-4">
          {/* Header with icon and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <Award className="w-6 h-6 text-white" />
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
                {certification.url && (
                  <DropdownMenuItem asChild>
                    <a href={certification.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      مشاهده گواهینامه
                    </a>
                  </DropdownMenuItem>
                )}
                {certification._id && (
                  <DropdownMenuItem
                    onClick={() => onDelete(certification._id!)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title and issuer */}
          <div className="mb-3">
            <h4 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">
              {certification.name}
            </h4>
            <p className="text-emerald-600 font-semibold text-sm line-clamp-1">
              {certification.issuer}
            </p>
          </div>

          {/* Meta info */}
          <div className="space-y-2 text-xs text-gray-500">
            {certification.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>صدور: {formatDate(certification.date)}</span>
              </div>
            )}
            {certification.expiryDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600">انقضا: {formatDate(certification.expiryDate)}</span>
              </div>
            )}
          </div>

          {/* Credential ID */}
          {certification.credentialId && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-200">
                <span className="text-xs text-gray-500">شناسه:</span>
                <span className="text-xs font-mono font-medium text-gray-700">
                  {certification.credentialId}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ModernCertificationsSection({
  certifications,
  onAdd,
  onDelete,
}: ModernCertificationsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={Award}
        title="گواهینامه‌ها و مدارک"
        subtitle="گواهینامه‌ها و دوره‌های آموزشی خود را مدیریت کنید"
        count={certifications?.length}
        onAdd={onAdd}
        addLabel="افزودن گواهینامه"
        gradient="from-emerald-500 to-teal-500"
        showViewToggle={certifications?.length > 0}
        onViewChange={setViewMode}
        currentView={viewMode}
      />

      <AnimatePresence mode="wait">
        {certifications && certifications.length > 0 ? (
          <motion.div
            key={`certifications-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-4'
            }
          >
            {certifications.map((cert, index) => (
              <ModernCertificationCard
                key={cert._id || index}
                certification={cert}
                index={index}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModernEmptyState
              icon={Award}
              title="هنوز گواهینامه‌ای ثبت نشده"
              description="گواهینامه‌ها و دوره‌های آموزشی خود را اضافه کنید تا مهارت‌هایتان بهتر دیده شود."
              actionLabel="افزودن اولین گواهینامه"
              onAction={onAdd}
              gradient="from-emerald-500 to-teal-500"
              variant="illustrated"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
