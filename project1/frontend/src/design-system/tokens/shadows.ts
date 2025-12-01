/**
 * ✨ Shadow & Effect Design Tokens
 * Including neon glows and glassmorphism effects
 */

/**
 * Box Shadows
 * Elevated shadows for depth and hierarchy
 */
export const boxShadows = {
  // Standard shadows
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Neon glow shadows (colored)
  neon: {
    pink: {
      sm: '0 0 5px rgba(255, 20, 147, 0.5)',
      md: '0 0 10px rgba(255, 20, 147, 0.6)',
      lg: '0 0 20px rgba(255, 20, 147, 0.7)',
      xl: '0 0 40px rgba(255, 20, 147, 0.8)',
    },
    purple: {
      sm: '0 0 5px rgba(139, 79, 184, 0.5)',
      md: '0 0 10px rgba(139, 79, 184, 0.6)',
      lg: '0 0 20px rgba(139, 79, 184, 0.7)',
      xl: '0 0 40px rgba(139, 79, 184, 0.8)',
    },
    cyan: {
      sm: '0 0 5px rgba(0, 206, 209, 0.5)',
      md: '0 0 10px rgba(0, 206, 209, 0.6)',
      lg: '0 0 20px rgba(0, 206, 209, 0.7)',
      xl: '0 0 40px rgba(0, 206, 209, 0.8)',
    },
    orange: {
      sm: '0 0 5px rgba(255, 165, 0, 0.5)',
      md: '0 0 10px rgba(255, 165, 0, 0.6)',
      lg: '0 0 20px rgba(255, 165, 0, 0.7)',
      xl: '0 0 40px rgba(255, 165, 0, 0.8)',
    },
  },

  // Combined shadow + neon glow
  elevated: {
    pink: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 15px rgba(255, 20, 147, 0.5)',
    purple: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 15px rgba(139, 79, 184, 0.5)',
    cyan: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 15px rgba(0, 206, 209, 0.5)',
  },
} as const

/**
 * Drop Shadows (for SVGs and images)
 */
export const dropShadows = {
  sm: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
  base: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
  md: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
  lg: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
  xl: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
  '2xl': 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
  none: 'drop-shadow(0 0 #0000)',
} as const

/**
 * Text Shadows
 */
export const textShadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  base: '0 1px 3px rgba(0, 0, 0, 0.2)',
  md: '0 2px 4px rgba(0, 0, 0, 0.2)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.3)',
  xl: '0 8px 12px rgba(0, 0, 0, 0.4)',

  // Neon text glow
  neon: {
    pink: '0 0 10px rgba(255, 20, 147, 0.8), 0 0 20px rgba(255, 20, 147, 0.5)',
    purple: '0 0 10px rgba(139, 79, 184, 0.8), 0 0 20px rgba(139, 79, 184, 0.5)',
    cyan: '0 0 10px rgba(0, 206, 209, 0.8), 0 0 20px rgba(0, 206, 209, 0.5)',
  },

  // Outline effect
  outline: {
    black: '0 0 1px #000, 0 0 1px #000, 0 0 1px #000',
    white: '0 0 1px #fff, 0 0 1px #fff, 0 0 1px #fff',
  },
} as const

/**
 * Blur Effects
 */
export const blur = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const

/**
 * Backdrop Blur (for glassmorphism)
 */
export const backdropBlur = {
  none: 'blur(0)',
  sm: 'blur(4px)',
  base: 'blur(8px)',
  md: 'blur(12px)',
  lg: 'blur(16px)',
  xl: 'blur(24px)',
  '2xl': 'blur(40px)',
  '3xl': 'blur(64px)',
} as const

/**
 * Glassmorphism Presets
 * Complete glass card styles
 */
export const glassPresets = {
  light: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
  purple: {
    background: 'rgba(139, 79, 184, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(139, 79, 184, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(139, 79, 184, 0.2)',
  },
  pink: {
    background: 'rgba(255, 20, 147, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 20, 147, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(255, 20, 147, 0.2)',
  },
} as const

/**
 * Gradient Overlays
 * For layering on images or backgrounds
 */
export const gradientOverlays = {
  dark: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  light: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)',
  purple: 'linear-gradient(180deg, rgba(107,46,158,0) 0%, rgba(107,46,158,0.8) 100%)',
  pink: 'linear-gradient(180deg, rgba(255,20,147,0) 0%, rgba(255,20,147,0.8) 100%)',
  purpleToPink: 'linear-gradient(135deg, rgba(107,46,158,0.9) 0%, rgba(255,20,147,0.9) 100%)',
} as const

/**
 * Export for Tailwind Config
 */
export const tailwindShadows = {
  boxShadow: {
    ...boxShadows,
    'neon-pink-sm': boxShadows.neon.pink.sm,
    'neon-pink-md': boxShadows.neon.pink.md,
    'neon-pink-lg': boxShadows.neon.pink.lg,
    'neon-purple-sm': boxShadows.neon.purple.sm,
    'neon-purple-md': boxShadows.neon.purple.md,
    'neon-purple-lg': boxShadows.neon.purple.lg,
    'neon-cyan-sm': boxShadows.neon.cyan.sm,
    'neon-cyan-md': boxShadows.neon.cyan.md,
    'neon-cyan-lg': boxShadows.neon.cyan.lg,
  },
  dropShadow: dropShadows,
  blur,
  backdropBlur,
}

export type BoxShadow = keyof typeof boxShadows
export type DropShadow = keyof typeof dropShadows
export type Blur = keyof typeof blur
export type GlassPreset = keyof typeof glassPresets
