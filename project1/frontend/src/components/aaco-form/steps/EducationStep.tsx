/**
 * Education Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { FormSection } from '@/components/forms/FormSection';
import { FormInput, FormSelect } from '@/components/forms/FormField';
import { AACOFormData, FormErrors } from '../types/form.types';
import { DEGREE_OPTIONS } from '../constants/form.constants';

interface EducationStepProps {
  formData: AACOFormData;
  errors: FormErrors;
  onUpdate: (field: keyof AACOFormData, value: any) => void;
  onClearError: (field: string) => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({
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
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormSection title="سوابق تحصیلی" icon={GraduationCap}>
        <div>
          <FormInput
            label="نام دانشگاه"
            name="university"
            value={formData.university}
            onChange={(e) => handleChange('university', e.target.value)}
            placeholder="دانشگاه تهران"
            required
          />
          {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="رشته تحصیلی"
              name="major"
              value={formData.major}
              onChange={(e) => handleChange('major', e.target.value)}
              placeholder="مهندسی کامپیوتر"
              required
            />
            {errors.major && <p className="text-sm text-red-600 mt-1">{errors.major}</p>}
          </div>
          <div>
            <FormSelect
              label="مقطع تحصیلی"
              name="degree"
              value={formData.degree}
              onChange={(value) => handleChange('degree', value)}
              placeholder="انتخاب کنید"
              options={DEGREE_OPTIONS}
              required
            />
            {errors.degree && <p className="text-sm text-red-600 mt-1">{errors.degree}</p>}
          </div>
        </div>
        
        <FormInput
          label="سال فارغ‌التحصیلی (اختیاری)"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={(e) => handleChange('graduationYear', e.target.value)}
          placeholder="1402"
        />
      </FormSection>
    </motion.div>
  );
};
