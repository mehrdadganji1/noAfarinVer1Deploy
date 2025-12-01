import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { WorkExperience } from '@/hooks/useProfile';
import { ModernSectionHeader } from '../cards/ModernSectionHeader';
import { ModernExperienceCard } from '../cards/ModernExperienceCard';
import { ModernEmptyState } from '../cards/ModernEmptyState';

interface ModernExperienceSectionProps {
  workExperience: WorkExperience[];
  onAdd: () => void;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (expId: string) => void;
}

export function ModernExperienceSection({
  workExperience,
  onAdd,
  onEdit,
  onDelete,
}: ModernExperienceSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sort by current first, then by start date
  const sortedExperience = [...(workExperience || [])].sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={Briefcase}
        title="سوابق کاری"
        subtitle="تجربیات حرفه‌ای و شغلی خود را مدیریت کنید"
        count={workExperience?.length}
        onAdd={onAdd}
        addLabel="افزودن سابقه"
        gradient="from-purple-500 to-indigo-500"
        showViewToggle={workExperience?.length > 0}
        onViewChange={setViewMode}
        currentView={viewMode}
      />

      <AnimatePresence mode="wait">
        {sortedExperience && sortedExperience.length > 0 ? (
          <motion.div
            key={`experience-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                : 'space-y-4'
            }
          >
            {sortedExperience.map((exp, index) => (
              <ModernExperienceCard
                key={exp._id || index}
                experience={exp}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                variant={viewMode === 'grid' ? 'grid' : 'default'}
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
              icon={Briefcase}
              title="هنوز سابقه کاری ثبت نشده"
              description="با افزودن سوابق کاری، پروفایل حرفه‌ای‌تری داشته باشید و شانس پذیرش خود را افزایش دهید."
              actionLabel="افزودن اولین سابقه"
              onAction={onAdd}
              gradient="from-purple-500 to-indigo-500"
              variant="illustrated"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
