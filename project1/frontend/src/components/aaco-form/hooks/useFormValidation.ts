/**
 * Form validation hook for AACO Application
 * Enhanced with enum validation and better error messages
 */

import { useState } from 'react';
import { AACOFormData, FormErrors } from '../types/form.types';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidDegree, 
  isValidTeamSize,
  getValidationErrorMessage 
} from '../utils/validation';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = (step: number, formData: AACOFormData): boolean => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1: // Personal Info
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'نام الزامی است';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'نام خانوادگی الزامی است';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'ایمیل الزامی است';
        } else if (!isValidEmail(formData.email)) {
          newErrors.email = 'فرمت ایمیل صحیح نیست';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'شماره تماس الزامی است';
        } else if (!isValidPhone(formData.phone)) {
          newErrors.phone = 'شماره تماس باید با 09 شروع شود و 11 رقم باشد';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'شهر الزامی است';
        }
        break;
        
      case 2: // Educational Background
        if (!formData.university.trim()) {
          newErrors.university = 'نام دانشگاه الزامی است';
        }
        if (!formData.major.trim()) {
          newErrors.major = 'رشته تحصیلی الزامی است';
        }
        if (!formData.degree.trim()) {
          newErrors.degree = 'مقطع تحصیلی الزامی است';
        } else if (!isValidDegree(formData.degree)) {
          newErrors.degree = 'لطفاً یکی از گزینه‌های موجود را انتخاب کنید';
        }
        break;
        
      case 3: // Startup Idea & Team
        if (!formData.startupIdea.trim()) {
          newErrors.startupIdea = 'توضیح ایده الزامی است';
        }
        if (!formData.businessModel.trim()) {
          newErrors.businessModel = 'مدل کسب‌وکار الزامی است';
        }
        if (!formData.targetMarket.trim()) {
          newErrors.targetMarket = 'بازار هدف الزامی است';
        }
        // teamSize is optional, but if provided must be valid
        if (formData.teamSize && !isValidTeamSize(formData.teamSize)) {
          newErrors.teamSize = 'لطفاً یکی از گزینه‌های موجود را انتخاب کنید';
        }
        break;
        
      case 4: // Motivation & Goals
        if (!formData.motivation.trim()) {
          newErrors.motivation = 'انگیزه شرکت الزامی است';
        }
        if (!formData.goals.trim()) {
          newErrors.goals = 'اهداف الزامی است';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate a single field (for real-time validation)
   */
  const validateField = (field: keyof AACOFormData, value: any): string | null => {
    return getValidationErrorMessage(field, value);
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
    validateField,
    clearError,
    clearAllErrors
  };
};
