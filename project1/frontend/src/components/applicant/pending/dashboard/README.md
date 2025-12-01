# Pending Dashboard Components

این فولدر شامل کامپوننت‌های داشبورد متقاضیان pending است.

## 📦 کامپوننت‌ها

### 1. ProgressWidget
نمایش پیشرفت درخواست با circular progress و لیست مراحل.

```tsx
import { ProgressWidget } from './dashboard';
<ProgressWidget />
```

### 2. DocumentChecklist
چک‌لیست مدارک مورد نیاز با status tracking.

```tsx
import { DocumentChecklist } from './dashboard';
<DocumentChecklist />
```

### 3. EstimatedTimeline
زمان‌بندی تقریبی مراحل بررسی درخواست.

```tsx
import { EstimatedTimeline } from './dashboard';
<EstimatedTimeline />
```

### 4. TipsGuidelines
نکات و راهنمایی‌های مفید برای متقاضیان.

```tsx
import { TipsGuidelines } from './dashboard';
<TipsGuidelines />
```

### 5. FAQSection
سوالات متداول با accordion style.

```tsx
import { FAQSection } from './dashboard';
<FAQSection />
```

### 6. NextStepsCard
نمایش مراحل بعدی با منطق هوشمند.

```tsx
import { NextStepsCard } from './dashboard';
<NextStepsCard />
```

### 7. ApplicationStrength
ارزیابی قدرت درخواست با نمایش امتیاز.

```tsx
import { ApplicationStrength } from './dashboard';
<ApplicationStrength />
```

## 🔧 Dependencies

همه کامپوننت‌ها به این موارد نیاز دارند:
- `useApplicationStatus` hook
- `useApplicationProgress` hook (برای برخی)
- Framer Motion
- Lucide React icons
- Tailwind CSS

## 📝 نکات

- همه کامپوننت‌ها مستقل هستند
- می‌توانید هر کدام را جداگانه استفاده کنید
- Type-safe با TypeScript
- Responsive design
- RTL support

## 🎨 Customization

برای سفارشی‌سازی، می‌توانید:
- رنگ‌ها را در Tailwind config تغییر دهید
- انیمیشن‌ها را در Framer Motion تنظیم کنید
- محتوای Tips و FAQ را ویرایش کنید

## 📚 مستندات کامل

برای اطلاعات بیشتر، فایل‌های زیر را مطالعه کنید:
- `PENDING_DASHBOARD_ENHANCED.md` - مستندات فنی کامل
- `PENDING_DASHBOARD_DEVELOPMENT_SUMMARY.md` - خلاصه اجرایی
