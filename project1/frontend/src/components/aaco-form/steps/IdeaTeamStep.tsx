/**
 * Idea & Team Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { FormSection } from '@/components/forms/FormSection';
import { FormInput, FormTextarea, FormSelect } from '@/components/forms/FormField';
import { AACOFormData, FormErrors } from '../types/form.types';
import { TEAM_SIZE_OPTIONS } from '../constants/form.constants';
import { SkillSelector } from '../shared/SkillSelector';

interface IdeaTeamStepProps {
  formData: AACOFormData;
  errors: FormErrors;
  onUpdate: (field: keyof AACOFormData, value: any) => void;
  onClearError: (field: string) => void;
}

export const IdeaTeamStep: React.FC<IdeaTeamStepProps> = ({
  formData,
  errors,
  onUpdate,
  onClearError
}) => {
  const handleChange = (field: keyof AACOFormData, value: any) => {
    onUpdate(field, value);
    onClearError(field);
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = formData.skills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    handleChange('skills', newSkills);
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormSection title="ایده استارتاپ و تیم" icon={Lightbulb}>
        <div>
          <FormTextarea
            label="توضیح ایده استارتاپ"
            name="startupIdea"
            value={formData.startupIdea}
            onChange={(e) => handleChange('startupIdea', e.target.value)}
            placeholder="ایده کسب‌وکار خود را به طور خلاصه شرح دهید..."
            rows={4}
            required
          />
          {errors.startupIdea && <p className="text-sm text-red-600 mt-1">{errors.startupIdea}</p>}
        </div>
        
        <div>
          <FormTextarea
            label="مدل کسب‌وکار"
            name="businessModel"
            value={formData.businessModel}
            onChange={(e) => handleChange('businessModel', e.target.value)}
            placeholder="چگونه قصد دارید درآمدزایی کنید؟"
            rows={3}
            required
          />
          {errors.businessModel && <p className="text-sm text-red-600 mt-1">{errors.businessModel}</p>}
        </div>
        
        <div>
          <FormInput
            label="بازار هدف"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={(e) => handleChange('targetMarket', e.target.value)}
            placeholder="مشتریان هدف شما چه کسانی هستند؟"
            required
          />
          {errors.targetMarket && <p className="text-sm text-red-600 mt-1">{errors.targetMarket}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="تعداد اعضای تیم"
            name="teamSize"
            value={formData.teamSize}
            onChange={(value) => handleChange('teamSize', value)}
            placeholder="انتخاب کنید"
            options={TEAM_SIZE_OPTIONS}
          />
          <FormInput
            label="اعضای تیم (اختیاری)"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={(e) => handleChange('teamMembers', e.target.value)}
            placeholder="نام و نقش اعضای تیم"
          />
        </div>
        
        <SkillSelector
          selectedSkills={formData.skills}
          onToggle={toggleSkill}
        />
      </FormSection>
    </motion.div>
  );
};
