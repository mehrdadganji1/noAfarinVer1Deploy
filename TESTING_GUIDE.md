# 🧪 راهنمای تست Club Member Dashboard

## 📋 وضعیت سرویس‌ها:

### **✅ در حال اجرا:**
1. ✅ **Frontend** - Port 5174 (Vite Dev Server)
2. 🔄 **Backend Services** - در حال start شدن...
   - User Service (3001)
   - Event Service (3009)
   - Project Service (3010)
   - Course Service (3011)
   - Achievement Service (3012)

---

## 🎯 **تست‌های پیشنهادی:**

### **1. تست بدون Login (Public Access):**

#### **Events Page:**
1. باز کن: `http://localhost:5174/club-member/events`
2. چک کن:
   - ✅ لیست رویدادها نمایش داده میشه
   - ✅ آمار کلی (کل رویدادها، در حال اجرا، etc.)
   - ✅ فیلترها کار می‌کنن (نوع، وضعیت)
   - ✅ جستجو کار می‌کنه
   - ✅ دکمه ثبت‌نام نمایش داده میشه

#### **Projects Page:**
1. باز کن: `http://localhost:5174/club-member/projects`
2. چک کن:
   - ✅ لیست پروژه‌ها
   - ✅ آمار (کل، در حال اجرا, etc.)
   - ✅ فیلتر category و status
   - ✅ جستجو
   - ✅ دکمه‌های Join/View

#### **Courses Page:**
1. باز کن: `http://localhost:5174/club-member/courses`
2. چک کن:
   - ✅ لیست دوره‌ها
   - ✅ آمار (کل، فعال، etc.)
   - ✅ فیلتر category و level
   - ✅ جستجو
   - ✅ دکمه‌های Enroll

#### **Achievements Page:**
1. باز کن: `http://localhost:5174/club-member/achievements`
2. چک کن:
   - ✅ لیست تمام achievements
   - ✅ آمار (unlock شده، امتیازات, etc.)
   - ✅ فیلتر category، rarity، status
   - ✅ Progress bars برای locked achievements

---

### **2. تست با Login (Club Member):**

#### **Login:**
1. باز کن: `http://localhost:5174/login`
2. Login کن با یک club member account
   ```
   Email: member@example.com
   Password: (از database)
   ```

#### **Dashboard:**
1. باز کن: `http://localhost:5174/club-member/dashboard`
2. چک کن:
   - ✅ آمار real-time نمایش داده میشه
   - ✅ رویدادهای شرکت کرده
   - ✅ پروژه‌های فعال
   - ✅ دوره‌های ثبت شده
   - ✅ دستاوردهای unlock شده
   - ✅ امتیازات کل
   - ✅ رتبه در میان اعضا

#### **Register for Event:**
1. برو به Events page
2. یک event انتخاب کن
3. کلیک کن روی "ثبت‌نام"
4. چک کن:
   - ✅ Toast notification نمایش داده میشه
   - ✅ دکمه تبدیل میشه به "لغو ثبت‌نام"
   - ✅ Stats در dashboard update میشه

#### **Join Project:**
1. برو به Projects page
2. یک project انتخاب کن
3. کلیک کن روی "پیوستن به پروژه"
4. چک کن:
   - ✅ Toast notification
   - ✅ دکمه تبدیل به "خروج از پروژه"
   - ✅ Team member count افزایش پیدا کنه
   - ✅ Stats update شه

#### **Enroll in Course:**
1. برو به Courses page
2. یک course انتخاب کن
3. کلیک کن روی "ثبت‌نام"
4. چک کن:
   - ✅ Toast notification
   - ✅ دکمه تبدیل به "لغو ثبت‌نام"
   - ✅ Progress bar نمایش داده شه
   - ✅ Stats update شه

#### **View Achievements:**
1. برو به Achievements page
2. چک کن:
   - ✅ Unlocked achievements با رنگ و badge
   - ✅ Locked achievements با قفل
   - ✅ Progress bars برای achievements در حال انجام
   - ✅ امتیازات کسب شده

---

### **3. تست Cancel/Leave/Drop:**

#### **Cancel Event Registration:**
1. برو به Events page
2. یک registered event پیدا کن
3. کلیک کن روی "لغو ثبت‌نام"
4. چک کن:
   - ✅ Confirmation
   - ✅ Status تغییر کنه
   - ✅ Stats update شه

#### **Leave Project:**
1. برو به Projects page
2. یک joined project پیدا کن
3. کلیک کن روی "خروج از پروژه"
4. چک کن:
   - ✅ Status تغییر کنه
   - ✅ دکمه برگرده به "پیوستن"

#### **Drop Course:**
1. برو به Courses page
2. یک enrolled course پیدا کن
3. کلیک کن روی "لغو ثبت‌نام"
4. چک کن:
   - ✅ Status تغییر کنه
   - ✅ دکمه برگرده به "ثبت‌نام"

---

### **4. تست Filters & Search:**

#### **Events:**
- ✅ فیلتر نوع (کارگاه، سمینار، etc.)
- ✅ فیلتر وضعیت (آینده، در حال اجرا, etc.)
- ✅ جستجوی عنوان
- ✅ Pagination

#### **Projects:**
- ✅ فیلتر category (Web, Mobile, AI, etc.)
- ✅ فیلتر status (Planning, In Progress, etc.)
- ✅ جستجوی عنوان
- ✅ Pagination

#### **Courses:**
- ✅ فیلتر category (Programming, Design, etc.)
- ✅ فیلتر level (Beginner, Intermediate, Advanced)
- ✅ جستجوی عنوان
- ✅ Pagination

#### **Achievements:**
- ✅ فیلتر category (Technical, Academic, etc.)
- ✅ فیلتر rarity (Common, Rare, Epic, Legendary)
- ✅ فیلتر status (Unlocked, Locked)

---

### **5. تست Loading States:**

1. با Slow 3G در DevTools تست کن
2. چک کن:
   - ✅ LoadingSkeleton نمایش داده میشه
   - ✅ دکمه‌ها disable میشن در حین loading
   - ✅ "در حال پردازش..." text نمایش داده میشه

---

### **6. تست Error Handling:**

1. Backend رو stop کن
2. یک action انجام بده (register, join, etc.)
3. چک کن:
   - ✅ Error toast نمایش داده میشه
   - ✅ UI crash نمی‌کنه
   - ✅ پیام خطای مناسب

---

### **7. تست Empty States:**

1. فیلترهایی انتخاب کن که نتیجه‌ای نداشته باشه
2. چک کن:
   - ✅ EmptyState component نمایش داده میشه
   - ✅ پیام مناسب
   - ✅ Icon مناسب

---

## 🔧 **چک کردن Services:**

### **Browser:**
باز کن: `http://localhost:5174/check-services.html`
این صفحه وضعیت همه سرویس‌ها رو نشون میده.

### **Manual API Test:**

#### **Event Service:**
```bash
curl http://localhost:3009/api/events/stats
```

#### **Project Service:**
```bash
curl http://localhost:3010/api/projects/stats
```

#### **Course Service:**
```bash
curl http://localhost:3011/api/courses/stats
```

#### **Achievement Service:**
```bash
curl http://localhost:3012/api/achievements/stats
```

---

## 📊 **Expected Results:**

### **Stats on Dashboard:**
```json
{
  "eventsAttended": 5,        // از Event Service
  "projectsCompleted": 3,     // از Project Service
  "coursesCompleted": 2,      // از Course Service
  "achievementsEarned": 8,    // از Achievement Service
  "totalPoints": 250,         // از Achievement Service
  "rank": 12                  // از User Service
}
```

### **Public vs Authenticated:**
- **بدون Login:** می‌تونه browse کنه، stats ببینه
- **با Login:** می‌تونه register/join/enroll کنه، personal stats ببینه

---

## 🐛 **Common Issues:**

### **1. Backend Not Running:**
```
Error: Failed to fetch
Solution: Run start-all-complete.bat
```

### **2. CORS Error:**
```
Solution: Check backend middleware
```

### **3. Token Expired:**
```
Solution: Login again
```

### **4. Port Already in Use:**
```
Solution: Kill process or use different port
```

---

## ✅ **Success Criteria:**

### **✅ All Pages Working:**
- [ ] Dashboard نمایش میده real-time stats
- [ ] Events page load میشه و functional است
- [ ] Projects page load میشه و functional است
- [ ] Courses page load میشه و functional است
- [ ] Achievements page load میشه و functional است

### **✅ User Actions:**
- [ ] Register/Cancel برای events
- [ ] Join/Leave برای projects
- [ ] Enroll/Drop برای courses
- [ ] View achievements و progress

### **✅ Real-time Updates:**
- [ ] Stats در dashboard update میشن
- [ ] Counts در pages درست هستن
- [ ] User-specific data نمایش داده میشه

### **✅ UI/UX:**
- [ ] Loading states
- [ ] Error messages
- [ ] Empty states
- [ ] Toast notifications
- [ ] Responsive design
- [ ] RTL support

---

## 🎉 **اگر همه چیز کار کنه:**

**تبریک! 🎊**

Club Member Dashboard کاملاً functional است و آماده برای:
- ✅ Production deployment
- ✅ User testing
- ✅ Further development
- ✅ Feature enhancements

---

*Happy Testing! 🚀*
