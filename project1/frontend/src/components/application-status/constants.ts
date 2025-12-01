/**
 * Constants and configurations for Application Status
 */

import {
  Clock,
  CheckCircle2,
  XCircle,
  FileSearch,
  Sparkles
} from 'lucide-react';
import type { ApplicationStatus, StatusConfig } from './types';

export const STATUS_CONFIGS: Record<ApplicationStatus, StatusConfig> = {
  draft: {
    label: 'پیش‌نویس',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100 border-gray-200',
    icon: FileSearch,
    description: 'درخواست شما هنوز ارسال نشده است'
  },
  submitted: {
    label: 'ارسال شده',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    icon: Clock,
    description: 'درخواست شما با موفقیت ثبت شد و به زودی بررسی خواهد شد'
  },
  'under-review': {
    label: 'در حال بررسی',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-200',
    icon: FileSearch,
    description: 'درخواست شما توسط تیم ما در حال بررسی است'
  },
  approved: {
    label: 'تایید شده',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    icon: CheckCircle2,
    description: 'تبریک! درخواست شما تایید شد'
  },
  rejected: {
    label: 'رد شده',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-200',
    icon: XCircle,
    description: 'متاسفانه درخواست شما مورد تایید قرار نگرفت'
  }
};

export const DEGREE_LABELS: Record<string, string> = {
  diploma: 'دیپلم',
  associate: 'کاردانی',
  bachelor: 'کارشناسی',
  master: 'کارشناسی ارشد',
  phd: 'دکتری'
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
};
