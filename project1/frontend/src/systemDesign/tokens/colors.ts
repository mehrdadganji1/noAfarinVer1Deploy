/**
 * Design Tokens - Colors
 * سیستم رنگ یکپارچ برای تمام پروژه
 */

export const colors = {
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

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info Colors
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Gray Scale (Light Mode)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Dark Mode Colors
  dark: {
    50: '#18181b',
    100: '#27272a',
    200: '#3f3f46',
    300: '#52525b',
    400: '#71717a',
    500: '#a1a1aa',
    600: '#d4d4d8',
    700: '#e4e4e7',
    800: '#f4f4f5',
    900: '#fafafa',
  },

  // Semantic Colors
  semantic: {
    active: '#10b981',
    inactive: '#6b7280',
    pending: '#f59e0b',
    rejected: '#ef4444',
    draft: '#8b5cf6',
    approved: '#10b981',
  },

  // Role Colors
  roles: {
    admin: '#ef4444',
    director: '#8b5cf6',
    coordinator: '#3b82f6',
    mentor: '#10b981',
    member: '#06b6d4',
    applicant: '#f59e0b',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    success: 'linear-gradient(to right, #10b981, #059669)',
    warning: 'linear-gradient(to right, #f59e0b, #ef4444)',
    cool: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    warm: 'linear-gradient(to right, #8b5cf6, #ec4899)',
    sunset: 'linear-gradient(to right, #f59e0b, #f97316)',
  },
} as const

export type ColorToken = typeof colors
export type ColorKey = keyof typeof colors
export type ColorShade = keyof typeof colors.primary
