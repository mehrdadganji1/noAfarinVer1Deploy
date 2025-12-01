/**
 * AACO Design System
 * Inspired by ALAS COFOUNDER Brand Identity
 * Modern, Tech-focused, Persian-friendly Design System
 */

export const aacoTheme = {
  // ============================================
  // COLOR SYSTEM
  // ============================================
  colors: {
    // Primary Brand Colors (from poster gradient)
    primary: {
      50: '#E6F0FF',
      100: '#CCE0FF',
      200: '#99C2FF',
      300: '#66A3FF',
      400: '#3385FF',
      500: '#0066FF',  // Main brand blue
      600: '#0052CC',
      700: '#003D99',
      800: '#002966',
      900: '#001433',
    },

    // Secondary Purple (from poster gradient)
    secondary: {
      50: '#F5E6FF',
      100: '#EBCCFF',
      200: '#D699FF',
      300: '#C266FF',
      400: '#AD33FF',
      500: '#9900FF',  // Main brand purple
      600: '#7A00CC',
      700: '#5C0099',
      800: '#3D0066',
      900: '#1F0033',
    },

    // Accent Pink/Magenta (from poster highlights)
    accent: {
      50: '#FFE6F5',
      100: '#FFCCEB',
      200: '#FF99D6',
      300: '#FF66C2',
      400: '#FF33AD',
      500: '#FF0099',  // Vibrant pink
      600: '#CC007A',
      700: '#99005C',
      800: '#66003D',
      900: '#33001F',
    },

    // Cyan/Teal (from poster left side)
    cyan: {
      50: '#E6FFFF',
      100: '#CCFFFF',
      200: '#99FFFF',
      300: '#66FFFF',
      400: '#33FFFF',
      500: '#00FFFF',  // Bright cyan
      600: '#00CCCC',
      700: '#009999',
      800: '#006666',
      900: '#003333',
    },

    // Neutral/Dark (poster background)
    dark: {
      50: '#E6E8F0',
      100: '#CCD1E0',
      200: '#99A3C2',
      300: '#6675A3',
      400: '#334785',
      500: '#001966',  // Deep navy
      600: '#001452',
      700: '#000F3D',
      800: '#000A29',
      900: '#000514',
    },

    // Grayscale
    gray: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#868E96',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },

    // Semantic Colors
    success: {
      light: '#51CF66',
      main: '#37B24D',
      dark: '#2B8A3E',
    },
    warning: {
      light: '#FFD43B',
      main: '#FAB005',
      dark: '#F08C00',
    },
    error: {
      light: '#FF6B6B',
      main: '#FA5252',
      dark: '#E03131',
    },
    info: {
      light: '#74C0FC',
      main: '#339AF0',
      dark: '#1C7ED6',
    },

    // Background Colors
    background: {
      primary: '#000514',      // Deep dark
      secondary: '#001433',    // Navy dark
      tertiary: '#001966',     // Lighter navy
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
      overlay: 'rgba(0, 5, 20, 0.9)',
    },

    // Text Colors
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
      tertiary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.4)',
      inverse: '#000514',
    },
  },

  // ============================================
  // GRADIENTS (Key feature from poster)
  // ============================================
  gradients: {
    primary: 'linear-gradient(135deg, #0066FF 0%, #9900FF 100%)',
    secondary: 'linear-gradient(135deg, #00FFFF 0%, #0066FF 50%, #9900FF 100%)',
    accent: 'linear-gradient(135deg, #FF0099 0%, #9900FF 100%)',
    hero: 'linear-gradient(135deg, #001433 0%, #001966 50%, #4D0066 100%)',
    card: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(153, 0, 255, 0.1) 100%)',
    glow: 'radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      persian: "'Vazirmatn', 'Yekan Bakh', 'IRANSans', sans-serif",
      mono: "'Fira Code', 'Consolas', 'Monaco', monospace",
      display: "'Orbitron', 'Inter', sans-serif", // For tech-style headings
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
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
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
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ============================================
  // SPACING SYSTEM
  // ============================================
  spacing: {
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
    32: '8rem',     // 128px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },

  // ============================================
  // SHADOWS & EFFECTS
  // ============================================
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Glow effects (inspired by poster)
    glowBlue: '0 0 20px rgba(0, 102, 255, 0.5), 0 0 40px rgba(0, 102, 255, 0.3)',
    glowPurple: '0 0 20px rgba(153, 0, 255, 0.5), 0 0 40px rgba(153, 0, 255, 0.3)',
    glowPink: '0 0 20px rgba(255, 0, 153, 0.5), 0 0 40px rgba(255, 0, 153, 0.3)',
    glowCyan: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)',
  },

  // ============================================
  // ANIMATIONS & TRANSITIONS
  // ============================================
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  animations: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.9)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    glow: {
      '0%, 100%': { filter: 'brightness(1)' },
      '50%': { filter: 'brightness(1.3)' },
    },
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============================================
  // Z-INDEX SCALE
  // ============================================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
} as const;

export type AAcoTheme = typeof aacoTheme;
