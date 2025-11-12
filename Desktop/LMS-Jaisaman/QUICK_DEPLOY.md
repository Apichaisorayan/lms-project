# 🚀 Deploy ด้วย Vercel (วิธีเร็วที่สุด)

## ขั้นตอนที่ 1: เตรียมโปรเจ็ค

### 1.1 อัปเดตโค้ดให้ใช้ API_URL จาก config

**สำคัญ:** ต้องแก้ไขไฟล์ Vue ทั้งหมดให้ใช้ `API_URL` แทน `http://localhost:5000`

เปิดไฟล์แต่ละไฟล์และแก้ไข:

```javascript
// เดิม
import axios from 'axios'
const response = await axios.get('http://localhost:5000/api/...')

// ใหม่
import axios from 'axios'
import { API_URL } from '@/config/api'
const response = await axios.get(`${API_URL}/api/...`)
```

**ไฟล์ที่ต้องแก้ไข:**
- frontend/src/views/Register.vue
- frontend/src/views/Login.vue
- frontend/src/views/Dashboard.vue
- frontend/src/views/Courses.vue
- frontend/src/views/CourseLessons.vue
- frontend/src/views/CourseLearn.vue
- frontend/src/views/BrowseCourses.vue
- frontend/src/views/AuthCallback.vue
- frontend/src/views/QuizTake.vue
- frontend/src/views/QuizManage.vue
- frontend/src/views/LessonQuizzes.vue

### 1.2 เปลี่ยน Database เป็น PostgreSQL

แก้ไข `api/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // เปลี่ยนจาก "sqlite"
  url      = env("DATABASE_URL")
}
```

---

## ขั้นตอนที่ 2: Deploy Backend

### 2.1 สร้าง PostgreSQL Database

**ตัวเลือก 1: Supabase (แนะนำ - ฟรี)**
1. ไปที่ https://supabase.com
2. สร้าง New Project
3. คัดลอก `DATABASE_URL` จาก Settings > Database > Connection String
4. เลือก "URI" และคัดลอก

**ตัวเลือก 2: Railway**
1. ไปที่ https://railway.app
2. New Project > Provision PostgreSQL
3. คัดลอก `DATABASE_URL`

**ตัวเลือก 3: Render**
1. ไปที่ https://render.com
2. New > PostgreSQL
3. คัดลอก Internal Database URL

### 2.2 Deploy API ไป Vercel

```bash
# 1. ติดตั้ง Vercel CLI
npm install -g vercel

# 2. ไปที่โฟลเดอร์ api
cd api

# 3. Login Vercel
vercel login

# 4. Deploy
vercel

# 5. ตั้งค่า Environment Variables
vercel env add DATABASE_URL
# วาง DATABASE_URL ที่คัดลอกมา

vercel env add JWT_SECRET
# ใส่ random string (เช่น: openssl rand -base64 32)

vercel env add FRONTEND_URL
# ใส่ชั่วคราว: http://localhost:5173 (จะแก้ไขทีหลัง)

# 6. Deploy production
vercel --prod
```

**บันทึก URL ที่ได้:** เช่น `https://lms-api-xxx.vercel.app`

### 2.3 Run Database Migrations

```bash
# ตั้งค่า DATABASE_URL ชั่วคราว
$env:DATABASE_URL="postgresql://..."  # Windows PowerShell
# หรือ
set DATABASE_URL=postgresql://...     # Windows CMD

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

---

## ขั้นตอนที่ 3: Deploy Frontend

### 3.1 ตั้งค่า Environment Variable

แก้ไข `frontend/.env.production`:

```
VITE_API_URL=https://lms-api-xxx.vercel.app
```

### 3.2 Deploy Frontend

```bash
# 1. ไปที่โฟลเดอร์ frontend
cd ../frontend

# 2. Deploy
vercel

# 3. ตั้งค่า Environment Variable
vercel env add VITE_API_URL
# ใส่: https://lms-api-xxx.vercel.app

# 4. Deploy production
vercel --prod
```

**บันทึก URL ที่ได้:** เช่น `https://lms-frontend-xxx.vercel.app`

---

## ขั้นตอนที่ 4: อัปเดต CORS

### 4.1 อัปเดต FRONTEND_URL ใน Backend

```bash
cd ../api
vercel env add FRONTEND_URL
# ใส่: https://lms-frontend-xxx.vercel.app

# Redeploy
vercel --prod
```

---

## ขั้นตอนที่ 5: ทดสอบ

1. เปิด `https://lms-frontend-xxx.vercel.app`
2. ลองสมัครสมาชิก
3. ลอง Login
4. ตรวจสอบว่าทุกอย่างทำงานได้

---

## ⚠️ ปัญหาที่อาจพบ

### 1. File Upload ไม่ทำงาน
Vercel ไม่รองรับ file system แบบถาวร

**แก้ไข:** ใช้ Cloudinary

1. สมัคร https://cloudinary.com (ฟรี)
2. ติดตั้ง:
```bash
cd api
npm install cloudinary multer-storage-cloudinary
```

3. สร้าง `api/config/cloudinary.js`:
```javascript
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'pdf']
  }
})

export default cloudinary
```

4. เพิ่ม Environment Variables:
```bash
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

### 2. OAuth ไม่ทำงาน

ต้องอัปเดต Callback URLs:

**Google Console:**
- Authorized redirect URIs: `https://lms-api-xxx.vercel.app/api/auth/google/callback`

**Facebook Console:**
- Valid OAuth Redirect URIs: `https://lms-api-xxx.vercel.app/api/auth/facebook/callback`

จากนั้นอัปเดต Environment Variables:
```bash
cd api
vercel env add GOOGLE_CALLBACK_URL
# ใส่: https://lms-api-xxx.vercel.app/api/auth/google/callback

vercel env add FACEBOOK_CALLBACK_URL
# ใส่: https://lms-api-xxx.vercel.app/api/auth/facebook/callback

vercel --prod
```

---

## 🎉 เสร็จแล้ว!

ตอนนี้คุณมี:
- ✅ Frontend: `https://lms-frontend-xxx.vercel.app`
- ✅ Backend: `https://lms-api-xxx.vercel.app`
- ✅ Database: PostgreSQL บน Supabase/Railway/Render

**แชร์ลิงค์:** ส่ง `https://lms-frontend-xxx.vercel.app` ให้คนอื่นได้เลย!

---

## 📝 Tips

1. **Custom Domain:** ไปที่ Vercel Dashboard > Settings > Domains
2. **Monitor Logs:** Vercel Dashboard > Deployments > View Function Logs
3. **Auto Deploy:** เชื่อม GitHub repository เพื่อ auto-deploy เมื่อ push code

---

## 🆘 ต้องการความช่วยเหลือ?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
