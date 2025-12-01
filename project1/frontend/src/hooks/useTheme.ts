import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        set({ theme })
        
        // Apply theme to document
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.add(systemTheme)
          set({ resolvedTheme: systemTheme })
        } else {
          root.classList.add(theme)
          set({ resolvedTheme: theme })
        }
      },

      toggleTheme: () => {
        const current = get().resolvedTheme
        const newTheme = current === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'noafarin-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on load
        if (state) {
          state.setTheme(state.theme)
        }
      },
    }
  )
)

// Listen to system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const store = useTheme.getState()
    if (store.theme === 'system') {
      store.setTheme('system')
    }
  })
}
