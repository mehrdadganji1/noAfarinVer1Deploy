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

function CertificationCard({
  certification,
  index,
  onDelete,
}: {
  certification: Certification;
  index: number;
  onDelete: (id: string) => void;
}) {
  const formatDate = (dateStr?: string) => dateStr ? toPersianDate(dateStr, 'short') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-full cursor-pointer"
    >
      <div className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-200 active:shadow-inner">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-l from-emerald-500 to-teal-500" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Award className="w-5 h-5 text-white" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {certification.url && (
                  <DropdownMenuItem asChild onClick={(e) => e.stopPropagation()}>
                    <a href={certification.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      مشاهده
                    </a>
                  </DropdownMenuItem>
                )}
                {certification._id && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(certification._id!); }} className="text-red-600">
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{certification.name}</h4>
            <p className="text-emerald-600 font-medium text-xs line-clamp-1">{certification.issuer}</p>

            {/* Dates */}
            <div className="space-y-1 text-xs text-slate-500">
              {certification.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>صدور: {formatDate(certification.date)}</span>
                </div>
              )}
              {certification.expiryDate && (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>انقضا: {formatDate(certification.expiryDate)}</span>
                </div>
              )}
            </div>

            {/* Credential ID */}
            {certification.credentialId && (
              <div className="pt-2 mt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">{certification.credentialId}</span>
              </div>
            )}
          </div>
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
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={Award}
        title="گواهینامه‌ها"
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
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' 
              : 'space-y-3'
            }
          >
            {certifications.map((cert, index) => (
              <CertificationCard
                key={cert._id || index}
                certification={cert}
                index={index}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        ) : (
          <ModernEmptyState
            icon={Award}
            title="هنوز گواهینامه‌ای ثبت نشده"
            description="گواهینامه‌ها و دوره‌های آموزشی خود را اضافه کنید."
            actionLabel="افزودن اولین گواهینامه"
            onAction={onAdd}
            gradient="from-emerald-500 to-teal-500"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
