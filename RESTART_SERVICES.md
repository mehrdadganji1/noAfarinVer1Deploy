# 🔄 راهنمای Restart سرویس‌ها

## ⚠️ **چرا باید Restart کنیم؟**

تغییرات `.env` فقط بعد از restart سرویس‌ها اعمال میشن!

---

## 🎯 **سرویس‌هایی که باید Restart شن:**

### **1. API Gateway (پورت 3000) - ضروری! ⭐**
```bash
# Stop current process
# در terminal که API Gateway داره run میشه: Ctrl+C

# Start again
cd D:/programming/noafarineventir/project1/services/api-gateway
npm run dev
```

**چرا؟**
- `.env` تغییر کرد: Event Service URL از 3003 به 3009 تغییر کرد
- بدون restart، همچنان به سرویس قدیمی درخواست میفرسته

---

### **2. Event Service (پورت 3009) - باید Running باشه ⭐**
```bash
# Check if running
netstat -ano | findstr :3009

# If not running, start it:
cd D:/programming/noafarineventir/project1/services/event-service
npm run dev
```

---

### **3. Frontend (پورت 5174) - Hard Refresh**
```bash
# در browser:
Ctrl + Shift + R    (Windows/Linux)
Cmd + Shift + R     (Mac)

# یا:
1. Clear cache
2. Close tab
3. Open fresh: http://localhost:5174
```

**چرا؟**
- `.env` frontend هم تغییر کرد (3001 → 3000)
- Vite باید reload کنه

---

## ⚡ **Quick Restart (راه سریع):**

### **Option 1: استفاده از start-all-complete.bat**
```bash
cd D:/programming/noafarineventir/project1

# Stop همه سرویس‌ها
# Ctrl+C در terminal

# Start دوباره
.\start-all-complete.bat
```

این script همه سرویس‌ها رو با هم start میکنه.

---

### **Option 2: فقط سرویس‌های لازم:**

**Terminal 1 - API Gateway:**
```bash
cd D:/programming/noafarineventir/project1/services/api-gateway
npm run dev
```

**Terminal 2 - Event Service:**
```bash
cd D:/programming/noafarineventir/project1/services/event-service
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd D:/programming/noafarineventir/project1/frontend
npm run dev
```

---

## ✅ **چک کردن که کار کرد:**

### **1. Check API Gateway:**
```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "success": true,
  "message": "API Gateway is running"
}
```

---

### **2. Check Event Service:**
```bash
curl http://localhost:3009/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Event Service is running"
}
```

---

### **3. Check API Gateway به Event Service وصل شده:**

در **Browser Console** (F12):
```javascript
// باید ببینی:
🔧 API Configuration: {
  API_URL: 'http://localhost:3000/api',
  NODE_ENV: 'development'
}
```

---

### **4. Test Event Creation:**

1. ✅ برو به: `http://localhost:5174/events`
2. ✅ کلیک کن روی "ایجاد رویداد"
3. ✅ فرم رو پر کن
4. ✅ Submit کن
5. ✅ در Console باید ببینی:
   ```
   📤 Sending event data: {...}
   🔵 POST /events
   ```
6. ✅ **نباید** 404 error بیاد!
7. ✅ باید success message بیاد

---

## 🐛 **اگه هنوز کار نکرد:**

### **مشکل: هنوز 404 میگیره**

**راه حل 1: چک کن API Gateway log:**
```
[Event] → POST /events
[Event] Target URL: http://localhost:3009/api/events
```

اگه این log رو **نمیبینی** → API Gateway restart نشده!

---

### **مشکل: Cannot connect to Event Service**

**راه حل:**
```bash
# 1. Check Event Service running:
netstat -ano | findstr :3009

# 2. If not running:
cd services/event-service
npm run dev

# 3. Check logs for errors
```

---

### **مشکل: Frontend هنوز به 3001 درخواست میفرسته**

**راه حل:**
```bash
# 1. Kill frontend process completely
# Ctrl+C

# 2. Clear node_modules/.vite cache:
cd frontend
rm -rf node_modules/.vite

# 3. Start fresh:
npm run dev

# 4. Hard refresh browser:
Ctrl + Shift + R
```

---

## 📝 **Checklist کامل:**

- [ ] API Gateway stopped (Ctrl+C)
- [ ] API Gateway started again (`npm run dev`)
- [ ] API Gateway log shows correct EVENT_SERVICE_URL (3009)
- [ ] Event Service is running (port 3009)
- [ ] Event Service health check returns 200
- [ ] Frontend hard refreshed (Ctrl+Shift+R)
- [ ] Browser console shows API_URL: localhost:3000
- [ ] Test event creation
- [ ] No 404 error
- [ ] Success message appears

---

## 🎉 **بعد از Restart موفق:**

باید بتونی:
- ✅ رویداد جدید بسازی
- ✅ Success toast ببینی
- ✅ رویداد در لیست ظاهر بشه
- ✅ هیچ error در console نباشه

---

**اگه باز هم مشکل داری، Terminal logs رو بفرست!** 🔍
