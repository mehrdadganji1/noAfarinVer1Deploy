# ✅ Startup Scripts Updated - Ready for New Services!

## 📅 **Date:** 2025-11-09
## ⏱️ **Duration:** 15 minutes  
## 🎯 **Achievement:** سرویس‌های جدید به اسکریپت‌های راه‌اندازی اضافه شدند

---

## ✅ **Files Updated:**

### **1. start-all-complete.bat**

#### **Changes Made:**
```diff
+ Added ports 3009-3012 to kill commands
+ Added Event Service (CM) - Port 3009
+ Added Project Service (CM) - Port 3010
+ Added Course Service (CM) - Port 3011
+ Added Achievement Service (CM) - Port 3012
+ Updated step counter: 11 → 15 steps
+ Added health checks for new services
+ Updated access points list
```

#### **New Kill Commands:**
```batch
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3009"...') do taskkill /F /PID %%a
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3010"...') do taskkill /F /PID %%a
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3011"...') do taskkill /F /PID %%a
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3012"...') do taskkill /F /PID %%a
```

#### **New Service Startup:**
```batch
REM Step 11/15 - Event Service (CM) - Port 3009
start "Event Service CM" cmd /k "cd services\event-service && set PORT=3009 && npm run dev"

REM Step 12/15 - Team/Project Service - Port 3010
start "Team Service CM" cmd /k "cd services\team-service && set PORT=3010 && npm run dev"

REM Step 13/15 - Training/Course Service - Port 3011  
start "Training Service CM" cmd /k "cd services\training-service && set PORT=3011 && npm run dev"

REM Step 14/15 - Evaluation/Achievement Service - Port 3012
start "Evaluation Service CM" cmd /k "cd services\evaluation-service && set PORT=3012 && npm run dev"
```

#### **New Health Checks:**
```batch
curl -s http://localhost:3009/health 2>nul && echo [OK] Event Service (CM) || echo [FAIL] Event Service (CM)
curl -s http://localhost:3010/health 2>nul && echo [OK] Project Service (CM) || echo [FAIL] Project Service (CM)
curl -s http://localhost:3011/health 2>nul && echo [OK] Course Service (CM) || echo [FAIL] Course Service (CM)
curl -s http://localhost:3012/health 2>nul && echo [OK] Achievement Service (CM) || echo [FAIL] Achievement Service (CM)
```

---

### **2. check-services.html**

#### **Changes Made:**
```diff
+ Added Event Service (CM) - Port 3009 🎪 [NEW]
+ Added Project Service (CM) - Port 3010 🚀 [NEW]
+ Added Course Service (CM) - Port 3011 📚 [NEW]  
+ Added Achievement Service (CM) - Port 3012 🏆 [NEW]
+ Added NEW badge display for Club Member services
+ Total services: 10 → 14
```

#### **New Services Array:**
```javascript
const services = [
    // ... existing services
    // Club Member Services (NEW)
    { name: 'Event Service (CM)', port: 3009, icon: '🎪', badge: 'NEW' },
    { name: 'Project Service (CM)', port: 3010, icon: '🚀', badge: 'NEW' },
    { name: 'Course Service (CM)', port: 3011, icon: '📚', badge: 'NEW' },
    { name: 'Achievement Service (CM)', port: 3012, icon: '🏆', badge: 'NEW' },
    { name: 'Frontend', port: 5173, icon: '⚛️', isWeb: true },
];
```

---

## 📊 **Complete Service List:**

| Service | Port | Type | Status |
|---------|------|------|--------|
| **API Gateway** | 3000 | Gateway | ✅ Existing |
| **User Service** | 3001 | Applicant | ✅ Existing |
| **Team Service** | 3002 | Applicant | ✅ Existing |
| **Event Service** | 3003 | Applicant | ✅ Existing |
| **Evaluation Service** | 3004 | Applicant | ✅ Existing |
| **Training Service** | 3005 | Applicant | ✅ Existing |
| **Funding Service** | 3006 | Applicant | ✅ Existing |
| **File Service** | 3007 | Applicant | ✅ Existing |
| **Application Service** | 3008 | Applicant | ✅ Existing |
| **Event Service (CM)** | 3009 | Club Member | 🆕 NEW |
| **Project Service (CM)** | 3010 | Club Member | 🆕 NEW |
| **Course Service (CM)** | 3011 | Club Member | 🆕 NEW |
| **Achievement Service (CM)** | 3012 | Club Member | 🆕 NEW |
| **Frontend** | 5173 | Web App | ✅ Existing |

**Total: 14 Services** (9 Old + 4 New + 1 Frontend)

---

## 🚨 **IMPORTANT: Service Files Missing!**

### **⚠️ Current Issue:**
سرویس‌های جدید (3009-3012) در اسکریپت اضافه شدند، اما **فایل‌های کد هنوز ایجاد نشده‌اند**!

### **📁 Required Files for Each Service:**

```
services/event-service/
├── src/
│   ├── models/Event.ts          ❌ NOT CREATED YET
│   ├── controllers/eventController.ts  ❌ NOT CREATED YET
│   ├── routes/eventRoutes.ts    ❌ NOT CREATED YET
│   ├── middleware/auth.ts       ❌ NOT CREATED YET
│   └── index.ts                 ✅ EXISTS (but needs routes)

services/team-service/
├── src/
│   ├── models/Project.ts        ❌ NOT CREATED YET
│   ├── controllers/projectController.ts  ❌ NOT CREATED YET
│   ├── routes/projectRoutes.ts  ❌ NOT CREATED YET
│   ├── middleware/auth.ts       ❌ NOT CREATED YET
│   └── index.ts                 ❓ CHECK

services/training-service/
├── src/
│   ├── models/Course.ts         ❌ NOT CREATED YET
│   ├── controllers/courseController.ts  ❌ NOT CREATED YET
│   ├── routes/courseRoutes.ts   ❌ NOT CREATED YET
│   ├── middleware/auth.ts       ❌ NOT CREATED YET
│   └── index.ts                 ❓ CHECK

services/evaluation-service/
├── src/
│   ├── models/Achievement.ts    ❌ NOT CREATED YET
│   ├── controllers/achievementController.ts  ❌ NOT CREATED YET
│   ├── routes/achievementRoutes.ts  ❌ NOT CREATED YET
│   ├── middleware/auth.ts       ❌ NOT CREATED YET
│   └── index.ts                 ❓ CHECK
```

---

## 🔧 **Next Steps to Fix:**

### **Option 1: Create Service Files (RECOMMENDED)**

1. ✅ **Copy Model Files** که قبلاً ساختیم به پوشه‌های مناسب
2. ✅ **Copy Controller Files** که قبلاً ساختیم
3. ✅ **Copy Route Files** که قبلاً ساختیم
4. ✅ **Create Middleware Files** (auth.ts)
5. ✅ **Update index.ts** در هر سرویس
6. ✅ **Create .env** با PORT و MONGODB_URI
7. ✅ **npm install** در هر سرویس

### **Option 2: Use Existing Services**

تغییر PORT در سرویس‌های موجود:
- event-service (Port 3003) → استفاده برای Club Member
- team-service (Port 3002) → استفاده برای Projects
- training-service (Port 3005) → استفاده برای Courses
- evaluation-service (Port 3004) → استفاده برای Achievements

---

## 📝 **Files We Have (Already Created):**

### **1. Models:**
- ✅ Event.ts (135 lines)
- ✅ Project.ts (146 lines)
- ✅ Course.ts (205 lines)
- ✅ Achievement.ts (105 lines)

### **2. Controllers:**
- ✅ eventController.ts (236 lines)
- ✅ projectController.ts (285 lines)
- ✅ courseController.ts (330 lines)
- ✅ achievementController.ts (185 lines)

### **3. Routes:**
- ✅ eventRoutes.ts (19 lines)
- ✅ projectRoutes.ts (18 lines)
- ✅ courseRoutes.ts (20 lines)
- ✅ achievementRoutes.ts (17 lines)

**📌 این فایل‌ها رو باید در مسیرهای صحیح کپی کنیم!**

---

## 🎯 **Current Status:**

```
╔════════════════════════════════════════╗
║  Startup Scripts Status:               ║
║                                        ║
║  ✅ start-all-complete.bat Updated    ║
║  ✅ check-services.html Updated       ║
║  ✅ Port conflicts resolved           ║
║  ✅ Health checks added               ║
║                                        ║
║  ⚠️  Service files NOT in place!     ║
║  ⏳ Need to copy models/controllers   ║
║                                        ║
║  Status: 🟡 SCRIPTS READY            ║
║          🔴 SERVICES NOT READY       ║
╚════════════════════════════════════════╝
```

---

## 🚀 **To Run Services:**

### **When Files Are Ready:**
```batch
# Method 1: Run startup script
./start-all-complete.bat

# Method 2: Check services
Open: check-services.html in browser
```

### **Individual Service:**
```batch
cd services/event-service
set PORT=3009
npm run dev
```

---

## 📋 **Summary:**

### **✅ Done:**
1. Updated start-all-complete.bat
2. Updated check-services.html  
3. Added ports 3009-3012
4. Added health checks
5. Updated access points
6. Added NEW badges

### **⏳ TODO:**
1. Copy Model files to services
2. Copy Controller files to services
3. Copy Route files to services
4. Create middleware/auth.ts files
5. Update index.ts files
6. Create .env files
7. Run npm install
8. Test services

---

**🎯 اسکریپت‌ها آماده‌اند! حالا باید فایل‌های سرویس‌ها رو بسازیم!** 

---

*Generated by: Cascade AI*  
*Date: 2025-11-09*  
*Status: ⚠️ Scripts Ready, Services Pending*  
*Next: Create Service Files*
