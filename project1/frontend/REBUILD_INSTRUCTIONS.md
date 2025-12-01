# دستورالعمل بازسازی پروژه

## مشکل: تغییرات در مرورگر نمایش داده نمی‌شود

اگر بعد از اعمال تغییرات، صفحه قدیمی را می‌بینید، این مراحل را دنبال کنید:

### راه‌حل 1: پاک کردن کش و Restart سرور (توصیه می‌شود)

```bash
# 1. توقف سرور فعلی (Ctrl+C)

# 2. پاک کردن node_modules و cache
cd project1/frontend
rmdir /s /q node_modules
rmdir /s /q dist
rmdir /s /q .vite

# 3. نصب مجدد dependencies
npm install

# 4. اجرای مجدد سرور
npm run dev
```

### راه‌حل 2: Hard Refresh در مرورگر

1. باز کردن صفحه در مرورگر
2. فشار دادن `Ctrl + Shift + R` (Windows) یا `Cmd + Shift + R` (Mac)
3. یا باز کردن DevTools (F12) و کلیک راست روی دکمه Refresh و انتخاب "Empty Cache and Hard Reload"

### راه‌حل 3: پاک کردن کش مرورگر

1. باز کردن DevTools (F12)
2. رفتن به تب Application
3. در سمت چپ، انتخاب "Clear storage"
4. کلیک روی "Clear site data"
5. Refresh صفحه

### راه‌حل 4: استفاده از Incognito/Private Mode

باز کردن صفحه در حالت Incognito برای اطمینان از عدم استفاده از کش

---

## تغییرات اعمال شده

صفحه فرم AACO به صورت کامل با معماری ماژولار بازطراحی شد:

### ساختار جدید:
```
components/aaco-form/
├── hooks/
│   ├── useAACOForm.ts
│   └── useFormValidation.ts
├── steps/
│   ├── PersonalInfoStep.tsx
│   ├── EducationStep.tsx
│   ├── IdeaTeamStep.tsx
│   └── MotivationStep.tsx
├── shared/
│   ├── FormHeader.tsx
│   ├── EditModeBadge.tsx
│   ├── StatusIndicator.tsx
│   ├── StepNavigation.tsx
│   └── SkillSelector.tsx
├── types/form.types.ts
├── constants/form.constants.ts
└── index.ts
```

### مزایا:
- کد از 600+ خط به 150 خط کاهش یافت
- هر کامپوننت مستقل و قابل استفاده مجدد
- نگهداری و تست آسان‌تر
- خوانایی بالاتر
