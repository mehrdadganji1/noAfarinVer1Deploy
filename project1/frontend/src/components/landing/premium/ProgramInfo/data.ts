import {
  Rocket,
  Calendar,
  Target,
  Award,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
  Briefcase,
  Network,
  GraduationCap,
  UserCheck,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { TabItem, EventDate, Specialty, Benefit } from './types';

export const tabs: TabItem[] = [
  {
    id: 'about',
    title: 'طرح نوآفرین صنعت‌ساز',
    icon: Rocket,
    description: 'آشنایی با طرح ملی نوآفرین',
  },
  {
    id: 'events',
    title: 'رویدادهای آکو',
    icon: Calendar,
    description: 'زمانبندی و برنامه رویدادها',
  },
  {
    id: 'specialties',
    title: 'تخصص‌های کلیدی',
    icon: Target,
    description: 'پنج تخصص اصلی برنامه',
  },
  {
    id: 'benefits',
    title: 'مزایای عضویت',
    icon: Award,
    description: 'امتیازات و فرصت‌های ویژه',
  },
];

export const events: EventDate[] = [
  {
    week: 1,
    weekTitle: 'هفته اول',
    dates: '20-21 آذر 1403',
    persianDates: 'پنجشنبه و جمعه',
    days: '۲۰ و ۲۱ آذر',
    topics: [
      'معرفی طرح نوآفرین صنعت‌ساز',
      'آشنایی با اکوسیستم نوآوری',
      'کارگاه ایده‌پردازی',
    ],
  },
  {
    week: 2,
    weekTitle: 'هفته دوم',
    dates: '27-28 آذر 1403',
    persianDates: 'پنجشنبه و جمعه',
    days: '۲۷ و ۲۸ آذر',
    topics: [
      'تیم‌سازی و شبکه‌سازی',
      'کارگاه مدل کسب‌وکار',
      'منتورینگ گروهی',
    ],
  },
  {
    week: 3,
    weekTitle: 'هفته سوم',
    dates: '4-5 دی 1403',
    persianDates: 'پنجشنبه و جمعه',
    days: '۴ و ۵ دی',
    topics: [
      'ارائه ایده‌ها (Pitch)',
      'ارزیابی و بازخورد',
      'اعلام نتایج و جوایز',
    ],
  },
];


export const specialties: Specialty[] = [
  {
    icon: Lightbulb,
    title: 'استراتژی کسب‌وکار',
    description: 'طراحی و توسعه مدل کسب‌وکار، تحلیل بازار و برنامه‌ریزی استراتژیک برای رشد پایدار',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Briefcase,
    title: 'توسعه محصول',
    description: 'از ایده تا محصول نهایی، با متدولوژی‌های مدرن و تمرکز بر نیاز مشتری',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: TrendingUp,
    title: 'بازاریابی و فروش',
    description: 'استراتژی‌های دیجیتال مارکتینگ، برندسازی و توسعه کانال‌های فروش',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Wallet,
    title: 'مالی و سرمایه‌گذاری',
    description: 'مدیریت مالی، جذب سرمایه و ارتباط با سرمایه‌گذاران',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Sparkles,
    title: 'فناوری و نوآوری',
    description: 'بهره‌گیری از فناوری‌های نوین و هوش مصنوعی برای رقابت‌پذیری',
    color: 'from-pink-500 to-rose-600',
  },
];

export const benefits: Benefit[] = [
  {
    title: 'دسترسی به متخصصان',
    description: 'ارتباط مستقیم با متخصصان برتر در هر پنج حوزه تخصصی',
    icon: Users,
  },
  {
    title: 'شبکه‌سازی حرفه‌ای',
    description: 'ایجاد ارتباط با سایر کارآفرینان، سرمایه‌گذاران و شرکای تجاری',
    icon: Network,
  },
  {
    title: 'آموزش‌های تخصصی',
    description: 'دوره‌ها و کارگاه‌های عملی برای ارتقای مهارت‌های کسب‌وکاری',
    icon: GraduationCap,
  },
  {
    title: 'منتورینگ اختصاصی',
    description: 'راهنمایی شخصی‌سازی شده برای چالش‌های خاص کسب‌وکار شما',
    icon: UserCheck,
  },
  {
    title: 'تسهیلات ویژه',
    description: 'دسترسی به منابع، ابزارها و تسهیلات مورد نیاز برای رشد',
    icon: BookOpen,
  },
  {
    title: 'فرصت‌های سرمایه‌گذاری',
    description: 'معرفی به سرمایه‌گذاران و فرصت‌های تامین مالی',
    icon: Wallet,
  },
];
