# سیستم فرم حرفه‌ای

یک سیستم کامپوننت ماژولار و حرفه‌ای برای ساخت فرم‌های زیبا و کاربردی.

## کامپوننت‌ها

### FormPageLayout
لایه اصلی صفحه فرم با هدر گرادیانت و action bar چسبان

```tsx
<FormPageLayout
  title="ایجاد تیم جدید"
  description="اطلاعات تیم را وارد کنید"
  icon={Users}
  gradient="from-orange-600, via-red-600, to-pink-600"
  onBack={() => navigate('/teams')}
  onCancel={() => navigate('/teams')}
  onSubmit={handleSubmit}
  submitLabel="ایجاد تیم"
  isSubmitting={false}
>
  {/* محتوای فرم */}
</FormPageLayout>
```

### FormSection
بخش‌های فرم با انیمیشن و آیکون

```tsx
<FormSection 
  title="اطلاعات تیم" 
  icon={Users} 
  iconColor="from-orange-500 to-pink-500"
  delay={1}
>
  {/* فیلدهای فرم */}
</FormSection>
```

### FormInput
فیلد ورودی با لیبل و hint

```tsx
<FormInput
  label="نام تیم"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="نام تیم"
  required
  hint="نام منحصر به فرد انتخاب کنید"
/>
```

### FormTextarea
فیلد متن چند خطی با شمارنده کاراکتر

```tsx
<FormTextarea
  label="توضیحات"
  name="description"
  value={formData.description}
  onChange={handleChange}
  rows={4}
  maxLength={1000}
  showCount
  required
/>
```

### FormSelect
فیلد انتخابی

```tsx
<FormSelect
  label="نوع رویداد"
  name="type"
  value={formData.type}
  onChange={(value) => handleSelectChange('type', value)}
  options={[
    { value: 'workshop', label: 'کارگاه' },
    { value: 'seminar', label: 'سمینار' },
  ]}
  required
/>
```

### FormSwitch
سوئیچ با آیکون

```tsx
<FormSwitch
  label="رویداد آنلاین"
  name="isOnline"
  checked={formData.isOnline}
  onChange={(checked) => setFormData(prev => ({ ...prev, isOnline: checked }))}
  icon={Video}
/>
```

### FormFieldGroup
گروه‌بندی فیلدها در دو ستون

```tsx
<FormFieldGroup>
  <FormInput label="تاریخ شروع" ... />
  <FormInput label="تاریخ پایان" ... />
</FormFieldGroup>
```

### InfoCard
کارت اطلاعاتی با انیمیشن

```tsx
<InfoCard
  title="نکات مهم"
  variant="info" // info | warning | success | error
  items={[
    'فیلدهای دارای * الزامی هستند',
    'توضیحات کامل بنویسید',
  ]}
/>
```

## ویژگی‌ها

✨ **طراحی مدرن**: گرادیانت‌های زیبا، سایه‌های نرم، انیمیشن‌های روان
🎨 **سیستم رنگ**: پالت رنگی حرفه‌ای برای هر نوع فرم
📱 **ریسپانسیو**: کاملاً سازگار با موبایل و تبلت
♿ **دسترسی‌پذیر**: پشتیبانی کامل از accessibility
🚀 **عملکرد بالا**: بهینه‌سازی شده با React.memo و lazy loading
🎭 **انیمیشن**: انیمیشن‌های روان با Framer Motion

## مثال کامل

```tsx
import { FormPageLayout, FormSection, FormInput, FormTextarea, InfoCard } from '@/components/forms'

export default function CreateTeam() {
  const [formData, setFormData] = useState({ name: '', description: '' })
  
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    // ارسال فرم
  }
  
  return (
    <FormPageLayout
      title="ایجاد تیم"
      description="اطلاعات تیم را وارد کنید"
      icon={Users}
      gradient="from-orange-600, via-red-600, to-pink-600"
      onBack={() => navigate('/teams')}
      onCancel={() => navigate('/teams')}
      onSubmit={handleSubmit}
      submitLabel="ایجاد"
    >
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSection title="اطلاعات" icon={Users} delay={1}>
          <FormInput label="نام" name="name" value={formData.name} onChange={handleChange} required />
          <FormTextarea label="توضیحات" name="description" value={formData.description} onChange={handleChange} />
          <InfoCard variant="info" items={['نکته 1', 'نکته 2']} />
        </FormSection>
      </form>
    </FormPageLayout>
  )
}
```

## نکات طراحی

- از گرادیانت‌های مناسب برای هر نوع فرم استفاده کنید
- delay را برای انیمیشن‌های پیاپی تنظیم کنید
- از InfoCard برای راهنمایی کاربر استفاده کنید
- فیلدهای مرتبط را در FormFieldGroup قرار دهید
