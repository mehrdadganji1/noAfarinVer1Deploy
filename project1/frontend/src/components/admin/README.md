# Admin Dashboard Design System

سیستم طراحی حرفه‌ای برای داشبورد مدیریت

## ساختار پوشه‌ها

```
admin/
├── dashboard/
│   ├── base/           # کامپوننت‌های پایه
│   ├── widgets/        # ویجت‌های داشبورد
│   └── constants/      # ثابت‌ها و تنظیمات
├── shared/             # کامپوننت‌های مشترک
├── aaco-applications/  # کامپوننت‌های AACO
└── index.ts           # Export اصلی
```

## استفاده

```tsx
// Import کامپوننت‌های پایه
import { DashboardHeader, MetricCard, ChartCard } from '@/components/admin/dashboard/base'

// Import ویجت‌ها
import { MetricsGrid, ActivityFeed, QuickActions } from '@/components/admin/dashboard/widgets'

// Import کامپوننت‌های مشترک
import { PageHeader, DataTable, StatusBadge } from '@/components/admin/shared'

// یا همه با هم
import { DashboardHeader, MetricsGrid, PageHeader } from '@/components/admin'
```

## کامپوننت‌های پایه (Base)

### DashboardCard
کارت پایه با انیمیشن و استایل‌های مختلف

```tsx
<DashboardCard variant="elevated" gradient="from-blue-500 to-cyan-500">
  محتوا
</DashboardCard>
```

### MetricCard
کارت نمایش آمار با آیکون و تغییرات

```tsx
<MetricCard
  title="کل کاربران"
  value={1234}
  icon={Users}
  theme="users"
  change={12}
/>
```

### ChartCard
کارت نمودار با هدر و اکشن‌ها

```tsx
<ChartCard
  title="فعالیت کاربران"
  icon={Activity}
  headerGradient="from-blue-50 to-cyan-50"
>
  {/* نمودار */}
</ChartCard>
```

### DashboardHeader
هدر صفحه داشبورد

```tsx
<DashboardHeader
  title="داشبورد مدیر"
  subtitle="مدیریت سیستم"
  icon={Shield}
  badge="مدیر"
  onRefresh={refetch}
/>
```

## ویجت‌ها (Widgets)

### MetricsGrid
گرید آمار اصلی

```tsx
<MetricsGrid stats={stats} isLoading={isLoading} />
```

### ActivityFeed
فید فعالیت‌های اخیر

```tsx
<ActivityFeed activities={activities} delay={0.5} />
```

### QuickActions
پنل دسترسی سریع

```tsx
<QuickActions delay={0.3} />
```

## کامپوننت‌های مشترک (Shared)

### PageHeader
هدر صفحات لیست

```tsx
<PageHeader
  title="مدیریت کاربران"
  icon={Users}
  onAdd={() => navigate('/create')}
  onSearchChange={setSearch}
/>
```

### DataTable
جدول داده با pagination

```tsx
<DataTable
  columns={columns}
  data={users}
  onRowClick={handleClick}
  pagination={{ page, pageSize, total, onPageChange }}
/>
```

### StatusBadge
نشان وضعیت

```tsx
<StatusBadge status="active" />
<StatusBadge status="pending" variant="dot" />
```

### EmptyState
حالت خالی

```tsx
<EmptyState
  title="داده‌ای یافت نشد"
  description="هنوز موردی ثبت نشده"
  actionLabel="افزودن"
  onAction={handleAdd}
/>
```

### ConfirmDialog
دیالوگ تایید

```tsx
<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleDelete}
  title="حذف کاربر"
  variant="danger"
/>
```

## تم‌ها و رنگ‌ها

```tsx
import { METRIC_THEMES, GRADIENTS, COLORS } from '@/components/admin/dashboard/constants'

// تم‌های متریک
METRIC_THEMES.users    // آبی
METRIC_THEMES.success  // سبز
METRIC_THEMES.members  // بنفش

// گرادیان‌ها
GRADIENTS.primary  // آبی به بنفش
GRADIENTS.success  // سبز
GRADIENTS.sunset   // نارنجی به صورتی
```

## انیمیشن‌ها

```tsx
import { ANIMATION_VARIANTS, TRANSITIONS } from '@/components/admin/dashboard/constants'

<motion.div
  variants={ANIMATION_VARIANTS.slideUp}
  initial="initial"
  animate="animate"
  transition={TRANSITIONS.normal}
>
```
