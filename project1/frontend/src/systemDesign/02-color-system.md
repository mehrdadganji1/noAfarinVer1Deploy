# 🎨 سیستم رنگ

## فلسفه رنگ

سیستم رنگ نوآفرین بر پایه **وضوح، کنتراست و دسترسی‌پذیری** طراحی شده است.

## پالت رنگ اصلی

### Primary (آبی)
```typescript
primary: {
  50: '#eff6ff',   // خیلی روشن
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // پیش‌فرض
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',  // خیلی تیره
}
```
**استفاده:** دکمه‌های اصلی، لینک‌ها، فوکوس

### Success (سبز)
```typescript
success: {
  50: '#f0fdf4',
  500: '#10b981',  // پیش‌فرض
  900: '#064e3b',
}
```
**استفاده:** پیام‌های موفقیت، وضعیت فعال، تایید

### Warning (نارنجی)
```typescript
warning: {
  50: '#fffbeb',
  500: '#f59e0b',  // پیش‌فرض
  900: '#78350f',
}
```
**استفاده:** هشدارها، اطلاعیه‌های مهم

### Error (قرمز)
```typescript
error: {
  50: '#fef2f2',
  500: '#ef4444',  // پیش‌فرض
  900: '#7f1d1d',
}
```
**استفاده:** خطاها، حذف، لغو

### Info (آبی روشن)
```typescript
info: {
  50: '#ecfeff',
  500: '#06b6d4',  // پیش‌فرض
  900: '#164e63',
}
```
**استفاده:** اطلاعات، راهنما، نکات

## رنگ‌های خنثی (Gray Scale)

### Light Mode
```typescript
gray: {
  50: '#f9fafb',   // پس‌زمینه
  100: '#f3f4f6',  // پس‌زمینه ثانویه
  200: '#e5e7eb',  // border
  300: '#d1d5db',  // border hover
  400: '#9ca3af',  // متن غیرفعال
  500: '#6b7280',  // متن ثانویه
  600: '#4b5563',  // متن اصلی
  700: '#374151',
  800: '#1f2937',
  900: '#111827',  // متن تیره
}
```

### Dark Mode
```typescript
dark: {
  50: '#18181b',   // پس‌زمینه
  100: '#27272a',  // پس‌زمینه ثانویه
  200: '#3f3f46',  // border
  300: '#52525b',  // border hover
  400: '#71717a',  // متن غیرفعال
  500: '#a1a1aa',  // متن ثانویه
  600: '#d4d4d8',  // متن اصلی
  700: '#e4e4e7',
  800: '#f4f4f5',
  900: '#fafafa',  // متن روشن
}
```

## گرادیانت‌ها

### Primary Gradients
```css
/* Blue to Purple */
.gradient-primary {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
}

/* Blue to Cyan */
.gradient-cool {
  background: linear-gradient(to right, #3b82f6, #06b6d4);
}

/* Purple to Pink */
.gradient-warm {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
}
```

### Success Gradients
```css
/* Green to Emerald */
.gradient-success {
  background: linear-gradient(to right, #10b981, #059669);
}

/* Green to Teal */
.gradient-nature {
  background: linear-gradient(to right, #10b981, #14b8a6);
}
```

### Warning Gradients
```css
/* Orange to Red */
.gradient-warning {
  background: linear-gradient(to right, #f59e0b, #ef4444);
}

/* Orange to Amber */
.gradient-sunset {
  background: linear-gradient(to right, #f59e0b, #f97316);
}
```

## استفاده در کامپوننت‌ها

### دکمه‌ها
```tsx
// Primary Button
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  کلیک کنید
</button>

// Success Button
<button className="bg-green-600 hover:bg-green-700 text-white">
  تایید
</button>

// Danger Button
<button className="bg-red-600 hover:bg-red-700 text-white">
  حذف
</button>

// Ghost Button
<button className="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
  انصراف
</button>
```

### کارت‌ها
```tsx
// Light Card
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  محتوا
</div>

// Colored Card
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
  محتوا
</div>
```

### متن
```tsx
// Primary Text
<h1 className="text-gray-900 dark:text-white">
  عنوان اصلی
</h1>

// Secondary Text
<p className="text-gray-600 dark:text-gray-400">
  متن ثانویه
</p>

// Muted Text
<span className="text-gray-400 dark:text-gray-600">
  متن کم‌رنگ
</span>
```

## قوانین کنتراست

### WCAG 2.1 Level AA
- **متن معمولی:** حداقل 4.5:1
- **متن بزرگ:** حداقل 3:1
- **UI Components:** حداقل 3:1

### مثال‌های صحیح
```tsx
// ✅ کنتراست خوب (7.2:1)
<div className="bg-white text-gray-900">
  متن خوانا
</div>

// ✅ کنتراست خوب در Dark Mode (12.6:1)
<div className="bg-gray-900 text-white">
  متن خوانا
</div>

// ❌ کنتراست ضعیف (2.1:1)
<div className="bg-gray-100 text-gray-300">
  متن نامخوانا
</div>
```

## Semantic Colors

### Status Colors
```typescript
status: {
  active: '#10b981',    // سبز
  inactive: '#6b7280',  // خاکستری
  pending: '#f59e0b',   // نارنجی
  rejected: '#ef4444',  // قرمز
  draft: '#8b5cf6',     // بنفش
}
```

### Role Colors
```typescript
roles: {
  admin: '#ef4444',           // قرمز
  director: '#8b5cf6',        // بنفش
  coordinator: '#3b82f6',     // آبی
  mentor: '#10b981',          // سبز
  member: '#06b6d4',          // cyan
  applicant: '#f59e0b',       // نارنجی
}
```

## Design Tokens

### colors.ts
```typescript
export const colors = {
  // Primary
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  
  // Neutral
  gray: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  },
  
  // Dark Mode
  dark: {
    bg: '#18181b',
    card: '#27272a',
    border: '#3f3f46',
    text: '#fafafa',
  }
} as const

export type ColorToken = typeof colors
```

## استفاده با Tailwind

### tailwind.config.js
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // ... بقیه رنگ‌ها
      }
    }
  }
}
```

## Dark Mode Implementation

### CSS Variables
```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-border: #e5e7eb;
}

.dark {
  --color-bg: #18181b;
  --color-text: #fafafa;
  --color-border: #3f3f46;
}
```

### استفاده در کامپوننت
```tsx
<div className="bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-border)]">
  محتوا
</div>
```

## مثال‌های کاربردی

### Stats Card
```tsx
<div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 rounded-xl text-white">
  <h3 className="text-white/90 text-sm">کل کاربران</h3>
  <p className="text-3xl font-bold mt-2">1,234</p>
</div>
```

### Alert
```tsx
// Success Alert
<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-lg">
  عملیات با موفقیت انجام شد
</div>

// Error Alert
<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
  خطایی رخ داده است
</div>
```

### Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
  فعال
</span>
```

## چک‌لیست رنگ

- [ ] کنتراست حداقل 4.5:1 برای متن
- [ ] رنگ‌ها در Dark Mode تست شده
- [ ] از رنگ به تنهایی برای انتقال معنی استفاده نشده
- [ ] رنگ‌ها با brand identity هماهنگ هستند
- [ ] گرادیانت‌ها معنادار و زیبا هستند
- [ ] رنگ‌های semantic واضح هستند

## ابزارهای مفید

- [Coolors](https://coolors.co) - پالت رنگ
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - چک کنتراست
- [Color Hunt](https://colorhunt.co) - الهام رنگ
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) - رنگ‌های Tailwind
