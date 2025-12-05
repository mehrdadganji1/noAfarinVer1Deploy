# ✅ چک‌لیست Deploy نوآفرین

## قبل از Deploy

### امنیت
- [ ] فایل `.env.production` ایجاد شده و مقادیر واقعی دارد
- [ ] `JWT_SECRET` یک کلید تصادفی قوی است (حداقل 64 کاراکتر)
- [ ] رمز MongoDB تغییر کرده (نه `admin123`)
- [ ] رمز RabbitMQ تغییر کرده
- [ ] فایل `.env.production` در `.gitignore` است
- [ ] SSL Certificate آماده است

### تنظیمات
- [ ] `FRONTEND_URL` به دامنه واقعی تغییر کرده
- [ ] `VITE_API_URL` به آدرس API واقعی تغییر کرده
- [ ] `nginx.production.conf` با دامنه واقعی به‌روز شده
- [ ] پورت‌های غیرضروری بسته شده‌اند

### سرور
- [ ] Docker و Docker Compose نصب است
- [ ] فایروال تنظیم شده (فقط 80, 443 باز)
- [ ] دامنه به IP سرور point شده

## حین Deploy

```bash
# 1. کپی فایل‌ها به سرور
scp -r project1 user@server:/app/

# 2. SSH به سرور
ssh user@server

# 3. رفتن به پوشه پروژه
cd /app/project1

# 4. ایجاد فایل environment
cp .env.production.example .env.production
nano .env.production  # پر کردن مقادیر

# 5. ایجاد پوشه SSL
mkdir -p frontend/ssl
# کپی certificate ها به frontend/ssl/

# 6. Build و اجرا
docker-compose -f docker-compose.production.yml --env-file .env.production build
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```

## بعد از Deploy

### بررسی سلامت
- [ ] `curl https://yourdomain.com/health` پاسخ می‌دهد
- [ ] `curl https://yourdomain.com/api/health` پاسخ می‌دهد
- [ ] صفحه اصلی سایت باز می‌شود
- [ ] لاگین کار می‌کند
- [ ] ثبت‌نام کار می‌کند

### مانیتورینگ
- [ ] لاگ‌ها بررسی شده: `docker-compose logs -f`
- [ ] همه کانتینرها running هستند: `docker-compose ps`

## فایل‌های ایجاد شده برای Production

| فایل | توضیح |
|------|-------|
| `.env.production.example` | نمونه environment variables |
| `docker-compose.production.yml` | Docker Compose برای production |
| `frontend/.env.production` | Environment فرانت‌اند |
| `frontend/Dockerfile.production` | Dockerfile بهینه برای production |
| `frontend/nginx.production.conf` | تنظیمات Nginx با SSL |
| `services/learning-service/Dockerfile` | Dockerfile سرویس learning |
| `services/project-service/Dockerfile` | Dockerfile سرویس project |
| `DEPLOYMENT.md` | راهنمای کامل deploy |

## تغییرات انجام شده

1. ✅ اصلاح fallback URL در `api.ts` (3002 → 3000)
2. ✅ اضافه کردن CORS configuration به api-gateway
3. ✅ اضافه کردن learning-service به docker-compose
4. ✅ اضافه کردن project-service به docker-compose
5. ✅ به‌روزرسانی `.gitignore` برای فایل‌های حساس
6. ✅ ایجاد Dockerfile برای سرویس‌های فاقد آن
7. ✅ اصلاح مسیر فونت‌ها در CSS (fonts.css)
8. ✅ اضافه کردن code-splitting به vite.config.ts
9. ✅ ایجاد Dockerfile برای achievement-service
10. ✅ ایجاد Dockerfile برای application-service
11. ✅ ایجاد Dockerfile برای evaluation-service
12. ✅ رفع dynamic import warning در AACORegistrationBanner
13. ✅ اصلاح authStore برای استفاده از VITE_API_URL در production
14. ✅ اصلاح CORS در application-service برای production

## نکات مهم

⚠️ **هرگز این فایل‌ها را commit نکنید:**
- `.env.production`
- `frontend/ssl/*`
- هر فایل حاوی رمز یا کلید

⚠️ **پورت‌هایی که نباید به اینترنت باز باشند:**
- 27017 (MongoDB)
- 6379 (Redis)
- 5672, 15672 (RabbitMQ)
- 3001-3013 (سرویس‌های داخلی)
