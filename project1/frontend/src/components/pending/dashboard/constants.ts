/**
 * Constants and configurations for Pending Dashboard
 * Centralized configuration following Single Responsibility Principle
 */

import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  User,
  HelpCircle,
  Mail,
  Rocket
} from 'lucide-react';
import type { StatusInfo, TimelineStep, QuickAction, InfoCard, ApplicationStatus } from './types';

/**
 * Status configurations mapped by status type
 * Supports both regular application and AACO application statuses
 * 
 * جریان پذیرش:
 * 1. submitted - درخواست ارسال شده
 * 2. under-review - در حال بررسی
 * 3. approved - پیش ثبت‌نام تایید شده (وارد مرحله مصاحبه)
 * 4. interview_scheduled - مصاحبه تعیین شده
 * 5. accepted - تایید نهایی (نقش به club_member تغییر می‌کند)
 */
export const STATUS_CONFIG: Record<ApplicationStatus, StatusInfo> = {
  not_submitted: {
    text: 'آماده ثبت درخواست',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: FileText,
    description: 'شما هنوز درخواستی ثبت نکرده‌اید. برای شروع، فرم درخواست را تکمیل کنید'
  },
  draft: {
    text: 'پیش‌نویس',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: FileText,
    description: 'درخواست شما هنوز ارسال نشده است'
  },
  submitted: {
    text: 'درخواست ارسال شده',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock,
    description: 'درخواست شما با موفقیت ثبت شد و در صف بررسی قرار گرفت',
    pulse: true
  },
  under_review: {
    text: 'در حال بررسی',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Clock,
    description: 'تیم ما در حال بررسی دقیق درخواست شما هستند',
    pulse: true
  },
  'under-review': {
    text: 'در حال بررسی',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Clock,
    description: 'تیم ما در حال بررسی دقیق درخواست شما هستند',
    pulse: true
  },
  // تایید پیش ثبت‌نام - کاربر وارد مرحله مصاحبه می‌شود
  approved: {
    text: 'پیش ثبت‌نام تایید شده',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Calendar,
    description: 'تبریک! پیش ثبت‌نام شما تایید شد. منتظر تعیین زمان مصاحبه باشید',
    pulse: true
  },
  interview_scheduled: {
    text: 'مصاحبه تعیین شده',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Calendar,
    description: 'مصاحبه شما برنامه‌ریزی شده است. لطفاً در زمان مقرر حاضر شوید',
    pulse: true
  },
  // تایید نهایی - نقش به club_member تغییر می‌کند
  accepted: {
    text: 'تایید نهایی',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
    description: 'تبریک! شما به عضویت باشگاه نوآفرینان درآمدید'
  },
  rejected: {
    text: 'رد شده',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    description: 'متاسفانه درخواست شما مورد تایید قرار نگرفت'
  },
  withdrawn: {
    text: 'لغو شده',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircle,
    description: 'درخواست شما لغو شده است'
  }
};

/**
 * Timeline steps configuration
 * Supports both regular application and AACO application statuses
 * 
 * جریان:
 * 1. ثبت درخواست (submitted)
 * 2. بررسی مدارک (under-review)
 * 3. تایید پیش ثبت‌نام (approved) - کاربر وارد مرحله مصاحبه می‌شود
 * 4. مصاحبه (interview_scheduled)
 * 5. تایید نهایی (accepted) - نقش به club_member تغییر می‌کند
 */
export const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: 'submit',
    title: 'ثبت درخواست',
    description: 'ارسال فرم پیش ثبت‌نام',
    requiredStatuses: ['submitted', 'under_review', 'under-review', 'approved', 'interview_scheduled', 'accepted']
  },
  {
    id: 'review',
    title: 'بررسی مدارک',
    description: 'بررسی توسط تیم',
    requiredStatuses: ['under_review', 'under-review', 'approved', 'interview_scheduled', 'accepted']
  },
  {
    id: 'pre-approval',
    title: 'تایید پیش ثبت‌نام',
    description: 'تایید اولیه درخواست',
    requiredStatuses: ['approved', 'interview_scheduled', 'accepted']
  },
  {
    id: 'interview',
    title: 'مصاحبه',
    description: 'مصاحبه حضوری یا آنلاین',
    requiredStatuses: ['interview_scheduled', 'accepted']
  },
  {
    id: 'final-approval',
    title: 'تایید نهایی',
    description: 'پذیرش در باشگاه',
    requiredStatuses: ['accepted']
  }
];

/**
 * Quick actions configuration
 */
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'status',
    title: 'وضعیت درخواست',
    description: 'مشاهده جزئیات و وضعیت فعلی',
    icon: FileText,
    path: '/pending/status',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'application-form',
    title: 'فرم درخواست عضویت',
    description: 'تکمیل فرم پیش‌ثبت‌نام',
    icon: Rocket,
    path: '/pending/application-form',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'profile',
    title: 'پروفایل',
    description: 'مشاهده و ویرایش اطلاعات',
    icon: User,
    path: '/pending/profile',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'help',
    title: 'راهنما و پشتیبانی',
    description: 'سوالات متداول و تماس',
    icon: HelpCircle,
    path: '/pending/help',
    color: 'from-green-500 to-emerald-500'
  }
];

/**
 * Info cards configuration
 */
export const INFO_CARDS: InfoCard[] = [
  {
    id: 'review-time',
    title: 'زمان بررسی',
    description: 'معمولاً بررسی درخواست‌ها 3-5 روز کاری طول می‌کشد',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'notification',
    title: 'اطلاع‌رسانی',
    description: 'نتیجه از طریق ایمیل و پیامک به شما اطلاع داده می‌شود',
    icon: Mail,
    color: 'bg-purple-100 text-purple-600'
  }
];

/**
 * Contact information
 */
export const CONTACT_INFO = {
  email: 'noafarinevent@gmail.com',
  phone: '+989982328585',
  phoneDisplay: '09982328585'
};

/**
 * Animation variants for framer-motion
 */
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  }
};
