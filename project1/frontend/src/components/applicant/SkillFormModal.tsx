import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Target, Loader2 } from 'lucide-react';
import { Skill } from '@/hooks/useProfile';

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (skill: Skill) => void;
  initialData?: Skill;
  isLoading?: boolean;
}

const SKILL_CATEGORIES = [
  'برنامه‌نویسی',
  'طراحی',
  'مدیریت',
  'بازاریابی',
  'زبان',
  'نرم‌افزار',
  'سایر'
];

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'مبتدی', color: 'bg-gray-100 text-gray-700' },
  { value: 'intermediate', label: 'متوسط', color: 'bg-blue-100 text-blue-700' },
  { value: 'advanced', label: 'پیشرفته', color: 'bg-purple-100 text-purple-700' },
  { value: 'expert', label: 'متخصص', color: 'bg-emerald-100 text-emerald-700' },
];

// Map Persian values to English for compatibility
const PROFICIENCY_MAP: Record<string, string> = {
  'مبتدی': 'beginner',
  'متوسط': 'intermediate',
  'خوب': 'advanced',
  'پیشرفته': 'advanced',
  'عالی': 'expert',
  'متخصص': 'expert',
  'حرفه‌ای': 'expert',
  // English values map to themselves
  'beginner': 'beginner',
  'intermediate': 'intermediate',
  'advanced': 'advanced',
  'expert': 'expert',
};

export default function SkillFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: SkillFormModalProps) {
  const [formData, setFormData] = useState<Skill>({
    name: '',
    category: '',
    proficiency: 'intermediate',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Skill, string>>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Normalize proficiency to English value
        const normalizedProficiency = PROFICIENCY_MAP[initialData.proficiency] || 'intermediate';
        console.log('📝 Loading skill for edit:', { 
          original: initialData, 
          normalized: { ...initialData, proficiency: normalizedProficiency } 
        });
        setFormData({
          ...initialData,
          proficiency: normalizedProficiency,
        });
      } else {
        console.log('➕ New skill form');
        setFormData({ name: '', category: '', proficiency: 'intermediate' });
      }
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Skill, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Skill, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'الزامی';
    if (!formData.category) newErrors.category = 'الزامی';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Form submitted!', { formData, initialData, isLoading });
    
    if (!validate()) {
      console.log('❌ Validation failed:', errors);
      return;
    }
    
    console.log('📤 Submitting skill:', formData);
    
    try {
      await onSubmit(formData);
      console.log('✅ Skill submitted successfully');
    } catch (error) {
      console.error('❌ Error submitting skill:', error);
      // Error is handled by parent, but we log it here for debugging
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        {/* Modal Container */}
        <div className="relative h-full flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Compact Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? 'ویرایش' : 'افزودن'} مهارت
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Compact Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Skill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام مهارت <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="React, Python, ..."
                className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full h-10 px-3 border rounded-lg bg-white text-sm ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">انتخاب کنید</option>
                {SKILL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Proficiency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سطح مهارت</label>
              <div className="grid grid-cols-2 gap-2">
                {PROFICIENCY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleChange('proficiency', level.value)}
                    className={`p-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                      formData.proficiency === level.value
                        ? `${level.color} border-current`
                        : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : initialData ? 'به‌روزرسانی' : 'افزودن'}
              </Button>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
