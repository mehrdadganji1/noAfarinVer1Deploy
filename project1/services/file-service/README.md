# 📁 File Service - Noafarin Platform

## 🎯 مسئولیت

مدیریت کامل آپلود، ذخیره‌سازی، و دانلود فایل‌ها

---

## ✨ Features

- ✅ آپلود تک فایل
- ✅ آپلود چند فایل همزمان
- ✅ تولید Thumbnail خودکار برای تصاویر
- ✅ استخراج Metadata
- ✅ Validation انواع فایل
- ✅ محدودیت حجم
- ✅ ذخیره اطلاعات در MongoDB
- ✅ Tracking downloads
- ✅ مدیریت مجوزها

---

## 🛠️ Tech Stack

```
- Express + TypeScript
- Multer (File Upload)
- Sharp (Image Processing)
- MongoDB (Metadata Storage)
```

---

## 📡 API Endpoints

### Upload
```http
POST /api/files/upload
POST /api/files/upload/multiple
```

### Download
```http
GET /api/files/download/:filename
```

### Management
```http
GET    /api/files          # List files
GET    /api/files/:id      # Get file info  
DELETE /api/files/:id      # Delete file
```

---

## 🚀 نحوه استفاده

### Development
```bash
cd services/file-service
npm install
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t noafarin-file-service .
docker run -p 3007:3007 noafarin-file-service
```

---

## 📤 مثال آپلود

### Single File
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('relatedType', 'team');
formData.append('relatedId', 'team-id');

const response = await fetch('http://localhost:3007/api/files/upload', {
  method: 'POST',
  body: formData,
});
```

### Multiple Files
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('http://localhost:3007/api/files/upload/multiple', {
  method: 'POST',
  body: formData,
});
```

---

## 🔒 Security

- File type validation
- Size limits (10 MB default)
- Sanitized filenames
- Access control (coming soon)

---

## 📦 File Types Supported

### Images
- JPEG, JPG, PNG, GIF, WebP, SVG

### Documents
- PDF
- Word (.doc, .docx)
- Excel (.xls, .xlsx)
- PowerPoint (.ppt, .pptx)

### Text
- TXT, CSV

### Archives
- ZIP, RAR

---

## 🎨 Features در دست توسعه

- [ ] Cloud storage (S3, Google Cloud)
- [ ] Video upload & processing
- [ ] Audio file support
- [ ] Advanced image editing
- [ ] Virus scanning
- [ ] CDN integration

---

**Port:** 3007  
**Status:** Production Ready ✅
