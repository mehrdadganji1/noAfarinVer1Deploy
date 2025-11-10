# 🔥 راه‌حل ریشه‌ای - Event Registration 500 Error

## 🎯 **مشکل:**
POST `/api/events/:id/register` مدام 500 Error میده.

## 🔍 **احتمالات:**

### **1. MongoDB Connection Issue ❌**
سرویس به MongoDB وصل نیست یا .env ندارد.

### **2. Event Collection خالی است ❌**
هیچ Event در database نیست.

### **3. Middleware Auth مشکل داره ❌**
authenticate middleware user رو درست set نمی‌کنه.

---

## ✅ **راه‌حل های ریشه‌ای:**

### **گام 1: بررسی MongoDB Connection**

بذار `.env` فایل رو برای event-service چک کنیم:
