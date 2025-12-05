# 🚀 راهنمای سریع دیپلوی پلتفرم نوآفرین

## 📋 فهرست مطالب
- [پیش‌نیازها](#پیش‌نیازها)
- [مرحله ۱: آماده‌سازی سرور](#مرحله-۱-آماده‌سازی-سرور)
- [مرحله ۲: کلون پروژه](#مرحله-۲-کلون-پروژه)
- [مرحله ۳: تنظیم Environment](#مرحله-۳-تنظیم-environment)
- [مرحله ۴: تنظیم SSL](#مرحله-۴-تنظیم-ssl)
- [مرحله ۵: Build و Deploy](#مرحله-۵-build-و-deploy)
- [مرحله ۶: بررسی و تست](#مرحله-۶-بررسی-و-تست)
- [دستورات مفید](#دستورات-مفید)
- [عیب‌یابی](#عیب‌یابی)

---

## پیش‌نیازها

### سخت‌افزار سرور
| مورد | حداقل | پیشنهادی |
|------|-------|----------|
| RAM | 4 GB | 8 GB |
| CPU | 2 Core | 4 Core |
| Storage | 40 GB SSD | 100 GB SSD |
| OS | Ubuntu 20.04+ | Ubuntu 22.04 LTS |

### نرم‌افزار مورد نیاز
- Docker 24+
- Docker Compose 2.20+
- Git
- دامنه با DNS تنظیم شده
- SSL Certificate (Let's Encrypt یا خریداری شده)

---

## مرحله ۱: آماده‌سازی سرور

### نصب Docker (Ubuntu)
```bash
# به‌روزرسانی سیستم
sudo apt update && sudo apt upgrade -y

# نصب پیش‌نیازها
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# اضافه کردن کلید GPG داکر
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# اضافه کردن ریپازیتوری داکر
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# نصب داکر
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# اضافه کردن کاربر به گروه docker
sudo usermod -aG docker $USER

# فعال‌سازی داکر
sudo systemctl enable docker
sudo systemctl start docker

# خروج و ورود مجدد برای اعمال تغییرات گروه
exit
```

### تنظیم فایروال
```bash
# نصب UFW
sudo apt install -y ufw

# تنظیم قوانین
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# فعال‌سازی
sudo ufw enable
sudo ufw status
```

---

## مرحله ۲: کلون پروژه

```bash
# ایجاد پوشه پروژه
sudo mkdir -p /opt/noafarin
sudo chown $USER:$USER /opt/noafarin
cd /opt/noafarin

# کلون از ریپازیتوری
git clone https://github.com/mehrdadganji1/noAfarinVer1Deploy.git .

# یا اگر از branch خاصی استفاده می‌کنید:
# git clone -b main https://github.com/mehrdadganji1/noAfarinVer1Deploy.git .

# رفتن به پوشه پروژه
cd project1
```

---

## مرحله ۳: تنظیم Environment

### ۳.۱ کپی فایل نمونه
```bash
cp .env.production.example .env.production
```

### ۳.۲ تولید کلیدهای امن
```bash
# تولید JWT Secret
echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')"

# تولید رمز MongoDB
echo "MONGO_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')"

# تولید رمز RabbitMQ
echo "RABBITMQ_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')"
```

### ۳.۳ ویرایش فایل environment
```bash
nano .env.production
```

**مقادیر ضروری که باید تغییر کنند:**

```bash
# ===========================================
# DATABASE - رمز قوی وارد کنید
# ===========================================
MONGO_INITDB_ROOT_USERNAME=noafarin_admin
MONGO_INITDB_ROOT_PASSWORD=YOUR_GENERATED_MONGO_PASSWORD
MONGODB_URI=mongodb://noafarin_admin:YOUR_GENERATED_MONGO_PASSWORD@mongodb:27017/noafarin?authSource=admin

# ===========================================
# RABBITMQ - رمز قوی وارد کنید
# ===========================================
RABBITMQ_DEFAULT_USER=noafarin_mq
RABBITMQ_DEFAULT_PASS=YOUR_GENERATED_RABBITMQ_PASSWORD
RABBITMQ_URL=amqp://noafarin_mq:YOUR_GENERATED_RABBITMQ_PASSWORD@rabbitmq:5672

# ===========================================
# JWT - کلید تولید شده را وارد کنید
# ===========================================
JWT_SECRET=YOUR_GENERATED_JWT_SECRET

# ===========================================
# URLS - دامنه واقعی خود را وارد کنید
# ===========================================
FRONTEND_URL=https://noafarin.ir
VITE_API_URL=https://noafarin.ir/api

# ===========================================
# EMAIL - اطلاعات SMTP خود را وارد کنید
# ===========================================
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@noafarin.ir
```

---

## مرحله ۴: تنظیم SSL

### گزینه ۱: Let's Encrypt (رایگان)
```bash
# نصب Certbot
sudo apt install -y certbot

# دریافت certificate (سرور باید در دسترس باشد)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# کپی certificate ها
mkdir -p frontend/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem frontend/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem frontend/ssl/
sudo chown -R $USER:$USER frontend/ssl/
```

### گزینه ۲: Certificate خریداری شده
```bash
mkdir -p frontend/ssl
# کپی فایل‌های certificate به frontend/ssl/
# - fullchain.pem (certificate + intermediate)
# - privkey.pem (private key)
```

### ۴.۱ به‌روزرسانی nginx config
```bash
# جایگزینی دامنه در فایل nginx
sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' frontend/nginx.production.conf
```

---

## مرحله ۵: Build و Deploy

### ۵.۱ Build همه سرویس‌ها
```bash
docker compose -f docker-compose.production.yml --env-file .env.production build
```

### ۵.۲ اجرای سرویس‌ها
```bash
# اجرا در پس‌زمینه
docker compose -f docker-compose.production.yml --env-file .env.production up -d

# مشاهده لاگ‌ها (اختیاری)
docker compose -f docker-compose.production.yml logs -f
```

### ۵.۳ بررسی وضعیت
```bash
docker compose -f docker-compose.production.yml ps
```

---

## مرحله ۶: بررسی و تست

### ۶.۱ تست Health Endpoints
```bash
# تست API Gateway
curl -k https://localhost/api/health

# تست Frontend
curl -k https://localhost/
```

### ۶.۲ ایجاد کاربر Admin اولیه
```bash
# اتصال به container user-service
docker exec -it noafarin-user-service sh

# اجرای اسکریپت ایجاد admin
node scripts/createAdmin.js

# خروج
exit
```

### ۶.۳ تست در مرورگر
1. باز کردن `https://yourdomain.com`
2. تست ثبت‌نام
3. تست ورود
4. تست داشبورد

---

## دستورات مفید

### مدیریت سرویس‌ها
```bash
# مشاهده وضعیت
docker compose -f docker-compose.production.yml ps

# مشاهده لاگ‌ها
docker compose -f docker-compose.production.yml logs -f

# لاگ سرویس خاص
docker compose -f docker-compose.production.yml logs -f user-service

# ری‌استارت همه
docker compose -f docker-compose.production.yml restart

# ری‌استارت سرویس خاص
docker compose -f docker-compose.production.yml restart user-service

# توقف همه
docker compose -f docker-compose.production.yml down

# توقف و حذف volumes (⚠️ دیتا پاک می‌شود)
docker compose -f docker-compose.production.yml down -v
```

### به‌روزرسانی
```bash
# دریافت آخرین تغییرات
git pull origin main

# Rebuild و restart
docker compose -f docker-compose.production.yml --env-file .env.production build
docker compose -f docker-compose.production.yml --env-file .env.production up -d
```

### Backup دیتابیس
```bash
# ایجاد backup
docker exec noafarin-mongodb mongodump \
  --username noafarin_admin \
  --password YOUR_MONGO_PASSWORD \
  --authenticationDatabase admin \
  --out /backup

# کپی به host
docker cp noafarin-mongodb:/backup ./backup-$(date +%Y%m%d-%H%M%S)
```

### Restore دیتابیس
```bash
# کپی به container
docker cp ./backup noafarin-mongodb:/backup

# اجرای restore
docker exec noafarin-mongodb mongorestore \
  --username noafarin_admin \
  --password YOUR_MONGO_PASSWORD \
  --authenticationDatabase admin \
  /backup
```

---

## عیب‌یابی

### مشکل: سرویس بالا نمی‌آید
```bash
# بررسی لاگ
docker compose -f docker-compose.production.yml logs user-service

# بررسی وضعیت container
docker inspect noafarin-user-service
```

### مشکل: خطای اتصال به دیتابیس
```bash
# بررسی MongoDB
docker exec -it noafarin-mongodb mongosh -u noafarin_admin -p

# بررسی شبکه
docker network inspect project1_noafarin-network
```

### مشکل: خطای CORS
1. بررسی `FRONTEND_URL` در `.env.production`
2. ری‌استارت api-gateway:
```bash
docker compose -f docker-compose.production.yml restart api-gateway
```

### مشکل: SSL کار نمی‌کند
```bash
# بررسی فایل‌های SSL
ls -la frontend/ssl/

# بررسی لاگ nginx
docker compose -f docker-compose.production.yml logs frontend
```

### مشکل: کمبود حافظه
```bash
# بررسی مصرف منابع
docker stats

# پاکسازی cache
docker system prune -a
```

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های مربوطه را جمع‌آوری کنید
2. Issue در GitHub ایجاد کنید
3. با تیم توسعه تماس بگیرید

---

## ⚠️ نکات امنیتی مهم

- ❌ هرگز `.env.production` را commit نکنید
- ❌ از رمزهای پیش‌فرض استفاده نکنید
- ❌ پورت‌های داخلی را به اینترنت باز نکنید
- ✅ از رمزهای قوی و تصادفی استفاده کنید
- ✅ SSL/TLS را فعال نگه دارید
- ✅ Backup منظم بگیرید
- ✅ سرور را به‌روز نگه دارید

