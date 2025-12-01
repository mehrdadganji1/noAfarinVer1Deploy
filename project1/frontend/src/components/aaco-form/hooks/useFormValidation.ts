/**
 * Form validation hook for AACO Application
 */

import { useState } from 'react';
import { AACOFormData, FormErrors } from '../types/form.types';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (step: number, formData: AACOFormData): boolean => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
        if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
        if (!formData.email.trim()) newErrors.email = 'ایمیل الزامی است';
        if (!formData.phone.trim()) newErrors.phone = 'شماره تماس الزامی است';
        if (!formData.city.trim()) newErrors.city = 'شهر الزامی است';
        break;
        
      case 2:
        if (!formData.university.trim()) newErrors.university = 'نام دانشگاه الزامی است';
        if (!formData.major.trim()) newErrors.major = 'رشته تحصیلی الزامی است';
        if (!formData.degree.trim()) newErrors.degree = 'مقطع تحصیلی الزامی است';
        break;
        
      case 3:
        if (!formData.startupIdea.trim()) newErrors.startupIdea = 'توضیح ایده الزامی است';
        if (!formData.businessModel.trim()) newErrors.businessModel = 'مدل کسب‌وکار الزامی است';
        if (!formData.targetMarket.trim()) newErrors.targetMarket = 'بازار هدف الزامی است';
        break;
        
      case 4:
        if (!formData.motivation.trim()) newErrors.motivation = 'انگیزه شرکت الزامی است';
        if (!formData.goals.trim()) newErrors.goals = 'اهداف الزامی است';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateStep,
    clearError,
    clearAllErrors
  };
};
