# حل مشکل دو سایدبار همزمان - نسخه نهایی

## مشکل اصلی
وقتی یک متقاضی pending به سیستم وارد می‌شد، **دو sidebar جداگانه** همزمان نمایش داده می‌شدند:
1. **Sidebar تیره** (dark) - از Layout اصلی
2. **Sidebar روشن** (light) - از PendingLayout

## علت ریشه‌ای
مشکل از **دو نسخه مختلف PendingLayout** بود:

1. **نسخه جدید**: `components/pending/layout/PendingLayout.tsx`
   - از Outlet استفاده می‌کرد
   - در App.tsx به عنوان Route element استفاده می‌شد

2. **نسخه قدیمی**: `components/applicant/pending/PendingLayout.tsx`
   - از children استفاده می‌کرد
   - در ApplicantApprovalGuard استفاده می‌شد

### چرا دو sidebar نمایش داده می‌شد؟
```tsx
// در App.tsx
<ApplicantApprovalGuard>
  <PendingLayout />  // نسخه جدید
</ApplicantApprovalGuard>

// در ApplicantApprovalGuard (قدیمی)
return <PendingLayout>{children}</PendingLayout>;  // نسخه قدیمی wrap می‌کرد children رو

// نتیجه:
<PendingLayout قدیمی>
  <PendingLayout جدید />
</PendingLayout قدیمی>
```

## راه حل نهایی

### 1. حذف ApplicantApprovalGuard از مسیر /pending
```tsx
// قبل:
<Route path="/pending" element={
  <ApplicantApprovalGuard>
    <PendingLayout />
  </ApplicantApprovalGuard>
}>

// بعد:
<Route path="/pending" element={
  <PendingLayout />
}>
```

### 2. تغییر ApplicantApprovalGuard به Redirect Guard
به جای wrap کردن children در PendingLayout، حالا فقط redirect می‌کند:
- **Pending applicants**: redirect به `/pending`
- **Approved applicants**: نمایش Layout اصلی

```tsx
// قبل: wrap می‌کرد
return <PendingLayout>{children}</PendingLayout>;

// بعد: redirect می‌کند
useEffect(() => {
  if (!isApproved && !location.pathname.startsWith('/pending')) {
    navigate('/pending', { replace: true });
  }
}, [isApproved, location.pathname, navigate]);
```

### 3. حذف فایل‌های قدیمی
فایل‌های زیر حذف شدند:
- ❌ `components/applicant/pending/PendingLayout.tsx`
- ❌ `components/applicant/pending/PendingSidebar.tsx`
- ❌ `components/applicant/pending/PendingTopBar.tsx`
- ❌ `components/applicant/pending/index.ts`

### 4. اضافه کردن لینک فرم درخواست
در PendingSidebar جدید، لینک "فرم درخواست" اضافه شد:
```tsx
{
  icon: Edit,
  label: 'فرم درخواست',
  path: '/pending/application-form',
  description: 'تکمیل فرم'
}
```

## ساختار نهایی

### مسیرهای Pending (فقط یک PendingLayout)
```
/pending (با PendingLayout)
  ├── / (Dashboard)
  ├── /application-form (فرم درخواست) ✨
  ├── /status (وضعیت درخواست)
  ├── /profile (پروفایل)
  └── /help (راهنما و پشتیبانی)
```

### مسیرهای Applicant (با Layout اصلی)
```
/applicant (با Layout اصلی - فقط برای approved)
  ├── /dashboard
  ├── /profile
  ├── /documents
  ├── /interview
  ├── /messages
  ├── /resources
  └── /help
```

## نتیجه
✅ **فقط یک sidebar** نمایش داده می‌شود
✅ متقاضیان pending فقط **PendingSidebar روشن** را می‌بینند
✅ متقاضیان approved فقط **Sidebar تیره اصلی** را می‌بینند
✅ **جدایی کامل** بین pending و approved routes
✅ **حذف کامل** فایل‌های قدیمی و تکراری
✅ **redirect خودکار** pending applicants به /pending

## تست
برای تست کردن:
1. با یک حساب applicant که هنوز pending است وارد شوید
2. سعی کنید به `/applicant/dashboard` بروید
3. باید خودکار به `/pending` redirect شوید
4. فقط **یک sidebar روشن** باید نمایش داده شود
5. لینک "فرم درخواست" را در sidebar بررسی کنید

## فایل‌های تغییر یافته
### تغییر یافته:
- `project1/frontend/src/App.tsx`
- `project1/frontend/src/components/ApplicantApprovalGuard.tsx`
- `project1/frontend/src/components/pending/layout/PendingSidebar.tsx`

### حذف شده:
- `project1/frontend/src/components/applicant/pending/PendingLayout.tsx`
- `project1/frontend/src/components/applicant/pending/PendingSidebar.tsx`
- `project1/frontend/src/components/applicant/pending/PendingTopBar.tsx`
- `project1/frontend/src/components/applicant/pending/index.ts`
