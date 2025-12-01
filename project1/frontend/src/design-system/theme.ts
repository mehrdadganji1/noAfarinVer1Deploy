// Design System based on AACO Brand Identity
export const theme = {
  colors: {
    // Primary Colors - Based on the poster gradient
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d7fe',
      300: '#a5bbfc',
      400: '#8199f8',
      500: '#6366f1', // Main primary
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    // Secondary Colors - Purple/Pink gradient
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Main secondary
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    // Accent Colors - Cyan/Blue
    accent: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Main accent
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
    // Dark Background - From poster
    dark: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a', // Main dark
      950: '#020617',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    hero: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
    card: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
    glow: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
    neon: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #d946ef 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    neon: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(217, 70, 239, 0.3)',
    glow: '0 0 30px rgba(6, 182, 212, 0.4)',
  },
  animations: {
    float: 'float 6s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    glow: 'glow 2s ease-in-out infinite alternate',
    slideUp: 'slideUp 0.5s ease-out',
    fadeIn: 'fadeIn 0.6s ease-out',
  },
  spacing: {
    section: '120px',
    container: '1280px',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: 'IRANSans, Vazir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'IRANSans, Vazir, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
  },
};

export type Theme = typeof theme;
