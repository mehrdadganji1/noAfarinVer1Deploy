# 🔍 Club Member System - Debug Guide

## ✅ تغییرات انجام شده:

### 1. **Fixed .env Configuration**
```
قبل: VITE_API_URL=http://localhost:3000/api ❌
بعد: VITE_API_URL=http://localhost:3001/api ✅
```

### 2. **Fixed API Instance**
```typescript
قبل: axios instance جدید در useClubMember.ts ❌
بعد: استفاده از api اصلی از @/lib/api ✅
```

### 3. **Added Debug Logging**
- ✅ Frontend console logs
- ✅ Backend terminal logs
- ✅ Full error details

### 4. **Added Test Endpoint**
```
GET http://localhost:3001/api/membership/test
```

### 5. **Restarted All Services**
```bash
✅ All services restarted با start-all-complete.bat
```

---

## 🧪 مراحل تست:

### **Step 1: تست endpoint membership**
```bash
# Test 1: مستقیم از backend
curl http://localhost:3001/api/membership/test

# Expected Output:
{
  "success": true,
  "message": "Membership routes are working!",
  "timestamp": "2025-01-09T..."
}
```

### **Step 2: تست در Browser**
1. ✅ Browser رو باز کن
2. ✅ Console رو باز کن (F12)
3. ✅ به Applications page برو
4. ✅ Console رو clear کن
5. ✅ روی دکمه ارتقا کلیک کن
6. ✅ Console logs رو بخون

**Logs باید اینجوری باشن:**
```javascript
🔍 Application data: { userId: "...", ... }
🎯 Promoting user with ID: "..."
🔄 Promoting user: "..."
📍 Full URL will be: http://localhost:3001/api/membership/promote/...
🔵 POST /membership/promote/... 
```

### **Step 3: تست Backend Logs**
در terminal که User Service داره اجرا میشه:

```bash
🔄 Promotion request: { userId: '...', adminId: '...' }
👤 User found: { id: '...', email: '...', roles: ['applicant'] }
📝 Application found: { id: '...', status: 'approved' }
✅ Success!
```

---

## 🐛 Common Issues & Solutions:

### **Issue 1: 404 Error**
**علت:** Endpoint پیدا نمیشه

**چک کنید:**
```bash
# 1. User service running?
curl http://localhost:3001/health

# 2. Membership routes working?
curl http://localhost:3001/api/membership/test

# 3. Check browser console for actual URL
# باید ببینی: http://localhost:3001/api/membership/promote/...
```

**راه حل:**
- ✅ Frontend restart کن
- ✅ Backend restart کن
- ✅ Browser cache رو clear کن (Ctrl+Shift+Delete)
- ✅ Hard refresh کن (Ctrl+F5)

---

### **Issue 2: userId undefined**
**علت:** userId درست pass نمیشه

**Console میگه:**
```javascript
❌ Invalid userId: undefined
```

**راه حل:**
در Applications.tsx چک کن که userId درست extract میشه:
```typescript
const userId = application.userId?._id || application.userId;
console.log('userId:', userId, 'type:', typeof userId);
```

---

### **Issue 3: Authentication Failed**
**علت:** Token نداره یا expired شده

**Console/Backend میگه:**
```
401 Unauthorized
```

**راه حل:**
1. Logout کن
2. Login کن دوباره
3. Token جدید بگیر

---

### **Issue 4: User Not Applicant**
**علت:** User نقش applicant نداره

**Backend میگه:**
```
❌ User is not an applicant. Roles: ['student']
```

**راه حل:**
کاربر باید role `applicant` داشته باشه. در database:
```javascript
db.users.updateOne(
  { _id: ObjectId("USER_ID") },
  { $addToSet: { role: "applicant" } }
)
```

---

### **Issue 5: No Approved Application**
**علت:** Application با status="approved" وجود نداره

**Backend میگه:**
```
❌ No approved application found for user
```

**راه حل:**
Application رو approve کن اول:
1. Admin Panel → Applications
2. پیدا کردن application
3. کلیک روی Approve button
4. بعد promote کن

---

## 📊 Complete Checklist:

### **Backend:**
- [ ] User Service running on port 3001
- [ ] `/health` endpoint works
- [ ] `/api/membership/test` endpoint works
- [ ] Database connected
- [ ] Application Model has approved records

### **Frontend:**
- [ ] Frontend running on port 5173
- [ ] `.env` has correct API_URL (3001)
- [ ] Browser cache cleared
- [ ] Console shows correct URLs
- [ ] No TypeScript errors

### **Data:**
- [ ] User has role: `applicant`
- [ ] Application exists با userId
- [ ] Application status: `approved`
- [ ] User is NOT already club_member

---

## 🔧 Quick Fixes:

### **Fix 1: Clear Everything**
```bash
# Stop all
taskkill /F /IM node.exe

# Clear browser
Ctrl+Shift+Delete → Clear All

# Restart
cd D:/programming/noafarineventir/project1
.\start-all-complete.bat

# Wait 30 seconds
# Then test
```

### **Fix 2: Test Direct API Call**
```bash
# Get token from localStorage in browser console
const token = localStorage.getItem('token');
console.log(token);

# Test with curl
curl -X POST \
  http://localhost:3001/api/membership/promote/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### **Fix 3: Check Database**
```javascript
// In MongoDB
use noafarin_db

// Find approved applications
db.applications.find({ status: "approved" })

// Check user
db.users.findOne({ _id: ObjectId("USER_ID") })

// Check if user has approved application
db.applications.findOne({ 
  userId: ObjectId("USER_ID"),
  status: "approved"
})
```

---

## 📞 بعدی چی کار کنیم؟

### **اگه هنوز کار نکرد:**
1. Screenshot از browser console بفرست
2. Screenshot از backend terminal logs بفرست
3. نتیجه این command رو بفرست:
   ```bash
   curl http://localhost:3001/api/membership/test
   ```

### **اگه کار کرد:**
✅ ادامه توسعه:
- Event Service
- Project Service
- Course Service
- Achievement System

---

**Last Updated:** 2025-01-09
**Status:** Debug Guide Complete
