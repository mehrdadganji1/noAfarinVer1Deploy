/**
 * 🎨 Design System - Central Export
 * 
 * این فایل تمام design tokens و utilities را export می‌کند
 * برای استفاده در کل پروژه
 */

// Tokens
export * from './tokens/colors';
export * from './tokens/spacing';
export * from './tokens/typography';
export * from './tokens/shadows';

// Re-export commonly used items
export { colors, semanticColors, tailwindColors } from './tokens/colors';
export { spacing } from './tokens/spacing';
export { typography } from './tokens/typography';
export { shadows } from './tokens/shadows';

/**
 * Design System Configuration
 */
export const designSystem = {
  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
    ultraWide: '1920px',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },

  // Animation durations
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Animation easings
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
} as const;

export type DesignSystem = typeof designSystem;
