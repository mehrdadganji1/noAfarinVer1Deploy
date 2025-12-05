// Admin Dashboard Design System Constants
// =========================================

// Color Palette
export const COLORS = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Accent Colors
  accent: {
    purple: { light: '#f3e8ff', main: '#a855f7', dark: '#7c3aed' },
    emerald: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
    amber: { light: '#fef3c7', main: '#f59e0b', dark: '#d97706' },
    rose: { light: '#ffe4e6', main: '#f43f5e', dark: '#e11d48' },
    cyan: { light: '#cffafe', main: '#06b6d4', dark: '#0891b2' },
  },
  // Status Colors
  status: {
    success: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    warning: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    info: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  },
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
} as const

// Gradient Presets
export const GRADIENTS = {
  primary: 'from-blue-600 via-purple-600 to-indigo-600',
  success: 'from-emerald-500 to-teal-600',
  warning: 'from-amber-500 to-orange-600',
  danger: 'from-rose-500 to-red-600',
  info: 'from-cyan-500 to-blue-600',
  purple: 'from-purple-600 to-indigo-600',
  sunset: 'from-orange-500 via-pink-500 to-purple-600',
  ocean: 'from-blue-400 via-cyan-500 to-teal-500',
  forest: 'from-green-500 via-emerald-500 to-teal-600',
} as const

// Card Variants
export const CARD_VARIANTS = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow',
  gradient: 'bg-gradient-to-br',
  glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20',
  outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
} as const


// Spacing Scale
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

// Border Radius
export const RADIUS = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const

// Transition Presets
export const TRANSITIONS = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
} as const

// Icon Sizes
export const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
} as const

// Metric Card Themes
export const METRIC_THEMES = {
  users: {
    gradient: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-800/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  applications: {
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    iconBg: 'bg-amber-100 dark:bg-amber-800/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  success: {
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconBg: 'bg-emerald-100 dark:bg-emerald-800/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  members: {
    gradient: 'from-purple-500 to-indigo-500',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-800/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  events: {
    gradient: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50 dark:bg-rose-900/20',
    iconBg: 'bg-rose-100 dark:bg-rose-800/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    textColor: 'text-rose-700 dark:text-rose-300',
  },
  teams: {
    gradient: 'from-cyan-500 to-blue-500',
    bgLight: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconBg: 'bg-cyan-100 dark:bg-cyan-800/50',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    textColor: 'text-cyan-700 dark:text-cyan-300',
  },
} as const

// Chart Colors
export const CHART_COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
  mixed: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
} as const

// Dashboard Layout
export const LAYOUT = {
  maxWidth: '1600px',
  sidebarWidth: '280px',
  headerHeight: '64px',
  gap: {
    section: '1.5rem',
    card: '1rem',
    item: '0.75rem',
  },
} as const

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export type MetricTheme = keyof typeof METRIC_THEMES
export type GradientType = keyof typeof GRADIENTS
export type CardVariant = keyof typeof CARD_VARIANTS
