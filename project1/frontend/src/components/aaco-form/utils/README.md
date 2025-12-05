# AACO Form Validation Utilities

این فایل‌ها validation کامل برای فرم AACO را فراهم می‌کنند و اطمینان می‌دهند که داده‌های ارسالی با backend sync هستند.

## 📁 فایل‌ها

### `validation.ts`
شامل تمام توابع validation و enum values است که با backend مطابقت دارند.

### `__tests__/validation.test.ts`
تست‌های واحد برای اطمینان از صحت validation.

## 🔧 استفاده

### 1. Validation قبل از Submit

```typescript
import { validateFormData } from './utils/validation';

const validation = validateFormData(formData);

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  // نمایش خطاها به کاربر
  return;
}

// ادامه submit
```

### 2. Real-time Validation

```typescript
import { getValidationErrorMessage } from './utils/validation';

const handleFieldChange = (field: string, value: any) => {
  const error = getValidationErrorMessage(field, value);
  if (error) {
    setFieldError(field, error);
  }
};
```

### 3. چک کردن Enum Values

```typescript
import { isValidDegree, isValidTeamSize } from './utils/validation';

if (!isValidDegree(formData.degree)) {
  console.error('Invalid degree value');
}

if (!isValidTeamSize(formData.teamSize)) {
  console.error('Invalid team size value');
}
```

## 📋 Enum Values

### Degree (مقطع تحصیلی)

**مقادیر مجاز:**
- `'diploma'` → دیپلم
- `'associate'` → کاردانی
- `'bachelor'` → کارشناسی
- `'master'` → کارشناسی ارشد
- `'phd'` → دکتری

⚠️ **توجه:** این مقادیر باید دقیقاً با backend model مطابقت داشته باشند.

### Team Size (تعداد اعضای تیم)

**مقادیر مجاز:**
- `'1'` → فقط خودم
- `'2-3'` → 2-3 نفر
- `'4-5'` → 4-5 نفر
- `'6+'` → 6 نفر یا بیشتر

⚠️ **توجه:** این مقادیر string هستند نه number!

## ✅ Validation Rules

### Personal Info (Step 1)
- ✅ firstName: required, non-empty
- ✅ lastName: required, non-empty
- ✅ email: required, valid email format
- ✅ phone: required, Iranian phone format (09xxxxxxxxx)
- ✅ city: required, non-empty

### Educational Background (Step 2)
- ✅ university: required, non-empty
- ✅ major: required, non-empty
- ✅ degree: required, must be one of valid enum values
- ⚪ graduationYear: optional

### Startup Idea & Team (Step 3)
- ✅ startupIdea: required, non-empty
- ✅ businessModel: required, non-empty
- ✅ targetMarket: required, non-empty
- ⚪ teamSize: optional, but if provided must be valid enum value
- ⚪ teamMembers: optional
- ⚪ skills: optional

### Motivation & Goals (Step 4)
- ✅ motivation: required, non-empty
- ✅ goals: required, non-empty
- ⚪ experience: optional
- ⚪ expectations: optional

## 🧪 تست کردن

برای اجرای تست‌ها:

```bash
npm test validation.test.ts
```

## 🔄 Sync با Backend

این validation rules دقیقاً با backend model مطابقت دارند:

**Backend Model:** `project1/services/event-service/src/models/AACOApplication.ts`

اگر backend model تغییر کرد، این فایل‌ها هم باید به‌روزرسانی شوند:
1. `validation.ts` - enum values
2. `form.constants.ts` - dropdown options
3. این README

## 🐛 Debugging

اگر validation error دریافت کردید:

1. **Console را چک کنید:**
   ```
   📤 Submitting AACO Application: { degree: "...", teamSize: "..." }
   ```

2. **مقادیر را با enum values مقایسه کنید:**
   - آیا `degree` یکی از `['diploma', 'associate', 'bachelor', 'master', 'phd']` است؟
   - آیا `teamSize` یکی از `['1', '2-3', '4-5', '6+']` است؟

3. **Backend logs را چک کنید:**
   - در terminal سرویس event-service به دنبال validation errors بگردید

## 📚 مثال‌های کامل

### مثال 1: Validation موفق

```typescript
const formData = {
  firstName: 'علی',
  lastName: 'محمدی',
  email: 'ali@example.com',
  phone: '09123456789',
  city: 'تهران',
  university: 'دانشگاه تهران',
  major: 'مهندسی کامپیوتر',
  degree: 'bachelor', // ✅ Valid enum value
  graduationYear: '1402',
  startupIdea: 'یک ایده استارتاپی',
  businessModel: 'مدل کسب و کار',
  targetMarket: 'بازار هدف',
  teamSize: '2-3', // ✅ Valid enum value
  teamMembers: 'اعضای تیم',
  skills: ['JavaScript', 'React'],
  motivation: 'انگیزه من',
  goals: 'اهداف من',
  experience: 'تجربه من',
  expectations: 'انتظارات من'
};

const validation = validateFormData(formData);
console.log(validation.isValid); // true
```

### مثال 2: Validation ناموفق

```typescript
const formData = {
  // ... other fields
  degree: 'کارشناسی', // ❌ Invalid - Persian text instead of enum
  teamSize: '3', // ❌ Invalid - should be '2-3'
};

const validation = validateFormData(formData);
console.log(validation.isValid); // false
console.log(validation.errors);
// {
//   degree: "مقطع تحصیلی باید یکی از این مقادیر باشد: diploma, associate, bachelor, master, phd",
//   teamSize: "تعداد اعضای تیم باید یکی از این مقادیر باشد: 1, 2-3, 4-5, 6+"
// }
```

## 🎯 نتیجه‌گیری

با استفاده از این validation utilities:
- ✅ خطاها قبل از ارسال به سرور شناسایی می‌شوند
- ✅ تجربه کاربری بهتر می‌شود
- ✅ درخواست‌های اضافی به سرور کاهش می‌یابد
- ✅ پیام‌های خطا واضح و فارسی هستند
- ✅ Sync با backend تضمین می‌شود
