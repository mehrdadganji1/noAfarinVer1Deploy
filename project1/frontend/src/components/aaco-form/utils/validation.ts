/**
 * Validation utilities for AACO Application Form
 * Ensures data matches backend enum requirements
 */

import { AACOFormData } from '../types/form.types';

// Backend enum values - MUST match backend model
export const VALID_DEGREES = ['diploma', 'associate', 'bachelor', 'master', 'phd'] as const;
export const VALID_TEAM_SIZES = ['1', '2-3', '4-5', '6+'] as const;

export type ValidDegree = typeof VALID_DEGREES[number];
export type ValidTeamSize = typeof VALID_TEAM_SIZES[number];

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Iranian phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate degree enum value
 */
export const isValidDegree = (degree: string): degree is ValidDegree => {
  return VALID_DEGREES.includes(degree as ValidDegree);
};

/**
 * Validate team size enum value
 */
export const isValidTeamSize = (teamSize: string): teamSize is ValidTeamSize => {
  return VALID_TEAM_SIZES.includes(teamSize as ValidTeamSize);
};

/**
 * Comprehensive form validation before submission
 */
export const validateFormData = (formData: AACOFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Step 1: Personal Info
  if (!formData.firstName.trim()) {
    errors.firstName = 'نام الزامی است';
  }
  if (!formData.lastName.trim()) {
    errors.lastName = 'نام خانوادگی الزامی است';
  }
  if (!formData.email.trim()) {
    errors.email = 'ایمیل الزامی است';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'فرمت ایمیل صحیح نیست';
  }
  if (!formData.phone.trim()) {
    errors.phone = 'شماره تماس الزامی است';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'شماره تماس باید با 09 شروع شود و 11 رقم باشد';
  }
  if (!formData.city.trim()) {
    errors.city = 'شهر الزامی است';
  }

  // Step 2: Educational Background
  if (!formData.university.trim()) {
    errors.university = 'نام دانشگاه الزامی است';
  }
  if (!formData.major.trim()) {
    errors.major = 'رشته تحصیلی الزامی است';
  }
  if (!formData.degree.trim()) {
    errors.degree = 'مقطع تحصیلی الزامی است';
  } else if (!isValidDegree(formData.degree)) {
    errors.degree = `مقطع تحصیلی باید یکی از این مقادیر باشد: ${VALID_DEGREES.join(', ')}`;
  }

  // Step 3: Startup Idea & Team
  if (!formData.startupIdea.trim()) {
    errors.startupIdea = 'توضیح ایده الزامی است';
  }
  if (!formData.businessModel.trim()) {
    errors.businessModel = 'مدل کسب‌وکار الزامی است';
  }
  if (!formData.targetMarket.trim()) {
    errors.targetMarket = 'بازار هدف الزامی است';
  }
  if (formData.teamSize && !isValidTeamSize(formData.teamSize)) {
    errors.teamSize = `تعداد اعضای تیم باید یکی از این مقادیر باشد: ${VALID_TEAM_SIZES.join(', ')}`;
  }

  // Step 4: Motivation & Goals
  if (!formData.motivation.trim()) {
    errors.motivation = 'انگیزه شرکت الزامی است';
  }
  if (!formData.goals.trim()) {
    errors.goals = 'اهداف الزامی است';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get user-friendly error message for validation errors
 */
export const getValidationErrorMessage = (field: string, value: any): string | null => {
  switch (field) {
    case 'degree':
      if (!value) return 'مقطع تحصیلی الزامی است';
      if (!isValidDegree(value)) {
        return 'لطفاً یکی از گزینه‌های موجود را انتخاب کنید';
      }
      return null;
    
    case 'teamSize':
      if (value && !isValidTeamSize(value)) {
        return 'لطفاً یکی از گزینه‌های موجود را انتخاب کنید';
      }
      return null;
    
    case 'email':
      if (!value) return 'ایمیل الزامی است';
      if (!isValidEmail(value)) return 'فرمت ایمیل صحیح نیست';
      return null;
    
    case 'phone':
      if (!value) return 'شماره تماس الزامی است';
      if (!isValidPhone(value)) return 'شماره تماس باید با 09 شروع شود و 11 رقم باشد';
      return null;
    
    default:
      return null;
  }
};
