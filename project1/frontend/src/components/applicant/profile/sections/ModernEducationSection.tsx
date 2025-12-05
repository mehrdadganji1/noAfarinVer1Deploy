import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Education } from '@/hooks/useProfile';
import { ModernSectionHeader } from '../cards/ModernSectionHeader';
import { ModernEducationCard } from '../cards/ModernEducationCard';
import { ModernEmptyState } from '../cards/ModernEmptyState';

interface ModernEducationSectionProps {
  educationHistory: Education[];
  onAdd: () => void;
  onEdit: (education: Education) => void;
  onDelete: (eduId: string) => void;
}

export function ModernEducationSection({
  educationHistory,
  onAdd,
  onEdit,
  onDelete,
}: ModernEducationSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sort by current first, then by start date
  const sortedEducation = [...(educationHistory || [])].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={GraduationCap}
        title="سوابق تحصیلی"
        subtitle="مدارک و سوابق تحصیلی خود را مدیریت کنید"
        count={educationHistory?.length}
        onAdd={onAdd}
        addLabel="افزودن تحصیلات"
        gradient="from-blue-500 to-cyan-500"
        showViewToggle={educationHistory?.length > 0}
        onViewChange={setViewMode}
        currentView={viewMode}
      />

      <AnimatePresence mode="wait">
        {sortedEducation && sortedEducation.length > 0 ? (
          <motion.div
            key={`education-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' 
              : 'space-y-3'
            }
          >
            {sortedEducation.map((edu, index) => (
              <ModernEducationCard
                key={edu._id || index}
                education={edu}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                variant={viewMode === 'grid' ? 'grid' : 'default'}
              />
            ))}
          </motion.div>
        ) : (
          <ModernEmptyState
            icon={GraduationCap}
            title="هنوز سابقه تحصیلی ثبت نشده"
            description="با افزودن سوابق تحصیلی، پروفایل کامل‌تری داشته باشید."
            actionLabel="افزودن اولین مدرک"
            onAction={onAdd}
            gradient="from-blue-500 to-cyan-500"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
