# 🚀 Noafarin Platform

پلتفرم جامع مدیریت استارتاپ‌ها، تیم‌های فناور و هسته‌های نوآوری

## 📋 فهرست مطالب

- [معرفی](#معرفی)
- [معماری](#معماری)
- [نصب و راه‌اندازی](#نصب-و-راهاندازی)
- [اسکریپت‌ها](#اسکریپتها)
- [فیچرها](#فیچرها)
- [API Documentation](#api-documentation)

---

## معرفی

پلتفرم نوآفرین یک سیستم میکروسرویس مدرن برای مدیریت کامل چرخه حیات استارتاپ‌ها و تیم‌های فناور است.

### ویژگی‌های کلیدی:
- ✅ معماری Microservices
- ✅ Authentication & Authorization کامل
- ✅ داشبورد تحلیلی و گزارش‌گیری
- ✅ سیستم رویدادها و آموزش
- ✅ File Upload با Thumbnail
- ✅ Docker Ready
- ✅ Production Ready

---

## معماری

### میکروسرویس‌ها (8 Services)

| Service | Port | توضیحات |
|---------|------|--------|
| **API Gateway** | 3000 | درگاه اصلی، Routing، Rate Limiting |
| **User Service** | 3001 | Authentication، کاربران، نقش‌ها |
| **Team Service** | 3002 | تیم‌ها، هسته‌های فناور |
| **Event Service** | 3003 | رویدادها، AACO، بازدیدها |
| **Evaluation Service** | 3004 | داوری، ارزیابی، امتیازدهی |
| **Training Service** | 3005 | دوره‌های آموزشی، منابع |
| **Funding Service** | 3006 | تسهیلات، گرنت‌ها |
| **File Service** | 3007 | آپلود فایل، Thumbnail |
| **Frontend** | 5173 | React + Vite |

### تکنولوژی‌های استفاده شده

#### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- React Query
- Zustand (State Management)

#### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Redis (Caching)
- RabbitMQ (Message Queue)
- JWT Authentication

#### DevOps
- Docker
- Docker Compose
- Nginx

## نصب و راه‌اندازی

### پیش‌نیازها

✅ Node.js 18+
✅ MongoDB (local یا Docker)
✅ Git

### روش 1️⃣: Development Mode (پیشنهادی)

```powershell
# 1. Clone
git clone https://github.com/mehrdadganji1/noafarin-platform.git
cd noafarin-platform

# 2. نصب Dependencies
.\install-all.ps1

# 3. راه‌اندازی (با Terminal‌های جدا)
.\dev-restart.ps1
```

### روش 2️⃣: Docker Mode

```powershell
# راه‌اندازی با Docker
.\docker-start.ps1

# توقف
.\docker-stop.ps1
```

📖 **راهنمای کامل:** `QUICK-START.md`

---

## اسکریپت‌ها

### مدیریت سرویس‌ها:

```powershell
# راه‌اندازی (Terminal‌های جدا - برای Debug)
.\dev-restart.ps1

# راه‌اندازی (Inline - تمیز و مرتب)
.\dev-start-inline.ps1

# توقف همه
.\kill-all.ps1

# Restart سریع
.\restart-all.ps1

# نمایش logs
.\show-logs.ps1
.\show-logs.ps1 api-gateway
```

📖 **راهنمای کامل اسکریپت‌ها:** `SCRIPTS-GUIDE.md`

---

## فیچرها

### 👥 User Management
- Authentication (JWT)
- Role-Based Access Control
- Profile Management

### 👨‍💼 Team Management
- تیم‌سازی و مدیریت اعضا
- ایده‌ها و پیشرفت
- Leaderboard

### 📅 Events
- AACO، Workshops
- ثبت‌نام و حضور
- گزارش‌ها

### ⭐ Evaluation
- داوری چندبعدی
- امتیازدهی
- Analytics

### 📚 Training
- دوره‌های آموزشی
- منابع و مستندات
- پیگیری پیشرفت

### 💰 Funding
- تسهیلات و گرنت‌ها
- درخواست و تأیید
- مدیریت بودجه

### 📁 File Management
- Upload با Drag & Drop
- Thumbnail خودکار
- File Storage

---

## API Documentation

مستندات Swagger بعد از راه‌اندازی:
```
http://localhost:3000/api-docs
```

---

## Tech Stack

### Frontend:
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Query
- Zustand

### Backend:
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Redis (Caching)
- RabbitMQ (Message Queue)
- JWT Authentication
- Multer + Sharp (File Upload)

### DevOps:
- Docker + Docker Compose
- Nginx

---

## پروژه Structure

```
noafarin-platform/
├── frontend/                 # React Frontend
├── services/
│   ├── api-gateway/         # API Gateway
│   ├── user-service/        # User & Auth
│   ├── team-service/        # Teams
│   ├── event-service/       # Events
│   ├── evaluation-service/  # Evaluation
│   ├── training-service/    # Training
│   ├── funding-service/     # Funding
│   └── file-service/        # File Upload
├── shared/                  # مشترک
├── docker-compose.yml       # Docker config
├── *.ps1                    # Management scripts
└── README.md
```

---

## لینک‌های مفید

- 📖 [راهنمای سریع](QUICK-START.md)
- 📜 [راهنمای اسکریپت‌ها](SCRIPTS-GUIDE.md)
- 🐳 Docker Hub: *coming soon*
- 📝 Changelog: *coming soon*

---

## لایسنس

MIT License

## تیم توسعه

**پارک علم و فناوری استان زنجان**  
**شرکت کیا نو تجارت افرا**

---

⭐ **Star this repo if you find it useful!**
