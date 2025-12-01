# 📚 Learning Service - Microservice منابع آموزشی

این سرویس مسئول مدیریت منابع آموزشی، پیشرفت کاربران و تعاملات با محتوا است.

## 🚀 راه‌اندازی سریع

### 1. نصب Dependencies
```bash
npm install
```

### 2. تنظیم Environment Variables
فایل `.env` را ویرایش کنید:
```env
PORT=3006
MONGODB_URI=mongodb://localhost:27017/learning_db
NODE_ENV=development
```

### 3. اجرای MongoDB
مطمئن شوید MongoDB در حال اجراست:
```bash
# Windows
net start MongoDB

# یا با Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed کردن داده‌های اولیه
```bash
npm run seed
```

### 5. اجرای سرویس
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

سرویس روی پورت **3006** اجرا می‌شود.

---

## 📡 API Endpoints

### Resources

#### GET `/api/resources`
دریافت لیست تمام منابع

**Query Parameters:**
- `category`: فیلتر بر اساس دسته‌بندی (foundation, hacker, hustler, hipster)
- `difficulty`: فیلتر بر اساس سطح (beginner, intermediate, advanced)
- `search`: جستجو در عنوان، توضیحات و تگ‌ها

**Headers:**
- `x-user-id`: شناسه کاربر (اختیاری - برای دریافت پیشرفت)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team-over-idea",
      "title": "چرا تیم مهم‌تر از ایده است؟",
      "description": "...",
      "category": "foundation",
      "readTime": "15 دقیقه",
      "difficulty": "beginner",
      "order": 1,
      "tags": ["تیم‌سازی", "مبانی"],
      "views": 150,
      "likes": 45,
      "bookmarks": 23,
      "userProgress": {
        "status": "in_progress",
        "progress": 60,
        "bookmarked": true,
        "liked": false
      }
    }
  ],
  "total": 5
}
```

#### GET `/api/resources/:id`
دریافت جزئیات یک منبع

**Headers:**
- `x-user-id`: شناسه کاربر (اختیاری)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team-over-idea",
    "title": "چرا تیم مهم‌تر از ایده است؟",
    "content": "# محتوای markdown...",
    "htmlContent": "<h1>محتوای HTML...</h1>",
    "category": "foundation",
    "readTime": "15 دقیقه",
    "difficulty": "beginner",
    "nextResourceId": "3h-model",
    "prevResourceId": null,
    "relatedResources": [],
    "metadata": {
      "estimatedMinutes": 15,
      "sections": 5,
      "exercises": 2,
      "quizzes": 1
    },
    "userProgress": {
      "status": "in_progress",
      "progress": 60,
      "timeSpent": 12,
      "bookmarked": true,
      "liked": false,
      "notes": ""
    }
  }
}
```

#### PUT `/api/resources/:id/progress`
بروزرسانی پیشرفت کاربر

**Headers:**
- `x-user-id`: شناسه کاربر (الزامی)

**Body:**
```json
{
  "progress": 75,
  "timeSpent": 5,
  "status": "in_progress"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "resourceId": "team-over-idea",
    "status": "in_progress",
    "progress": 75,
    "timeSpent": 17
  }
}
```

#### POST `/api/resources/:id/bookmark`
تغییر وضعیت نشانک

**Headers:**
- `x-user-id`: شناسه کاربر (الزامی)

**Response:**
```json
{
  "success": true,
  "bookmarked": true
}
```

#### POST `/api/resources/:id/like`
تغییر وضعیت لایک

**Headers:**
- `x-user-id`: شناسه کاربر (الزامی)

**Response:**
```json
{
  "success": true,
  "liked": true
}
```

#### GET `/api/resources/stats`
دریافت آمار پیشرفت کاربر

**Headers:**
- `x-user-id`: شناسه کاربر (الزامی)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalResources": 5,
    "completed": 2,
    "inProgress": 1,
    "notStarted": 2,
    "totalTimeSpent": 45,
    "bookmarked": 3,
    "progressPercentage": 40
  }
}
```

---

## 🗄️ Database Schema

### Resource Model
```typescript
{
  id: string;              // شناسه یکتا
  title: string;           // عنوان
  description: string;     // توضیحات کوتاه
  content: string;         // محتوای markdown
  category: string;        // دسته‌بندی
  readTime: string;        // زمان مطالعه
  difficulty: string;      // سطح دشواری
  order: number;           // ترتیب نمایش
  tags: string[];          // تگ‌ها
  author: string;          // نویسنده
  views: number;           // تعداد بازدید
  likes: number;           // تعداد لایک
  bookmarks: number;       // تعداد نشانک
  nextResourceId: string;  // منبع بعدی
  prevResourceId: string;  // منبع قبلی
  relatedResources: string[]; // منابع مرتبط
  metadata: {
    estimatedMinutes: number;
    sections: number;
    exercises: number;
    quizzes: number;
  };
}
```

### UserProgress Model
```typescript
{
  userId: string;          // شناسه کاربر
  resourceId: string;      // شناسه منبع
  status: string;          // وضعیت (not_started, in_progress, completed)
  progress: number;        // درصد پیشرفت (0-100)
  timeSpent: number;       // زمان صرف شده (دقیقه)
  lastAccessedAt: Date;    // آخرین دسترسی
  completedAt: Date;       // تاریخ تکمیل
  bookmarked: boolean;     // نشانک شده
  liked: boolean;          // لایک شده
  notes: string;           // یادداشت‌های کاربر
  quizScores: [{
    quizId: string;
    score: number;
    completedAt: Date;
  }];
}
```

---

## 🔧 Scripts

```json
{
  "dev": "nodemon src/index.ts",
  "start": "node dist/index.js",
  "build": "tsc",
  "seed": "ts-node src/scripts/seedResources.ts"
}
```

---

## 🏗️ معماری

```
learning-service/
├── src/
│   ├── controllers/
│   │   └── resourceController.ts    # کنترلرهای API
│   ├── models/
│   │   ├── Resource.ts              # مدل منبع آموزشی
│   │   └── UserProgress.ts          # مدل پیشرفت کاربر
│   ├── routes/
│   │   └── resourceRoutes.ts        # تعریف روت‌ها
│   ├── scripts/
│   │   └── seedResources.ts         # اسکریپت seed
│   └── index.ts                     # نقطه ورود
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

---

## 🔗 یکپارچه‌سازی با API Gateway

در `api-gateway`, route زیر را اضافه کنید:

```typescript
// در api-gateway/src/index.ts
app.use('/api/learning', createProxyMiddleware({
  target: 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/learning': '/api'
  }
}));
```

---

## 📊 Monitoring & Health Check

### Health Check
```bash
GET http://localhost:3006/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "learning-service"
}
```

---

## 🧪 Testing

### تست دستی با curl:

```bash
# دریافت لیست منابع
curl http://localhost:3006/api/resources

# دریافت یک منبع خاص
curl http://localhost:3006/api/resources/team-over-idea

# بروزرسانی پیشرفت
curl -X PUT http://localhost:3006/api/resources/team-over-idea/progress \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{"progress": 50, "timeSpent": 10}'

# لایک کردن
curl -X POST http://localhost:3006/api/resources/team-over-idea/like \
  -H "x-user-id: user123"
```

---

## 🚀 Deployment

### با Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
```

```bash
docker build -t learning-service .
docker run -p 3006:3006 --env-file .env learning-service
```

---

## 📝 TODO

- [ ] اضافه کردن Authentication middleware
- [ ] پیاده‌سازی Rate Limiting
- [ ] اضافه کردن Caching (Redis)
- [ ] پیاده‌سازی Full-text Search
- [ ] اضافه کردن Unit Tests
- [ ] پیاده‌سازی Logging (Winston)
- [ ] اضافه کردن API Documentation (Swagger)

---

## 🤝 مشارکت

برای مشارکت در توسعه این سرویس:

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request باز کنید

---

## 📄 License

MIT License - مشاهده فایل LICENSE برای جزئیات بیشتر
