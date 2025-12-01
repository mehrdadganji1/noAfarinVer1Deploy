/**
 * 📝 Typography Design Tokens
 * Using Pinar font family for Persian/Farsi text
 * With fallbacks for Latin text
 */

export const fontFamilies = {
  // Primary font (Pinar - Persian)
  primary: ['Pinar', 'Vazirmatn', 'Tahoma', 'Arial', 'sans-serif'],
  
  // Secondary font (for Latin/English)
  secondary: ['Inter', 'SF Pro', 'Helvetica Neue', 'sans-serif'],
  
  // Monospace (for code)
  mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  
  // Display (for large headings)
  display: ['Pinar', 'Vazirmatn', 'sans-serif'],
} as const

/**
 * Font Weights
 */
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const

/**
 * Font Sizes
 * Based on 16px base (1rem)
 * Using modular scale (1.25 ratio)
 */
export const fontSizes = {
  // Small sizes
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  
  // Medium sizes
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  
  // Large sizes
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  
  // Display sizes
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
} as const

/**
 * Line Heights
 */
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const

/**
 * Letter Spacing
 */
export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

/**
 * Typography Styles
 * Predefined text styles for common use cases
 */
export const typographyStyles = {
  // Display (for hero sections)
  display: {
    '2xl': {
      fontSize: fontSizes['9xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.black,
      letterSpacing: letterSpacings.tight,
    },
    xl: {
      fontSize: fontSizes['8xl'],
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.black,
      letterSpacing: letterSpacings.tight,
    },
    lg: {
      fontSize: fontSizes['7xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: fontSizes['5xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.tight,
    },
    h2: {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights.tight,
      fontWeight: fontWeights.bold,
      letterSpacing: letterSpacings.normal,
    },
    h3: {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacings.normal,
    },
    h4: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.snug,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacings.normal,
    },
    h5: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacings.normal,
    },
    h6: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacings.normal,
    },
  },

  // Body text
  body: {
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.regular,
    },
    base: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
    },
  },

  // Utility text
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
  },
  
  overline: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.semibold,
    letterSpacing: letterSpacings.widest,
    textTransform: 'uppercase' as const,
  },

  // Button text
  button: {
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacings.wide,
    },
    base: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.semibold,
      letterSpacing: letterSpacings.wide,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.none,
      fontWeight: fontWeights.medium,
      letterSpacing: letterSpacings.normal,
    },
  },

  // Label text
  label: {
    lg: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
    },
    base: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
    },
    sm: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.medium,
    },
  },

  // Code
  code: {
    inline: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
      fontWeight: fontWeights.regular,
      fontFamily: fontFamilies.mono.join(', '),
    },
    block: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.relaxed,
      fontWeight: fontWeights.regular,
      fontFamily: fontFamilies.mono.join(', '),
    },
  },
} as const

/**
 * Responsive Typography
 * Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
 */
export const responsiveTypography = {
  display: {
    base: fontSizes['5xl'],
    sm: fontSizes['6xl'],
    md: fontSizes['7xl'],
    lg: fontSizes['8xl'],
    xl: fontSizes['9xl'],
  },
  h1: {
    base: fontSizes['3xl'],
    sm: fontSizes['4xl'],
    md: fontSizes['5xl'],
  },
  h2: {
    base: fontSizes['2xl'],
    sm: fontSizes['3xl'],
    md: fontSizes['4xl'],
  },
  h3: {
    base: fontSizes.xl,
    sm: fontSizes['2xl'],
    md: fontSizes['3xl'],
  },
} as const

/**
 * Export for Tailwind Config
 */
export const tailwindTypography = {
  fontFamily: {
    primary: fontFamilies.primary,
    secondary: fontFamilies.secondary,
    mono: fontFamilies.mono,
    display: fontFamilies.display,
  },
  fontSize: fontSizes,
  fontWeight: fontWeights,
  lineHeight: lineHeights,
  letterSpacing: letterSpacings,
}

export type FontFamily = keyof typeof fontFamilies
export type FontWeight = keyof typeof fontWeights
export type FontSize = keyof typeof fontSizes
export type LineHeight = keyof typeof lineHeights
export type LetterSpacing = keyof typeof letterSpacings
