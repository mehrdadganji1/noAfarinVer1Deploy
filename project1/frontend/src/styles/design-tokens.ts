/**
 * Design Tokens for Club Member Dashboard
 * Centralized design system configuration
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Secondary/Accent
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Status Colors
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    500: '#06b6d4',
    600: '#0891b2',
  },
  
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
  },
  
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#eab308',
    600: '#ca8a04',
  },
  
  // Neutral Colors
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
  
  // Gradients
  gradients: {
    purple: 'from-purple-500 to-pink-500',
    purplePink: 'from-purple-600 to-pink-600',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    amber: 'from-amber-500 to-yellow-500',
    teal: 'from-cyan-500 to-blue-500',
  },
  
  // Background Gradients
  bgGradients: {
    purple: 'from-purple-50 to-pink-50',
    blue: 'from-blue-50 to-cyan-50',
    green: 'from-green-50 to-emerald-50',
    amber: 'from-amber-50 to-yellow-50',
    teal: 'from-cyan-50 to-blue-50',
  },
} as const

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: ['IRANSans', 'Vazirmatn', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// ============================================
// SPACING
// ============================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',    // Mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large Desktop
  '2xl': '1600px', // Extra Large
} as const

// ============================================
// COMPONENT VARIANTS
// ============================================

export interface ComponentColor {
  name: string
  bgColor: string
  borderColor: string
  textColor: string
  iconColor: string
  gradient: string
  bgGradient: string
}

export const componentColors: Record<string, ComponentColor> = {
  blue: {
    name: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    iconColor: 'text-blue-600',
    gradient: colors.gradients.blue,
    bgGradient: colors.bgGradients.blue,
  },
  green: {
    name: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-600',
    iconColor: 'text-green-600',
    gradient: colors.gradients.green,
    bgGradient: colors.bgGradients.green,
  },
  purple: {
    name: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600',
    iconColor: 'text-purple-600',
    gradient: colors.gradients.purple,
    bgGradient: colors.bgGradients.purple,
  },
  amber: {
    name: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    iconColor: 'text-amber-600',
    gradient: colors.gradients.amber,
    bgGradient: colors.bgGradients.amber,
  },
  pink: {
    name: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-600',
    iconColor: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
  },
  cyan: {
    name: 'cyan',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-600',
    iconColor: 'text-cyan-600',
    gradient: 'from-cyan-500 to-teal-500',
    bgGradient: 'from-cyan-50 to-teal-50',
  },
}

// ============================================
// ICON SIZES
// ============================================

export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  base: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
  '3xl': 'h-16 w-16',
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color configuration for a specific color name
 */
export function getColorConfig(colorName: string): ComponentColor {
  return componentColors[colorName] || componentColors.purple
}

/**
 * Get gradient classes for a color
 */
export function getGradient(colorName: string): string {
  const config = getColorConfig(colorName)
  return config.gradient
}

/**
 * Get background gradient for a color
 */
export function getBgGradient(colorName: string): string {
  const config = getColorConfig(colorName)
  return config.bgGradient
}

// ============================================
// TYPE EXPORTS
// ============================================

export type ColorName = keyof typeof componentColors
export type IconSize = keyof typeof iconSizes
export type FontSize = keyof typeof typography.fontSize
export type Spacing = keyof typeof spacing

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  componentColors,
  iconSizes,
  getColorConfig,
  getGradient,
  getBgGradient,
}
