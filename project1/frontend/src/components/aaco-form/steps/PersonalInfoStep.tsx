/**
 * Personal Information Step Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { FormSection } from '@/components/forms/FormSection';
import { FormInput } from '@/components/forms/FormField';
import { AACOFormData, FormErrors } from '../types/form.types';

interface PersonalInfoStepProps {
  formData: AACOFormData;
  errors: FormErrors;
  onUpdate: (field: keyof AACOFormData, value: any) => void;
  onClearError: (field: string) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
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
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormSection title="اطلاعات شخصی" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="نام"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="نام خود را وارد کنید"
              required
            />
            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <FormInput
              label="نام خانوادگی"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="نام خانوادگی خود را وارد کنید"
              required
            />
            {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        <div>
          <FormInput
            label="ایمیل"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            required
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="شماره تماس"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="09123456789"
              required
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <FormInput
              label="شهر محل سکونت"
              name="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="تهران"
              required
            />
            {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
          </div>
        </div>
      </FormSection>
    </motion.div>
  );
};
