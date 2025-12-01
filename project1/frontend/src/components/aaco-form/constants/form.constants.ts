/**
 * Constants for AACO Application Form
 */

import { User, GraduationCap, Lightbulb, Target } from 'lucide-react';
import { AACOFormData, StepConfig } from '../types/form.types';

export const INITIAL_FORM_DATA: AACOFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  university: '',
  major: '',
  degree: '',
  graduationYear: '',
  startupIdea: '',
  businessModel: '',
  targetMarket: '',
  teamSize: '',
  teamMembers: '',
  skills: [],
  motivation: '',
  goals: '',
  experience: '',
  expectations: ''
};

export const STEPS: StepConfig[] = [
  { id: 1, title: 'اطلاعات شخصی', icon: User },
  { id: 2, title: 'سوابق تحصیلی', icon: GraduationCap },
  { id: 3, title: 'ایده و تیم', icon: Lightbulb },
  { id: 4, title: 'انگیزه و اهداف', icon: Target }
];

export const AVAILABLE_SKILLS = [
  'استراتژی کسب‌وکار',
  'توسعه محصول',
  'بازاریابی و فروش',
  'مالی و سرمایه‌گذاری',
  'فناوری و نوآوری',
  'مدیریت پروژه',
  'طراحی UI/UX',
  'برنامه‌نویسی',
  'تحلیل داده',
  'شبکه‌سازی'
];

export const DEGREE_OPTIONS = [
  { value: 'diploma', label: 'دیپلم' },
  { value: 'associate', label: 'کاردانی' },
  { value: 'bachelor', label: 'کارشناسی' },
  { value: 'master', label: 'کارشناسی ارشد' },
  { value: 'phd', label: 'دکتری' }
];

export const TEAM_SIZE_OPTIONS = [
  { value: '1', label: 'فقط خودم' },
  { value: '2-3', label: '2-3 نفر' },
  { value: '4-5', label: '4-5 نفر' },
  { value: '6+', label: '6 نفر یا بیشتر' }
];
