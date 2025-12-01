# پیاده‌سازی همگام‌سازی وضعیت درخواست AACO

## خلاصه
این سند توضیح می‌دهد که چگونه سیستم همگام‌سازی real-time برای وضعیت درخواست AACO پیاده‌سازی شده است.

## مشکل
وقتی کاربر فرم AACO را در صفحه `/pending/application-form` ثبت می‌کرد، وضعیت درخواست در صفحات دیگر (`/pending` و `/pending/status`) به‌روزرسانی نمی‌شد.

## راه‌حل

### 1. Backend (قبلاً پیاده‌سازی شده بود)
- Controller در `aacoApplicationController.ts` به درستی status را به `SUBMITTED` تنظیم می‌کند
- هنگام ایجاد application جدید: `status: AACOApplicationStatus.SUBMITTED`
- هنگام ویرایش application که قبلاً APPROVED بوده: status به SUBMITTED برمی‌گردد

### 2. Frontend Hook (قبلاً پیاده‌سازی شده بود)
Hook `useAACOApplicationStatus` در `project1/frontend/src/hooks/useAACOApplicationStatus.ts`:
- از localStorage برای trigger کردن refetch استفاده می‌کند
- هر 500ms چک می‌کند که آیا flag `aaco_application_updated` set شده
- به event های `storage` و `aaco_application_updated` گوش می‌دهد

### 3. Form Submission (قبلاً پیاده‌سازی شده بود)
Hook `useAACOForm` در `project1/frontend/src/components/aaco-form/hooks/useAACOForm.ts`:
- بعد از submit موفق، localStorage flag را set می‌کند:
  ```typescript
  localStorage.setItem('aaco_application_updated', Date.now().toString());
  ```

### 4. تغییرات جدید (این PR)

#### 4.1. پشتیبانی از AACO Status در Constants
فایل: `project1/frontend/src/components/pending/dashboard/constants.ts`
- اضافه شدن status های AACO: `under-review`, `approved`
- mapping status های AACO به UI configuration

#### 4.2. به‌روزرسانی Types
فایل: `project1/frontend/src/components/pending/dashboard/types.ts`
- اضافه شدن `under-review` و `approved` به type `ApplicationStatus`

#### 4.3. به‌روزرسانی Dashboard
فایل: `project1/frontend/src/pages/pending/Dashboard.tsx`
- استفاده از `useAACOApplicationStatus` hook
- اولویت دادن به AACO application status اگر وجود داشته باشد:
  ```typescript
  const { application: aacoApplication, status: aacoStatus } = useAACOApplicationStatus();
  const status = (aacoStatus || applicationData?.status || 'submitted');
  ```

#### 4.4. به‌روزرسانی ApplicationStatus Page
فایل: `project1/frontend/src/pages/ApplicationStatus.tsx`
- استفاده از `useAACOApplicationStatus` hook
- نمایش AACO application اگر وجود داشته باشد
- UI کامل برای نمایش جزئیات AACO application
- پشتیبانی از status های: `submitted`, `under-review`, `approved`, `rejected`

## جریان کار (Flow)

### هنگام Submit کردن فرم AACO:
1. کاربر فرم را در `/pending/application-form` تکمیل و submit می‌کند
2. `useAACOForm.handleSubmit()` درخواست را به backend ارسال می‌کند
3. Backend application را با status `SUBMITTED` ذخیره می‌کند
4. Frontend localStorage flag را set می‌کند: `aaco_application_updated`
5. `useAACOApplicationStatus` در صفحات دیگر این flag را detect می‌کند
6. Hook به صورت خودکار application جدید را fetch می‌کند
7. UI در همه صفحات به‌روزرسانی می‌شود

### صفحات تحت تأثیر:
- ✅ `/pending` - Dashboard اصلی (StatusCard و Timeline)
- ✅ `/pending/status` - صفحه جزئیات وضعیت
- ✅ `/pending/application-form` - فرم خود (برای edit mode)

## Status Mapping

### AACO Application Statuses:
- `draft` → "پیش‌نویس"
- `submitted` → "درخواست ارسال شده" (آبی، با pulse)
- `under-review` → "در حال بررسی" (بنفش، با pulse)
- `approved` → "تایید شده" (سبز)
- `rejected` → "رد شده" (قرمز)

## تست

### برای تست کردن:
1. وارد صفحه `/pending` شوید
2. روی "فرم درخواست AACo" کلیک کنید
3. فرم را تکمیل و submit کنید
4. به صفحه `/pending` برگردید
5. باید status به "درخواست ارسال شده" تغییر کرده باشد
6. به صفحه `/pending/status` بروید
7. باید جزئیات کامل AACO application نمایش داده شود

## فایل‌های تغییر یافته
1. `project1/frontend/src/components/pending/dashboard/constants.ts`
2. `project1/frontend/src/components/pending/dashboard/types.ts`
3. `project1/frontend/src/pages/pending/Dashboard.tsx`
4. `project1/frontend/src/pages/ApplicationStatus.tsx`

## نکات فنی
- از localStorage برای cross-tab communication استفاده شده
- Polling interval: 500ms
- Flag expiry: 2 seconds
- Real-time updates بدون نیاز به refresh صفحه
- پشتیبانی از هر دو نوع application (معمولی و AACO)
