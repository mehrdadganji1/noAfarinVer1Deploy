# ✍️ تایپوگرافی

## فلسفه تایپوگرافی

تایپوگرافی نوآفرین بر پایه **خوانایی، سلسله‌مراتب و زیبایی** طراحی شده است.

## فونت‌های اصلی

### فونت فارسی
```css
font-family: 'Vazirmatn', 'Tahoma', sans-serif;
```

**ویژگی‌ها:**
- خوانایی عالی در اندازه‌های مختلف
- پشتیبانی کامل از زبان فارسی
- وزن‌های متنوع (100-900)
- Variable font برای عملکرد بهتر

### فونت انگلیسی
```css
font-family: 'Inter', 'Segoe UI', sans-serif;
```

**ویژگی‌ها:**
- طراحی مدرن و حرفه‌ای
- خوانایی عالی در صفحه نمایش
- پشتیبانی از OpenType features

## مقیاس تایپوگرافی

### Type Scale (1.250 - Major Third)
```typescript
fontSize: {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
}
```

## وزن فونت

```typescript
fontWeight: {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,      // پیش‌فرض
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}
```

## ارتفاع خط (Line Height)

```typescript
lineHeight: {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,      // پیش‌فرض
  relaxed: 1.625,
  loose: 2,
}
```

## فاصله حروف (Letter Spacing)

```typescript
letterSpacing: {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',      // پیش‌فرض
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}
```

## سلسله‌مراتب متن

### Headings (عناوین)

```tsx
// H1 - عنوان اصلی صفحه
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
  عنوان اصلی
</h1>

// H2 - عنوان بخش
<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
  عنوان بخش
</h2>

// H3 - عنوان زیربخش
<h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
  عنوان زیربخش
</h3>

// H4 - عنوان کارت
<h4 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
  عنوان کارت
</h4>

// H5 - عنوان کوچک
<h5 className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
  عنوان کوچک
</h5>

// H6 - عنوان خیلی کوچک
<h6 className="text-base md:text-lg font-medium text-gray-900 dark:text-white">
  عنوان خیلی کوچک
</h6>
```

### Body Text (متن بدنه)

```tsx
// Large Body
<p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
  متن بزرگ برای مقدمه و توضیحات مهم
</p>

// Normal Body
<p className="text-base text-gray-600 dark:text-gray-400 leading-normal">
  متن معمولی برای محتوای اصلی
</p>

// Small Body
<p className="text-sm text-gray-500 dark:text-gray-500 leading-normal">
  متن کوچک برای توضیحات ثانویه
</p>

// Extra Small
<p className="text-xs text-gray-400 dark:text-gray-600">
  متن خیلی کوچک برای metadata
</p>
```

### Special Text

```tsx
// Lead Text (متن مقدمه)
<p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
  متن مقدمه با فونت سبک‌تر
</p>

// Quote (نقل قول)
<blockquote className="text-lg italic text-gray-600 dark:text-gray-400 border-r-4 border-blue-500 pr-4">
  "این یک نقل قول است"
</blockquote>

// Code (کد)
<code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
  const example = true
</code>

// Link (لینک)
<a className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
  لینک
</a>
```

## استایل‌های متن

### Bold & Emphasis
```tsx
<strong className="font-bold">متن پررنگ</strong>
<em className="italic">متن کج</em>
<span className="underline">متن زیرخط‌دار</span>
<span className="line-through">متن خط‌خورده</span>
```

### Text Colors
```tsx
// Primary Text
<span className="text-gray-900 dark:text-white">
  متن اصلی
</span>

// Secondary Text
<span className="text-gray-600 dark:text-gray-400">
  متن ثانویه
</span>

// Muted Text
<span className="text-gray-400 dark:text-gray-600">
  متن کم‌رنگ
</span>

// Colored Text
<span className="text-blue-600 dark:text-blue-400">
  متن رنگی
</span>
```

## Responsive Typography

### Mobile First
```tsx
<h1 className="
  text-2xl      /* موبایل: 24px */
  sm:text-3xl   /* موبایل بزرگ: 30px */
  md:text-4xl   /* تبلت: 36px */
  lg:text-5xl   /* دسکتاپ: 48px */
  font-bold
">
  عنوان ریسپانسیو
</h1>
```

### Fluid Typography
```css
/* استفاده از clamp برای اندازه روان */
.fluid-text {
  font-size: clamp(1rem, 2vw + 0.5rem, 2rem);
}
```

## RTL Support

### Text Direction
```tsx
<div dir="rtl" className="text-right">
  متن فارسی
</div>

<div dir="ltr" className="text-left">
  English Text
</div>
```

### Mixed Content
```tsx
<p className="text-right" dir="rtl">
  این متن فارسی است و شامل 
  <span dir="ltr" className="inline-block">English words</span>
  نیز می‌شود.
</p>
```

## Design Tokens

### typography.ts
```typescript
export const typography = {
  fontFamily: {
    sans: ['Vazirmatn', 'Inter', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const
```

## بهترین شیوه‌ها

### 1. سلسله‌مراتب واضح
```tsx
// ✅ درست
<div>
  <h1 className="text-4xl font-bold mb-4">عنوان اصلی</h1>
  <p className="text-lg text-gray-600 mb-6">توضیحات</p>
  <p className="text-base text-gray-500">جزئیات</p>
</div>

// ❌ اشتباه
<div>
  <h1 className="text-2xl">عنوان اصلی</h1>
  <p className="text-2xl">توضیحات</p>
  <p className="text-2xl">جزئیات</p>
</div>
```

### 2. خوانایی
```tsx
// ✅ درست - Line height مناسب
<p className="text-base leading-relaxed">
  متن طولانی با فاصله خط مناسب که خواندن آن راحت است
</p>

// ❌ اشتباه - Line height کم
<p className="text-base leading-none">
  متن طولانی با فاصله خط کم که خواندن آن سخت است
</p>
```

### 3. کنتراست
```tsx
// ✅ درست
<p className="text-gray-900 dark:text-white">
  متن با کنتراست خوب
</p>

// ❌ اشتباه
<p className="text-gray-400 dark:text-gray-600">
  متن با کنتراست ضعیف
</p>
```

### 4. طول خط
```tsx
// ✅ درست - حداکثر 65-75 کاراکتر
<p className="max-w-prose">
  متن با طول مناسب برای خوانایی بهتر
</p>

// ❌ اشتباه - خیلی طولانی
<p className="w-full">
  متن خیلی طولانی که خواندن آن سخت است
</p>
```

## مثال‌های کاربردی

### Article Header
```tsx
<header className="space-y-4">
  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
    عنوان مقاله
  </h1>
  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
    خلاصه مقاله با فونت بزرگ‌تر
  </p>
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <span>نویسنده: علی احمدی</span>
    <span>•</span>
    <span>5 دقیقه مطالعه</span>
  </div>
</header>
```

### Card Title
```tsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    عنوان کارت
  </h3>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    توضیحات کارت
  </p>
</div>
```

### Form Label
```tsx
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  نام کاربری
  <span className="text-red-500">*</span>
</label>
```

## چک‌لیست تایپوگرافی

- [ ] سلسله‌مراتب واضح است
- [ ] Line height مناسب است (1.5-1.625)
- [ ] کنتراست حداقل 4.5:1
- [ ] طول خط مناسب است (65-75 کاراکتر)
- [ ] فونت در اندازه‌های مختلف خوانا است
- [ ] RTL به درستی کار می‌کند
- [ ] Responsive است
- [ ] Dark Mode پشتیبانی می‌شود

## ابزارهای مفید

- [Type Scale](https://type-scale.com) - محاسبه مقیاس
- [Modular Scale](https://www.modularscale.com) - مقیاس ماژولار
- [Google Fonts](https://fonts.google.com) - فونت‌های رایگان
- [Font Pair](https://fontpair.co) - ترکیب فونت‌ها
