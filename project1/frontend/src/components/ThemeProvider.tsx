import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme)
  }, [])

  return <>{children}</>
}
