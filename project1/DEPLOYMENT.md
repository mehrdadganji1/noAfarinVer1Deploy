# راهنمای Deploy پروژه نوآفرین

## پیش‌نیازها

- Docker و Docker Compose نصب شده باشد
- دامنه و SSL Certificate آماده باشد
- سرور با حداقل 4GB RAM و 2 CPU

## مراحل Deploy

### 1. آماده‌سازی Environment Variables

```bash
# کپی فایل نمونه
cp .env.production.example .env.production

# ویرایش فایل و پر کردن مقادیر واقعی
nano .env.production
```

**مقادیر مهم که باید تغییر کنند:**

| متغیر | توضیح |
|-------|-------|
| `MONGO_INITDB_ROOT_USERNAME` | نام کاربری MongoDB (نه admin!) |
| `MONGO_INITDB_ROOT_PASSWORD` | رمز قوی برای MongoDB |
| `JWT_SECRET` | کلید امن JWT (حداقل 64 کاراکتر) |
| `RABBITMQ_DEFAULT_USER` | نام کاربری RabbitMQ |
| `RABBITMQ_DEFAULT_PASS` | رمز RabbitMQ |
| `FRONTEND_URL` | آدرس دامنه شما |
| `VITE_API_URL` | آدرس API Gateway |

### 2. تولید JWT Secret امن

```bash
openssl rand -base64 64
```

### 3. تنظیم SSL Certificate

فایل‌های SSL را در مسیر زیر قرار دهید:
```
project1/frontend/ssl/
├── fullchain.pem
└── privkey.pem
```

### 4. ویرایش nginx.production.conf

```bash
# جایگزینی yourdomain.com با دامنه واقعی
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' frontend/nginx.production.conf
```

### 5. Build و اجرا

```bash
# Build همه سرویس‌ها
docker-compose -f docker-compose.production.yml --env-file .env.production build

# اجرا در پس‌زمینه
docker-compose -f docker-compose.production.yml --env-file .env.production up -d

# مشاهده لاگ‌ها
docker-compose -f docker-compose.production.yml logs -f
```

### 6. بررسی سلامت سرویس‌ها

```bash
# بررسی وضعیت کانتینرها
docker-compose -f docker-compose.production.yml ps

# بررسی health endpoint
curl https://yourdomain.com/api/health
```

## نکات امنیتی مهم

### ❌ هرگز این کارها را نکنید:
- فایل `.env.production` را commit نکنید
- از رمزهای پیش‌فرض استفاده نکنید
- پورت‌های داخلی (MongoDB, Redis, RabbitMQ) را به اینترنت باز نکنید

### ✅ این کارها را انجام دهید:
- از رمزهای قوی و تصادفی استفاده کنید
- SSL/TLS را فعال کنید
- فایروال را تنظیم کنید
- Backup منظم از دیتابیس بگیرید

## پورت‌های سرویس‌ها

| سرویس | پورت داخلی | توضیح |
|-------|------------|-------|
| Frontend | 80, 443 | Nginx |
| API Gateway | 3000 | نقطه ورود API |
| User Service | 3001 | احراز هویت و کاربران |
| Team Service | 3002 | مدیریت تیم‌ها |
| Event Service | 3003 | رویدادها |
| Evaluation Service | 3004 | ارزیابی |
| Training Service | 3005 | آموزش |
| Funding Service | 3006 | تامین مالی |
| File Service | 3007 | آپلود فایل |
| Application Service | 3008 | درخواست‌ها |
| Project Service | 3010 | پروژه‌ها |
| XP Service | 3011 | امتیازات |
| Achievement Service | 3012 | دستاوردها |
| Learning Service | 3013 | منابع آموزشی |
| MongoDB | 27017 | دیتابیس |
| Redis | 6379 | کش |
| RabbitMQ | 5672, 15672 | صف پیام |

## عیب‌یابی

### سرویس بالا نمی‌آید
```bash
# مشاهده لاگ سرویس خاص
docker-compose -f docker-compose.production.yml logs user-service

# ری‌استارت سرویس
docker-compose -f docker-compose.production.yml restart user-service
```

### مشکل اتصال به دیتابیس
```bash
# بررسی وضعیت MongoDB
docker exec -it noafarin-mongodb mongosh -u admin -p

# بررسی شبکه
docker network inspect noafarin-network
```

### مشکل CORS
- مطمئن شوید `FRONTEND_URL` در `.env.production` درست است
- API Gateway را ری‌استارت کنید

## Backup

### Backup دیتابیس
```bash
docker exec noafarin-mongodb mongodump --out /backup --username $MONGO_USER --password $MONGO_PASS
docker cp noafarin-mongodb:/backup ./backup-$(date +%Y%m%d)
```

### Restore دیتابیس
```bash
docker cp ./backup noafarin-mongodb:/backup
docker exec noafarin-mongodb mongorestore /backup --username $MONGO_USER --password $MONGO_PASS
```

## به‌روزرسانی

```bash
# Pull آخرین تغییرات
git pull origin main

# Rebuild و restart
docker-compose -f docker-compose.production.yml --env-file .env.production build
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```


## توصیه‌های بهینه‌سازی Production

### کاهش Logging
در حال حاضر api-gateway لاگ‌های زیادی تولید می‌کند. برای production توصیه می‌شود:

1. **استفاده از LOG_LEVEL:**
   ```bash
   # در .env.production اضافه کنید:
   LOG_LEVEL=error
   ```

2. **یا غیرفعال کردن debug logs:**
   در فایل `services/api-gateway/src/index.ts` می‌توانید console.log ها را با شرط زیر محدود کنید:
   ```typescript
   if (process.env.NODE_ENV !== 'production') {
     console.log('...');
   }
   ```

### بهینه‌سازی MongoDB
```bash
# ایجاد index برای query های پرکاربرد
docker exec -it noafarin-mongodb mongosh -u $MONGO_USER -p $MONGO_PASS --eval "
  use noafarin;
  db.users.createIndex({ email: 1 });
  db.users.createIndex({ role: 1 });
  db.applications.createIndex({ userId: 1 });
  db.applications.createIndex({ status: 1 });
"
```

### مانیتورینگ
توصیه می‌شود از ابزارهای زیر استفاده کنید:
- **Prometheus + Grafana** برای metrics
- **ELK Stack** برای log management
- **Uptime Robot** برای monitoring

### Scaling
برای scale کردن سرویس‌ها:
```bash
docker-compose -f docker-compose.production.yml --env-file .env.production up -d --scale user-service=3
```
