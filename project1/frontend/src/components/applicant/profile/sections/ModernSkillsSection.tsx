import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Target } from 'lucide-react';
import SkillFormModal from '../../SkillFormModal';
import { Skill } from '@/hooks/useProfile';
import { ModernSectionHeader } from '../cards/ModernSectionHeader';
import { ModernEmptyState } from '../cards/ModernEmptyState';

interface ModernSkillsSectionProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
  isLoading?: boolean;
}

// Proficiency configuration
const PROFICIENCY_CONFIG: Record<string, { label: string; stars: number; color: string }> = {
  'beginner': { label: 'مبتدی', stars: 1, color: '#94a3b8' },
  'intermediate': { label: 'متوسط', stars: 2, color: '#3b82f6' },
  'advanced': { label: 'پیشرفته', stars: 3, color: '#8b5cf6' },
  'expert': { label: 'متخصص', stars: 4, color: '#f59e0b' },
  'مبتدی': { label: 'مبتدی', stars: 1, color: '#94a3b8' },
  'متوسط': { label: 'متوسط', stars: 2, color: '#3b82f6' },
  'خوب': { label: 'خوب', stars: 3, color: '#10b981' },
  'پیشرفته': { label: 'پیشرفته', stars: 3, color: '#8b5cf6' },
  'عالی': { label: 'عالی', stars: 4, color: '#f59e0b' },
  'حرفه‌ای': { label: 'حرفه‌ای', stars: 5, color: '#ec4899' },
};

function SkillCard({
  skill,
  index,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  index: number;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}) {
  const config = PROFICIENCY_CONFIG[skill.proficiency] || PROFICIENCY_CONFIG['intermediate'];

  const handleCardClick = () => {
    onEdit(skill);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-violet-300 transition-all duration-200 hover:shadow-md overflow-hidden cursor-pointer active:shadow-inner"
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          skill._id && onDelete(skill._id);
        }}
        className="absolute top-2 left-2 p-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50 hover:scale-110 z-10"
      >
        <X className="w-3.5 h-3.5 text-red-500" />
      </button>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-slate-800 text-sm leading-tight">{skill.name}</h4>
          {skill.category && (
            <span 
              className="px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
              style={{ backgroundColor: `${config.color}15`, color: config.color }}
            >
              {skill.category}
            </span>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={i < config.stars ? config.color : 'none'}
                stroke={i < config.stars ? config.color : '#e2e8f0'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
          <span className="text-xs text-slate-500 mr-1">{config.label}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(config.stars / 5) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="h-full rounded-full"
            style={{ backgroundColor: config.color }}
          />
        </div>

        {/* Edit Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(skill); }}
          className="w-full py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-violet-50 hover:text-violet-600 transition-colors md:opacity-0 md:group-hover:opacity-100 active:scale-95"
        >
          ویرایش
        </button>
      </div>
    </motion.div>
  );
}

export function ModernSkillsSection({
  skills,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}: ModernSkillsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAdd = () => {
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSubmit = async (skill: Skill) => {
    try {
      if (editingSkill?._id) {
        await onEdit({ ...skill, _id: editingSkill._id });
      } else {
        await onAdd(skill);
      }
      setIsModalOpen(false);
      setEditingSkill(undefined);
    } catch (error) {
      console.error('Error submitting skill:', error);
    }
  };

  // Group skills by category
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'سایر';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={Target}
        title="مهارت‌ها"
        subtitle="مهارت‌های فنی و تخصصی خود را مدیریت کنید"
        count={skills?.length}
        onAdd={handleAdd}
        addLabel="افزودن مهارت"
        gradient="from-violet-500 to-purple-600"
        showViewToggle={skills?.length > 0}
        onViewChange={setViewMode}
        currentView={viewMode}
      />

      <AnimatePresence mode="wait">
        {skills && skills.length > 0 ? (
          <motion.div
            key={`skills-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
                  <h3 className="text-xs font-bold text-slate-600">{category}</h3>
                  <span className="text-[10px] text-slate-400">({categorySkills.length})</span>
                </div>

                {/* Skills grid */}
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' 
                  : 'space-y-3'
                }>
                  {categorySkills.map((skill, index) => (
                    <SkillCard
                      key={`${skill._id}-${skill.proficiency}`}
                      skill={skill}
                      index={index}
                      onEdit={handleEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <ModernEmptyState
            icon={Sparkles}
            title="هنوز مهارتی اضافه نشده"
            description="مهارت‌های خود را اضافه کنید تا پروفایل شما کامل‌تر شود."
            actionLabel="افزودن اولین مهارت"
            onAction={handleAdd}
            gradient="from-violet-500 to-purple-600"
          />
        )}
      </AnimatePresence>

      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={editingSkill}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
