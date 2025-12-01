# 🎨 سیستم دیزاین نوآفرین

سیستم دیزاین جامع و حرفه‌ای برای داشبورد نوآفرین با پشتیبانی کامل از Dark/Light Mode، Mobile-First Design و معماری ماژولار.

## 📚 فهرست مطالب

1. [اصول طراحی](./01-design-principles.md)
2. [سیستم رنگ](./02-color-system.md)
3. [تایپوگرافی](./03-typography.md)
4. [Spacing & Layout](./04-spacing-layout.md)
5. [کامپوننت‌ها](./05-components.md)
6. [انیمیشن‌ها](./06-animations.md)
7. [Responsive Design](./07-responsive.md)
8. [Dark Mode](./08-dark-mode.md)
9. [Accessibility](./09-accessibility.md)
10. [Best Practices](./10-best-practices.md)

## 🎯 اهداف

- **یکپارچگی**: تجربه کاربری یکپارچ در تمام صفحات
- **دسترسی‌پذیری**: WCAG 2.1 Level AA compliance
- **عملکرد**: بهینه‌سازی برای سرعت و کارایی
- **مقیاس‌پذیری**: قابلیت توسعه و نگهداری آسان
- **زیبایی**: طراحی مدرن و حرفه‌ای

## 🚀 شروع سریع

```tsx
// استفاده از تم
import { useTheme } from '@/hooks/useTheme'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {/* محتوا */}
    </div>
  )
}
```

## 📦 ساختار فولدر

```
systemDesign/
├── README.md                    # این فایل
├── 01-design-principles.md      # اصول طراحی
├── 02-color-system.md           # سیستم رنگ
├── 03-typography.md             # تایپوگرافی
├── 04-spacing-layout.md         # فاصله‌گذاری و چیدمان
├── 05-components.md             # راهنمای کامپوننت‌ها
├── 06-animations.md             # انیمیشن‌ها
├── 07-responsive.md             # طراحی ریسپانسیو
├── 08-dark-mode.md              # حالت تاریک
├── 09-accessibility.md          # دسترسی‌پذیری
├── 10-best-practices.md         # بهترین شیوه‌ها
├── tokens/                      # Design Tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
└── examples/                    # مثال‌های کاربردی
    ├── dashboard-page.tsx
    ├── form-page.tsx
    └── data-table.tsx
```

## 🎨 ویژگی‌های کلیدی

### 1. Mobile-First Design
```css
/* پیش‌فرض: موبایل */
.container { padding: 1rem; }

/* تبلت */
@media (min-width: 768px) {
  .container { padding: 1.5rem; }
}

/* دسکتاپ */
@media (min-width: 1024px) {
  .container { padding: 2rem; }
}
```

### 2. Dark Mode Support
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  محتوا
</div>
```

### 3. Design Tokens
```typescript
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  }
}
```

### 4. Component Library
```tsx
import { Button, Card, Input } from '@/components/ui'

<Button variant="primary" size="lg">
  کلیک کنید
</Button>
```

## 🔧 تکنولوژی‌ها

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-First CSS
- **Framer Motion** - Animations
- **Radix UI** - Accessible Components
- **CSS Variables** - Dynamic Theming

## 📱 Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // موبایل بزرگ
  md: '768px',   // تبلت
  lg: '1024px',  // لپ‌تاپ
  xl: '1280px',  // دسکتاپ
  '2xl': '1536px' // دسکتاپ بزرگ
}
```

## 🎭 تم‌ها

### Light Theme
- پس‌زمینه: سفید و خاکستری روشن
- متن: خاکستری تیره و مشکی
- رنگ‌های پررنگ و واضح

### Dark Theme
- پس‌زمینه: خاکستری تیره و مشکی
- متن: سفید و خاکستری روشن
- رنگ‌های کم‌نور و راحت برای چشم

## 📐 Grid System

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>کارت 1</Card>
  <Card>کارت 2</Card>
  <Card>کارت 3</Card>
</div>
```

## 🎨 رنگ‌های اصلی

```typescript
primary: Blue (#3b82f6)      // اقدامات اصلی
success: Green (#10b981)     // موفقیت
warning: Orange (#f59e0b)    // هشدار
error: Red (#ef4444)         // خطا
info: Cyan (#06b6d4)         // اطلاعات
```

## 📝 مثال کامل

```tsx
import { PageHeader, StatsCard, Card } from '@/components/shared'
import { Users, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="داشبورد"
        icon={Users}
        gradient="from-blue-600 to-purple-600"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="کاربران"
          value="1,234"
          change="+12%"
          trend="up"
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
        />
      </div>
    </div>
  )
}
```

## 🔗 لینک‌های مفید

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Radix UI Docs](https://www.radix-ui.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

## 👥 مشارکت

برای مشارکت در توسعه سیستم دیزاین:

1. فایل مربوطه را مطالعه کنید
2. تغییرات را با اصول طراحی هماهنگ کنید
3. مثال‌های کاربردی اضافه کنید
4. مستندات را به‌روز کنید

## 📄 لایسنس

این سیستم دیزاین برای استفاده داخلی پروژه نوآفرین طراحی شده است.

---

**نسخه:** 1.0.0  
**آخرین به‌روزرسانی:** 2024  
**نگهدارنده:** تیم توسعه نوآفرین
