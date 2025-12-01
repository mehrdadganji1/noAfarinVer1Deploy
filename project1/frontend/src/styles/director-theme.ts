// Director General Dashboard Theme
export const directorTheme = {
  colors: {
    primary: {
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      solid: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5'
    },
    metrics: {
      blue: {
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        gradient: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      green: {
        gradient: 'from-green-500 to-emerald-500',
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      orange: {
        gradient: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200'
      }
    }
  },
  animations: {
    fadeIn: 'animate-in fade-in duration-500',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
    scaleIn: 'animate-in zoom-in-95 duration-300',
    shimmer: 'animate-shimmer'
  },
  shadows: {
    card: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
    elevated: 'shadow-2xl',
    glow: 'shadow-lg shadow-purple-500/50'
  }
}

// Animation keyframes to add to global CSS
export const directorAnimations = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`
