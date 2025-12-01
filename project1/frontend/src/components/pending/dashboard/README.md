# Pending Dashboard Components

این پکیج شامل کامپوننت‌های ماژولار و قابل استفاده مجدد برای داشبورد متقاضیان در حالت Pending است.

## ساختار

```
dashboard/
├── index.ts                 # Export مرکزی
├── types.ts                 # Type definitions
├── constants.ts             # تنظیمات و داده‌های ثابت
├── WelcomeHero.tsx         # کامپوننت خوشامدگویی
├── StatusCard.tsx          # کارت وضعیت درخواست
├── Timeline.tsx            # نمایش مراحل پیشرفت
├── QuickActions.tsx        # دکمه‌های دسترسی سریع
├── InfoCards.tsx           # کارت‌های اطلاعاتی
└── ContactCard.tsx         # کارت تماس با پشتیبانی
```

## اصول طراحی

### 1. Clean Code
- نام‌گذاری واضح و معنادار
- تابع‌ها و کامپوننت‌های کوچک با مسئولیت واحد
- جداسازی منطق از UI

### 2. Modular Architecture
- هر کامپوننت مستقل و قابل استفاده مجدد
- Props واضح و type-safe
- جداسازی constants و types

### 3. Type Safety
- استفاده کامل از TypeScript
- Interface‌های واضح برای props
- Type definitions مرکزی

### 4. Performance
- استفاده از React.memo در صورت نیاز
- Lazy loading برای کامپوننت‌های سنگین
- Optimized animations

## استفاده

### Import کامپوننت‌ها

```tsx
import {
  WelcomeHero,
  StatusCard,
  Timeline,
  QuickActions,
  InfoCards,
  ContactCard
} from '@/components/pending/dashboard';
```

### مثال استفاده

```tsx
export default function PendingDashboard() {
  const { user } = useAuthStore();
  const { data } = useApplicationStatus();

  return (
    <div className="space-y-6">
      <WelcomeHero firstName={user?.firstName} />
      <StatusCard status={data?.status} trackingId={data?.id} />
      <Timeline currentStatus={data?.status} />
      <QuickActions />
      <InfoCards />
      <ContactCard />
    </div>
  );
}
```

## کامپوننت‌ها

### WelcomeHero
نمایش پیام خوشامدگویی با gradient background

**Props:**
- `firstName?: string` - نام کاربر
- `delay?: number` - تاخیر animation

### StatusCard
نمایش وضعیت فعلی درخواست با badge و شماره پیگیری

**Props:**
- `status: ApplicationStatus` - وضعیت فعلی
- `trackingId?: string` - شماره پیگیری
- `delay?: number` - تاخیر animation

### Timeline
نمایش مراحل پیشرفت درخواست

**Props:**
- `currentStatus: ApplicationStatus` - وضعیت فعلی

### QuickActions
گرید دکمه‌های دسترسی سریع

**Props:**
- `delay?: number` - تاخیر animation

### InfoCards
کارت‌های اطلاعاتی درباره فرآیند

**Props:**
- `delay?: number` - تاخیر animation

### ContactCard
اطلاعات تماس با پشتیبانی

**Props:**
- `delay?: number` - تاخیر animation

## تنظیمات

تمام تنظیمات در فایل `constants.ts` قرار دارند:

- `STATUS_CONFIG` - پیکربندی وضعیت‌ها
- `TIMELINE_STEPS` - مراحل timeline
- `QUICK_ACTIONS` - اکشن‌های سریع
- `INFO_CARDS` - کارت‌های اطلاعاتی
- `CONTACT_INFO` - اطلاعات تماس
- `ANIMATION_VARIANTS` - تنظیمات animation

## توسعه

### اضافه کردن وضعیت جدید

```typescript
// در constants.ts
export const STATUS_CONFIG: Record<ApplicationStatus, StatusInfo> = {
  // ...
  new_status: {
    text: 'متن جدید',
    color: 'bg-color-100 text-color-800',
    icon: IconComponent,
    description: 'توضیحات',
    pulse: true
  }
};
```

### اضافه کردن Quick Action جدید

```typescript
// در constants.ts
export const QUICK_ACTIONS: QuickAction[] = [
  // ...
  {
    id: 'new-action',
    title: 'عنوان',
    description: 'توضیحات',
    icon: IconComponent,
    path: '/path',
    color: 'from-color-500 to-color-600'
  }
];
```

## Best Practices

1. **همیشه از types استفاده کنید**
2. **constants را مرکزی نگه دارید**
3. **کامپوننت‌ها را کوچک و focused نگه دارید**
4. **از memo برای کامپوننت‌های پرتکرار استفاده کنید**
5. **animations را smooth و معنادار نگه دارید**

## مشارکت

برای اضافه کردن کامپوننت جدید:
1. کامپوننت را در فایل جداگانه بسازید
2. Types مربوطه را به `types.ts` اضافه کنید
3. Constants را به `constants.ts` اضافه کنید
4. Export را به `index.ts` اضافه کنید
5. مستندات را به‌روز کنید
