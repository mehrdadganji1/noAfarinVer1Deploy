# 🌙 Dark Mode

## استراتژی Dark Mode

### 1. Class-Based Approach
```tsx
// با استفاده از class 'dark'
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">عنوان</h1>
  <p className="text-gray-600 dark:text-gray-400">متن</p>
</div>
```

### 2. CSS Variables
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}

.dark {
  --bg-primary: #18181b;
  --text-primary: #fafafa;
}
```

## پالت رنگ Dark Mode

### Backgrounds
```typescript
backgrounds: {
  primary: '#18181b',    // پس‌زمینه اصلی
  secondary: '#27272a',  // کارت‌ها
  tertiary: '#3f3f46',   // hover states
}
```

### Text Colors
```typescript
text: {
  primary: '#fafafa',    // متن اصلی
  secondary: '#a1a1aa',  // متن ثانویه
  muted: '#71717a',      // متن کم‌رنگ
}
```

### Borders
```typescript
borders: {
  default: '#3f3f46',
  hover: '#52525b',
}
```

## کامپوننت‌های Dark Mode

### Button
```tsx
<button className="
  bg-blue-600 hover:bg-blue-700
  dark:bg-blue-500 dark:hover:bg-blue-600
  text-white
">
  کلیک کنید
</button>
```

### Card
```tsx
<div className="
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  shadow-lg dark:shadow-gray-900/50
">
  محتوا
</div>
```

### Input
```tsx
<input className="
  bg-white dark:bg-gray-800
  border-gray-300 dark:border-gray-600
  text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-500
  focus:border-blue-500 dark:focus:border-blue-400
" />
```

## Toggle Dark Mode

### useTheme Hook
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
)
```

### Theme Provider
```tsx
'use client'

import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
```

### Theme Toggle Button
```tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="تغییر تم"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}
```

## بهترین شیوه‌ها

### 1. همیشه هر دو حالت را تست کنید
```tsx
// ✅ درست
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ❌ اشتباه - فقط light mode
<div className="bg-white text-gray-900">
```

### 2. از opacity برای تیره‌تر کردن استفاده کنید
```tsx
// ✅ درست
<div className="bg-black/10 dark:bg-white/10">

// ❌ اشتباه - رنگ‌های hard-coded
<div className="bg-gray-100 dark:bg-gray-800">
```

### 3. تصاویر را برای Dark Mode بهینه کنید
```tsx
<img 
  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
  alt="Logo"
/>
```

## چک‌لیست Dark Mode

- [ ] همه کامپوننت‌ها Dark Mode دارند
- [ ] کنتراست در Dark Mode مناسب است
- [ ] تصاویر در Dark Mode مناسب هستند
- [ ] انیمیشن‌ها در Dark Mode روان هستند
- [ ] Toggle button کار می‌کند
- [ ] تم در localStorage ذخیره می‌شود
- [ ] SSR/SSG مشکل ندارد
