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

// Support both English and Persian proficiency values
const PROFICIENCY_CONFIG: Record<string, { label: string; stars: number; gradient: string; bg: string }> = {
  // English values (from form)
  'beginner': { label: 'مبتدی', stars: 1, gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-100 border-gray-300 hover:border-gray-400' },
  'intermediate': { label: 'متوسط', stars: 2, gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 border-blue-300 hover:border-blue-400' },
  'advanced': { label: 'پیشرفته', stars: 3, gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 border-purple-300 hover:border-purple-400' },
  'expert': { label: 'متخصص', stars: 4, gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50 border-amber-300 hover:border-amber-400' },
  // Persian values (legacy)
  'مبتدی': { label: 'مبتدی', stars: 1, gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-100 border-gray-300 hover:border-gray-400' },
  'متوسط': { label: 'متوسط', stars: 2, gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 border-blue-300 hover:border-blue-400' },
  'خوب': { label: 'خوب', stars: 3, gradient: 'from-green-400 to-emerald-500', bg: 'bg-green-50 border-green-300 hover:border-green-400' },
  'پیشرفته': { label: 'پیشرفته', stars: 3, gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50 border-purple-300 hover:border-purple-400' },
  'عالی': { label: 'عالی', stars: 4, gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50 border-amber-300 hover:border-amber-400' },
  'حرفه‌ای': { label: 'حرفه‌ای', stars: 5, gradient: 'from-rose-400 to-pink-600', bg: 'bg-rose-50 border-rose-300 hover:border-rose-400' },
};



function ModernSkillCard({
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
  const uniqueId = `star-gradient-${skill._id || index}`;

  // Get gradient colors for inline style
  const getGradientColors = (gradient: string) => {
    const colorMap: Record<string, string> = {
      'gray-400': '#9ca3af', 'gray-500': '#6b7280',
      'blue-400': '#60a5fa', 'blue-600': '#2563eb',
      'purple-400': '#c084fc', 'purple-600': '#9333ea',
      'amber-400': '#fbbf24', 'orange-500': '#f97316',
      'green-400': '#4ade80', 'emerald-500': '#10b981',
      'rose-400': '#fb7185', 'pink-600': '#db2777',
    };
    const parts = gradient.split(' ');
    const from = parts[0]?.replace('from-', '') || 'blue-400';
    const to = parts[1]?.replace('to-', '') || 'blue-600';
    return { from: colorMap[from] || '#60a5fa', to: colorMap[to] || '#2563eb' };
  };

  const colors = getGradientColors(config.gradient);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      {/* Gradient Background Accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` 
        }}
      />

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          skill._id && onDelete(skill._id);
        }}
        className="absolute top-3 left-3 p-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50 hover:scale-110 z-10"
      >
        <X className="w-4 h-4 text-red-600" />
      </button>

      {/* Main Content */}
      <div className="relative p-5 space-y-4">
        {/* Header: Skill Name & Category Badge */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold text-lg text-gray-900 flex-1 leading-tight">
            {skill.name}
          </h4>
          {skill.category && (
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ 
                background: `linear-gradient(135deg, ${colors.from}15, ${colors.to}15)`,
                color: colors.to
              }}
            >
              {skill.category}
            </span>
          )}
        </div>

        {/* Proficiency Level with Stars */}
        <div className="space-y-2">
          {/* Stars Row */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id={`${uniqueId}-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.from} />
                    <stop offset="100%" stopColor={colors.to} />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={i < config.stars ? `url(#${uniqueId}-${i})` : 'none'}
                  stroke={i < config.stars ? `url(#${uniqueId}-${i})` : '#d1d5db'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>

          {/* Proficiency Label with Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span 
                className="text-sm font-bold"
                style={{ color: colors.to }}
              >
                {config.label}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {config.stars}/5
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(config.stars / 5) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Edit Button - Always Visible on Mobile, Hover on Desktop */}
        <button
          onClick={() => onEdit(skill)}
          className="w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all
                     bg-gray-50 text-gray-700 hover:bg-gray-100
                     md:opacity-0 md:group-hover:opacity-100
                     flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          ویرایش مهارت
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.from}08, transparent 70%)`
        }}
      />
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
    console.log('✏️ Editing skill:', skill);
    // Create a fresh copy to avoid reference issues
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSubmit = async (skill: Skill) => {
    try {
      console.log('🚀 handleSubmit called with:', { skill, editingSkill });
      
      if (editingSkill?._id) {
        // Pass the skill with its ID for editing
        const skillToUpdate = { ...skill, _id: editingSkill._id };
        console.log('📝 Calling onEdit with:', skillToUpdate);
        await onEdit(skillToUpdate);
        console.log('✅ onEdit completed successfully');
      } else {
        console.log('➕ Calling onAdd with:', skill);
        await onAdd(skill);
        console.log('✅ onAdd completed successfully');
      }
      
      // Close modal after successful submission
      setIsModalOpen(false);
      setEditingSkill(undefined);
    } catch (error) {
      // Error is handled by the parent controller
      console.error('❌ Error submitting skill:', error);
      // Don't close modal on error so user can retry
    }
  };

  // Group skills by category - recalculate on every render to catch updates
  const groupedSkills = (skills || []).reduce((acc, skill) => {
    const category = skill.category || 'سایر';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  console.log('📊 Grouped skills:', groupedSkills);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ModernSectionHeader
        icon={Target}
        title="مهارت‌ها"
        subtitle="مهارت‌های فنی و تخصصی خود را مدیریت کنید"
        count={skills?.length}
        onAdd={handleAdd}
        addLabel="افزودن مهارت"
        gradient="from-indigo-500 to-purple-500"
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
            className="space-y-6"
          >
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-700">{category}</h3>
                  <span className="text-xs text-gray-400">({categorySkills.length})</span>
                </div>

                {/* Skills grid */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-4'
                  }
                >
                  {categorySkills.map((skill, index) => (
                    <ModernSkillCard
                      key={`${skill._id}-${skill.proficiency}-${skill.category}`}
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
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModernEmptyState
              icon={Sparkles}
              title="هنوز مهارتی اضافه نشده"
              description="مهارت‌های خود را اضافه کنید تا پروفایل شما کامل‌تر شود و توانایی‌هایتان بهتر دیده شود."
              actionLabel="افزودن اولین مهارت"
              onAction={handleAdd}
              gradient="from-indigo-500 to-purple-500"
              variant="illustrated"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
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
