# 🎯 اصول طراحی

## فلسفه طراحی

سیستم دیزاین نوآفرین بر پایه **سادگی، یکپارچگی و دسترسی‌پذیری** بنا شده است.

## اصول اصلی

### 1. 📱 Mobile-First (موبایل اول)

**چرا؟** بیش از 60% کاربران از موبایل استفاده می‌کنند.

```tsx
// ❌ اشتباه: Desktop-First
<div className="w-full lg:w-1/2 md:w-3/4">

// ✅ درست: Mobile-First
<div className="w-full md:w-3/4 lg:w-1/2">
```

**قوانین:**
- طراحی از موبایل شروع شود
- محتوای اصلی در موبایل قابل دسترس باشد
- دکمه‌ها حداقل 44x44px باشند
- فاصله‌ها برای لمس راحت باشند

### 2. 🎨 Consistency (یکپارچگی)

**چرا؟** کاربر نباید در هر صفحه چیز جدیدی یاد بگیرد.

```tsx
// ✅ یکپارچگی در دکمه‌ها
<Button variant="primary">ذخیره</Button>
<Button variant="secondary">انصراف</Button>
<Button variant="danger">حذف</Button>

// ❌ عدم یکپارچگی
<button className="bg-blue-500">ذخیره</button>
<a className="text-gray-600">انصراف</a>
<div onClick={handleDelete}>حذف</div>
```

**قوانین:**
- از کامپوننت‌های مشترک استفاده کنید
- رنگ‌ها و فونت‌ها یکسان باشند
- الگوهای تعاملی مشابه باشند
- پیام‌های خطا و موفقیت یکسان باشند

### 3. ♿ Accessibility (دسترسی‌پذیری)

**چرا؟** همه باید بتوانند از سیستم استفاده کنند.

```tsx
// ✅ دسترسی‌پذیر
<button
  aria-label="حذف کاربر"
  onClick={handleDelete}
>
  <TrashIcon />
</button>

// ❌ غیر قابل دسترس
<div onClick={handleDelete}>
  <TrashIcon />
</div>
```

**قوانین:**
- ARIA labels برای همه عناصر تعاملی
- کنتراست رنگ حداقل 4.5:1
- Navigation با کیبورد
- Screen reader support

### 4. ⚡ Performance (عملکرد)

**چرا؟** سرعت = تجربه کاربری بهتر

```tsx
// ✅ بهینه
import { lazy, Suspense } from 'react'
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>

// ❌ غیر بهینه
import HeavyComponent from './HeavyComponent'
<HeavyComponent />
```

**قوانین:**
- Code splitting
- Lazy loading برای تصاویر
- Memoization برای محاسبات سنگین
- Debounce برای search inputs

### 5. 🧩 Modularity (ماژولار بودن)

**چرا؟** نگهداری و توسعه آسان‌تر

```tsx
// ✅ ماژولار
<Card>
  <CardHeader>
    <CardTitle>عنوان</CardTitle>
  </CardHeader>
  <CardContent>
    محتوا
  </CardContent>
</Card>

// ❌ غیر ماژولار
<div className="card">
  <div className="card-header">
    <h3>عنوان</h3>
  </div>
  <div className="card-content">
    محتوا
  </div>
</div>
```

**قوانین:**
- کامپوننت‌های کوچک و قابل استفاده مجدد
- Single Responsibility Principle
- Props واضح و مستند
- TypeScript برای type safety

### 6. 🎭 Progressive Enhancement

**چرا؟** کار کردن در همه مرورگرها

```tsx
// ✅ Progressive Enhancement
<button
  className="bg-blue-500 hover:bg-blue-600 transition-colors"
  style={{ 
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
  }}
>
  کلیک کنید
</button>

// پشتیبان: اگر gradient کار نکرد، رنگ ساده نمایش داده می‌شود
```

**قوانین:**
- Fallbacks برای ویژگی‌های جدید
- تست در مرورگرهای مختلف
- Polyfills در صورت نیاز

### 7. 🌙 Dark Mode First

**چرا؟** راحتی چشم در شب

```tsx
// ✅ Dark Mode Support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  محتوا
</div>

// ❌ فقط Light Mode
<div className="bg-white text-gray-900">
  محتوا
</div>
```

**قوانین:**
- همه کامپوننت‌ها Dark Mode دارند
- رنگ‌ها در Dark Mode تست شوند
- تصاویر در Dark Mode مناسب باشند

### 8. 📐 Grid-Based Layout

**چرا؟** چیدمان منظم و حرفه‌ای

```tsx
// ✅ Grid System
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>

// ❌ بدون Grid
<div className="flex flex-wrap">
  <div className="w-1/3"><Card /></div>
  <div className="w-1/3"><Card /></div>
  <div className="w-1/3"><Card /></div>
</div>
```

**قوانین:**
- از Grid برای layouts استفاده کنید
- Gap یکسان در تمام صفحات
- Responsive breakpoints

### 9. 🎬 Meaningful Animations

**چرا؟** راهنمایی کاربر و جذابیت

```tsx
// ✅ انیمیشن معنادار
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  محتوا
</motion.div>

// ❌ انیمیشن بی‌هدف
<motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity }}
>
  محتوا
</motion.div>
```

**قوانین:**
- انیمیشن‌ها کوتاه (200-400ms)
- هدفمند و معنادار
- قابل غیرفعال کردن
- عملکرد را کاهش ندهند

### 10. 📝 Content-First

**چرا؟** محتوا مهم‌تر از طراحی است

```tsx
// ✅ محتوا محور
<Card>
  <h2 className="text-2xl font-bold mb-4">عنوان مهم</h2>
  <p className="text-gray-600 leading-relaxed">
    محتوای خوانا و واضح
  </p>
</Card>

// ❌ طراحی محور
<Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
  <h2 className="text-xs">عنوان</h2>
  <p className="text-[8px]">محتوا</p>
</Card>
```

**قوانین:**
- خوانایی اولویت اول
- Hierarchy واضح
- فاصله‌های مناسب
- فونت‌های خوانا

## چک‌لیست طراحی

قبل از تکمیل هر کامپوننت:

- [ ] Mobile-First طراحی شده؟
- [ ] Dark Mode دارد؟
- [ ] Accessible است؟
- [ ] Performance بهینه است؟
- [ ] Modular و reusable است؟
- [ ] TypeScript types دارد؟
- [ ] مستندات دارد؟
- [ ] در مرورگرهای مختلف تست شده؟
- [ ] انیمیشن‌ها معنادار هستند؟
- [ ] محتوا خوانا است؟

## مثال کامل

```tsx
// کامپوننت نمونه با رعایت تمام اصول
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  trend?: 'up' | 'down'
  loading?: boolean
}

export function StatsCard({ 
  title, 
  value, 
  trend,
  loading = false 
}: StatsCardProps) {
  if (loading) {
    return <StatsCardSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-lg dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {value.toLocaleString('fa-IR')}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          {trend && (
            <div className="mt-4">
              <span className={`text-sm ${
                trend === 'up' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend === 'up' ? '↑' : '↓'} 12%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

## نتیجه‌گیری

رعایت این اصول باعث می‌شود:
- تجربه کاربری بهتر
- نگهداری آسان‌تر
- عملکرد بهتر
- دسترسی‌پذیری بیشتر
- توسعه سریع‌تر
