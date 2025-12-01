/**
 * Noafarin Design System
 * 
 * Professional color palette and design tokens
 * Based on: Primary Blue + Accent Purple
 */

export const colors = {
  // Futuristic Cyan (Primary)
  primary: {
    50: '#E0F9FF',
    100: '#B3F0FF',
    200: '#80E7FF',
    300: '#4DDDFF',
    400: '#26D4FF',
    500: '#00D9FF',  // Main neon cyan
    600: '#00B8D9',
    700: '#0097B3',
    800: '#00768C',
    900: '#005566',
  },
  
  // Neon Purple (Accent)
  accent: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#7209B7',  // Deep purple
    600: '#6A1B9A',
    700: '#5E35B1',
    800: '#512DA8',
    900: '#4527A0',
  },
  
  // Hot Pink (Secondary)
  secondary: {
    50: '#FFE0F0',
    100: '#FFB3D9',
    200: '#FF80C0',
    300: '#FF4DA7',
    400: '#FF2694',
    500: '#FF006E',  // Neon pink
    600: '#E6005E',
    700: '#CC004E',
    800: '#B3003E',
    900: '#99002E',
  },

  // Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral Colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
}

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Neon Glow Shadows
  neon: {
    cyan: '0 0 10px rgba(0, 217, 255, 0.3), 0 0 20px rgba(0, 217, 255, 0.2)',
    purple: '0 0 10px rgba(114, 9, 183, 0.3), 0 0 20px rgba(114, 9, 183, 0.2)',
    pink: '0 0 10px rgba(255, 0, 110, 0.3), 0 0 20px rgba(255, 0, 110, 0.2)',
    multi: '0 0 15px rgba(0, 217, 255, 0.2), 0 0 30px rgba(114, 9, 183, 0.2)',
  },
}

export const typography = {
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// Gradient Definitions
export const gradients = {
  // Minimal border gradients
  border: {
    cyan: 'linear-gradient(135deg, #00D9FF 0%, #00B8D9 100%)',
    purple: 'linear-gradient(135deg, #7209B7 0%, #AB47BC 100%)',
    pink: 'linear-gradient(135deg, #FF006E 0%, #FF4DA7 100%)',
    multi: 'linear-gradient(135deg, #00D9FF 0%, #7209B7 50%, #FF006E 100%)',
    rainbow: 'linear-gradient(90deg, #00D9FF 0%, #7209B7 50%, #FF006E 100%)',
  },
  
  // Background gradients (subtle)
  bg: {
    cyan: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(0, 217, 255, 0.02) 100%)',
    purple: 'linear-gradient(135deg, rgba(114, 9, 183, 0.05) 0%, rgba(114, 9, 183, 0.02) 100%)',
    pink: 'linear-gradient(135deg, rgba(255, 0, 110, 0.05) 0%, rgba(255, 0, 110, 0.02) 100%)',
  },
}

// Component Variants
export const cardVariants = {
  default: {
    background: 'white',
    border: colors.neutral[200],
    shadow: shadows.sm,
    gradient: null,
  },
  neon: {
    background: 'white',
    border: 'transparent',
    shadow: shadows.neon.multi,
    gradient: gradients.border.multi,
  },
  cyan: {
    background: 'white',
    border: 'transparent',
    shadow: shadows.neon.cyan,
    gradient: gradients.border.cyan,
  },
  purple: {
    background: 'white',
    border: 'transparent',
    shadow: shadows.neon.purple,
    gradient: gradients.border.purple,
  },
}

export const buttonVariants = {
  primary: {
    background: colors.primary[500],
    color: 'white',
    hover: colors.primary[600],
    glow: shadows.neon.cyan,
  },
  secondary: {
    background: colors.accent[500],
    color: 'white',
    hover: colors.accent[600],
    glow: shadows.neon.purple,
  },
  neon: {
    background: 'linear-gradient(135deg, #00D9FF 0%, #7209B7 100%)',
    color: 'white',
    hover: 'linear-gradient(135deg, #00B8D9 0%, #6A1B9A 100%)',
    glow: shadows.neon.multi,
  },
  outline: {
    background: 'transparent',
    color: colors.primary[600],
    border: colors.primary[300],
    hover: colors.primary[50],
  },
  ghost: {
    background: 'transparent',
    color: colors.neutral[700],
    hover: colors.neutral[100],
  },
}
