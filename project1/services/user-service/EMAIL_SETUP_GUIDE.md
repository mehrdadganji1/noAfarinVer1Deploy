# 📧 راهنمای پیکربندی سیستم ایمیل

## 🎯 روش‌های پیکربندی

### روش 1: Gmail SMTP (رایگان - توصیه می‌شود)

#### مرحله 1: فعال‌سازی 2-Step Verification
1. برو به: https://myaccount.google.com/security
2. با حساب `noafarinevent@gmail.com` وارد شو
3. در بخش "Signing in to Google" روی "2-Step Verification" کلیک کن
4. اگر فعال نیست، فعالش کن

#### مرحله 2: ساخت App Password
1. برو به: https://myaccount.google.com/apppasswords
2. روی "Create" کلیک کن
3. اسم بذار: `Noafarin Platform`
4. یک پسورد 16 رقمی بهت میده (مثل: `abcd efgh ijkl mnop`)
5. فضاها رو حذف کن و کپی کن: `abcdefghijklmnop`

#### مرحله 3: پیکربندی خودکار
```bash
cd project1/services/user-service
node setup-gmail.js
```

این اسکریپت:
- App Password رو ازت می‌گیره
- فایل `.env` رو آپدیت می‌کنه
- یک ایمیل تست می‌فرسته
- موفقیت رو تایید می‌کنه

#### مرحله 4: پیکربندی دستی (اختیاری)
اگر اسکریپت کار نکرد، دستی تو `.env` تغییر بده:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noafarinevent@gmail.com
SMTP_PASS=abcdefghijklmnop  # App Password بدون فاصله
SMTP_FROM=noafarinevent@gmail.com
```

---

### روش 2: Resend API (حرفه‌ای - پولی)

Resend یک سرویس ایمیل حرفه‌ای با قابلیت‌های پیشرفته است:
- ✅ Deliverability بالا
- ✅ Analytics و tracking
- ✅ بدون محدودیت Gmail
- ✅ Custom domain support

#### مراحل:
1. برو به: https://resend.com
2. ثبت‌نام کن (100 ایمیل رایگان در روز)
3. API Key بساز
4. تو `.env` تنظیم کن:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_actual_api_key_here
SMTP_FROM=noreply@yourdomain.com
```

---

## 🧪 تست کردن

### تست سریع:
```bash
node test-email.js
```

### تست کامل با ثبت‌نام:
```bash
# Start service
npm run dev

# در ترمینال دیگه:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "تست",
    "lastName": "کاربر",
    "role": "applicant"
  }'
```

---

## 🔍 عیب‌یابی

### خطا: "Invalid login: 535"
**علت:** App Password اشتباه یا منقضی شده

**راه حل:**
1. App Password جدید بساز
2. مطمئن شو 2-Step Verification فعاله
3. فضاها رو از پسورد حذف کن
4. سرویس رو restart کن

### خطا: "Connection timeout"
**علت:** فایروال یا پورت بسته است

**راه حل:**
1. چک کن اینترنت وصله
2. پورت 587 باز باشه
3. VPN رو خاموش کن (اگر داری)

### خطا: "SMTP not configured"
**علت:** متغیرهای محیطی لود نشدن

**راه حل:**
1. مطمئن شو `.env` تو مسیر درست هست
2. سرویس رو restart کن
3. `console.log(process.env.SMTP_USER)` رو چک کن

---

## 📊 مانیتورینگ

### لاگ‌های ایمیل:
```bash
# در کنسول سرویس می‌بینی:
✅ Email service ready (SMTP)
📧 SMTP: smtp.gmail.com:587
👤 User: noafarinevent@gmail.com

# هر ایمیل:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 VERIFICATION EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: user@example.com
Name: کاربر
Verification URL: http://localhost:5173/verify-email?token=...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Email sent via SMTP: <message-id>
```

---

## 🚀 Production Checklist

قبل از production:

- [ ] App Password جدید بساز (نه همون development)
- [ ] `EMAIL_SILENT_FAIL=false` بذار تا خطاها رو ببینی
- [ ] `FRONTEND_URL` رو به دامنه اصلی تغییر بده
- [ ] Custom domain برای ایمیل استفاده کن
- [ ] Rate limiting فعال کن
- [ ] Email templates رو تست کن
- [ ] Spam folder رو چک کن

---

## 💡 نکات مهم

1. **Gmail Limits:** 
   - 500 ایمیل در روز برای حساب‌های رایگان
   - 2000 ایمیل در روز برای Google Workspace

2. **Security:**
   - هیچ‌وقت App Password رو commit نکن
   - از `.env` استفاده کن
   - در production از secrets manager استفاده کن

3. **Deliverability:**
   - SPF و DKIM رو تنظیم کن
   - از custom domain استفاده کن
   - Spam words رو اجتناب کن

---

## 📞 پشتیبانی

اگر مشکلی داشتی:
1. لاگ‌های سرویس رو چک کن
2. `test-email.js` رو اجرا کن
3. Gmail settings رو دوباره چک کن
4. اگر باز هم مشکل داشتی، از Resend استفاده کن
