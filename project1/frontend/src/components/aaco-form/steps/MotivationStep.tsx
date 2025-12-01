/**
 * Motivation & Goals Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { FormSection } from '@/components/forms/FormSection';
import { FormTextarea } from '@/components/forms/FormField';
import { AACOFormData, FormErrors } from '../types/form.types';

interface MotivationStepProps {
  formData: AACOFormData;
  errors: FormErrors;
  onUpdate: (field: keyof AACOFormData, value: any) => void;
  onClearError: (field: string) => void;
}

export const MotivationStep: React.FC<MotivationStepProps> = ({
  formData,
  errors,
  onUpdate,
  onClearError
}) => {
  const handleChange = (field: keyof AACOFormData, value: string) => {
    onUpdate(field, value);
    onClearError(field);
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormSection title="انگیزه و اهداف" icon={Target}>
        <div>
          <FormTextarea
            label="چرا می‌خواهید در رویداد AACo شرکت کنید؟"
            name="motivation"
            value={formData.motivation}
            onChange={(e) => handleChange('motivation', e.target.value)}
            placeholder="انگیزه خود را شرح دهید..."
            rows={4}
            required
          />
          {errors.motivation && <p className="text-sm text-red-600 mt-1">{errors.motivation}</p>}
        </div>
        
        <div>
          <FormTextarea
            label="اهداف شما از شرکت در این رویداد چیست؟"
            name="goals"
            value={formData.goals}
            onChange={(e) => handleChange('goals', e.target.value)}
            placeholder="اهداف خود را بیان کنید..."
            rows={4}
            required
          />
          {errors.goals && <p className="text-sm text-red-600 mt-1">{errors.goals}</p>}
        </div>
        
        <FormTextarea
          label="سابقه کاری یا پروژه‌های قبلی (اختیاری)"
          name="experience"
          value={formData.experience}
          onChange={(e) => handleChange('experience', e.target.value)}
          placeholder="تجربیات مرتبط خود را شرح دهید..."
          rows={3}
        />
        
        <FormTextarea
          label="انتظارات شما از رویداد AACo چیست؟"
          name="expectations"
          value={formData.expectations}
          onChange={(e) => handleChange('expectations', e.target.value)}
          placeholder="چه چیزی انتظار دارید یاد بگیرید یا به دست آورید؟"
          rows={3}
        />
      </FormSection>
    </motion.div>
  );
};
