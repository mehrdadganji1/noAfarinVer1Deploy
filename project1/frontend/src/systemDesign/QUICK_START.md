# 🚀 شروع سریع

## نصب و راه‌اندازی

### 1. Import کردن Design Tokens
```typescript
import { colors } from '@/systemDesign/tokens/colors'
```

### 2. استفاده از کامپوننت‌های آماده
```tsx
import { PageHeader, StatsCard } from '@/components/shared'
import { FormPageLayout, FormSection } from '@/components/forms'
```

### 3. فعال‌سازی Dark Mode
```tsx
import { ThemeProvider } from '@/components/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      {/* محتوا */}
    </ThemeProvider>
  )
}
```

## مثال‌های سریع

### صفحه Dashboard
```tsx
import { PageHeader, StatsCard } from '@/components/shared'
import { Users, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="داشبورد"
        description="خوش آمدید"
        icon={Users}
        gradient="from-blue-600, to-purple-600"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

### صفحه فرم
```tsx
import { FormPageLayout, FormSection, FormInput } from '@/components/forms'
import { Users } from 'lucide-react'

export default function CreateUser() {
  return (
    <FormPageLayout
      title="ایجاد کاربر"
      icon={Users}
      gradient="from-blue-600, to-purple-600"
      onSubmit={handleSubmit}
      submitLabel="ذخیره"
    >
      <FormSection title="اطلاعات" icon={Users}>
        <FormInput
          label="نام"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormSection>
    </FormPageLayout>
  )
}
```

### کارت ساده
```tsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    عنوان
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    توضیحات
  </p>
</div>
```

### دکمه
```tsx
<button className="
  px-4 py-2 rounded-lg
  bg-blue-600 hover:bg-blue-700
  dark:bg-blue-500 dark:hover:bg-blue-600
  text-white font-medium
  transition-colors
">
  کلیک کنید
</button>
```

## Tailwind Classes پرکاربرد

### Layout
```
space-y-6          فاصله عمودی
grid grid-cols-3   Grid 3 ستونی
flex items-center  Flexbox
gap-4              فاصله بین آیتم‌ها
```

### Colors
```
bg-white dark:bg-gray-900     پس‌زمینه
text-gray-900 dark:text-white متن
border-gray-200               border
```

### Spacing
```
p-6    padding
m-4    margin
px-4   padding افقی
py-2   padding عمودی
```

### Typography
```
text-xl      اندازه
font-bold    وزن
leading-relaxed  line-height
```

### Effects
```
shadow-lg        سایه
rounded-xl       گوشه گرد
hover:scale-105  hover effect
transition-all   انیمیشن
```

## چک‌لیست توسعه

### قبل از شروع
- [ ] سیستم دیزاین را مطالعه کردم
- [ ] Design Tokens را import کردم
- [ ] ThemeProvider را اضافه کردم

### حین توسعه
- [ ] از کامپوننت‌های آماده استفاده می‌کنم
- [ ] Mobile-First طراحی می‌کنم
- [ ] Dark Mode را پشتیبانی می‌کنم
- [ ] Accessibility را رعایت می‌کنم

### قبل از Commit
- [ ] در موبایل تست کردم
- [ ] در Dark Mode تست کردم
- [ ] کنتراست رنگ‌ها مناسب است
- [ ] TypeScript error ندارد

## لینک‌های مفید

- [اصول طراحی](./01-design-principles.md)
- [سیستم رنگ](./02-color-system.md)
- [تایپوگرافی](./03-typography.md)
- [Dark Mode](./08-dark-mode.md)
- [Best Practices](./10-best-practices.md)

## پشتیبانی

سوالات خود را در تیم مطرح کنید یا به مستندات مراجعه کنید.

---

**نکته:** این سیستم دیزاین زنده است و به‌روزرسانی می‌شود. همیشه آخرین نسخه را چک کنید.
