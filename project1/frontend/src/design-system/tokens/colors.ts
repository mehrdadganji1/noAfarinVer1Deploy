/**
 * 🎨 Color Design Tokens
 * Based on Purple-Cyan-Pink gradient palette
 * Inspired by modern, bold, foxy design
 */

export const colors = {
  // Primary Purple Spectrum
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#8B4FB8',  // Main Purple
    600: '#6B2E9E',  // Royal Purple
    700: '#581C87',
    800: '#3D1A5F',  // Deep Purple
    900: '#2D1349',
  },

  // Accent Pink/Magenta
  accent: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#FF1493',  // Hot Pink (Main CTA)
    600: '#E91E8C',  // Magenta
    700: '#D81B60',
    800: '#BE185D',
    900: '#9F1239',
  },

  // Complementary Cyan/Turquoise
  info: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#00CED1',  // Cyan
    600: '#00B8D4',  // Deep Cyan
    700: '#0891B2',
    800: '#0E7490',
    900: '#155E75',
  },

  // Success (Green with purple tint)
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

  // Warning (Orange/Amber)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#FFA500',  // Orange
    600: '#FF8C00',  // Amber
    700: '#D97706',
    800: '#B45309',
    900: '#92400E',
  },

  // Error (Red with magenta tint)
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

  // Neutral Grays
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Special Effects
  neon: {
    pink: '#FF1493',
    purple: '#8B4FB8',
    cyan: '#00CED1',
    orange: '#FFA500',
  },

  // Gradients (for inline styles and backgrounds)
  gradients: {
    purplePink: 'linear-gradient(135deg, #6B2E9E 0%, #FF1493 100%)',
    cyanPurple: 'linear-gradient(135deg, #00CED1 0%, #8B4FB8 100%)',
    purpleOrange: 'linear-gradient(135deg, #8B4FB8 0%, #FFA500 100%)',
    darkPurple: 'linear-gradient(135deg, #3D1A5F 0%, #6B2E9E 100%)',
    neonGlow: 'linear-gradient(135deg, #FF1493 0%, #00CED1 100%)',
    sunset: 'linear-gradient(135deg, #FFA500 0%, #FF1493 50%, #8B4FB8 100%)',
  },

  // Glass effect colors (with alpha)
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
    purple: 'rgba(139, 79, 184, 0.1)',
    pink: 'rgba(255, 20, 147, 0.1)',
  },
} as const

/**
 * Semantic Color Mapping
 * Maps design tokens to semantic use cases
 */
export const semanticColors = {
  // Text colors
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    tertiary: colors.gray[400],
    inverse: colors.gray[50],
    link: colors.primary[600],
    linkHover: colors.primary[700],
  },

  // Background colors
  background: {
    primary: colors.gray[50],
    secondary: colors.gray[100],
    tertiary: colors.gray[200],
    inverse: colors.gray[900],
    overlay: colors.glass.dark,
  },

  // Border colors
  border: {
    default: colors.gray[200],
    strong: colors.gray[300],
    subtle: colors.gray[100],
    focus: colors.primary[500],
    error: colors.error[500],
  },

  // Interactive states
  interactive: {
    default: colors.primary[600],
    hover: colors.primary[700],
    active: colors.primary[800],
    disabled: colors.gray[300],
    focus: colors.primary[500],
  },

  // Dark mode overrides
  dark: {
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[300],
      tertiary: colors.gray[500],
    },
    background: {
      primary: colors.gray[950],
      secondary: colors.gray[900],
      tertiary: colors.gray[800],
    },
    border: {
      default: colors.gray[700],
      strong: colors.gray[600],
      subtle: colors.gray[800],
    },
  },
} as const

/**
 * Export for Tailwind Config
 */
export const tailwindColors = {
  primary: colors.primary,
  accent: colors.accent,
  info: colors.info,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  gray: colors.gray,
  neon: colors.neon,
}

export type ColorToken = keyof typeof colors
export type SemanticColorToken = keyof typeof semanticColors
