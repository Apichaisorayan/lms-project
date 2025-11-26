# 🚀 Quick Start Guide

## ✅ Setup เสร็จแล้ว!

API กำลังรันอยู่ที่: **http://127.0.0.1:8787**

---

## 📋 สิ่งที่ Setup แล้ว

- ✅ Database (Cloudflare D1) - สร้างและมี tables แล้ว
- ✅ Environment Variables - ตั้งค่าแล้ว
- ✅ API Server - รันอยู่แล้ว
- ✅ YouTube Integration - พร้อมใช้งาน

---

## 🧪 ทดสอบ API

### 1. ทดสอบ Register (สร้าง user ใหม่)

```bash
curl -X POST http://127.0.0.1:8787/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teacher@test.com\",\"password\":\"123456\",\"name\":\"Teacher Test\",\"role\":\"INSTRUCTOR\"}"
```

### 2. ทดสอบ Login

```bash
curl -X POST http://127.0.0.1:8787/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teacher@test.com\",\"password\":\"123456\"}"
```

คุณจะได้ **token** กลับมา คัดลอกไว้ใช้ในขั้นตอนถัดไป

### 3. ทดสอบสร้าง Course (ใช้ token ที่ได้)

```bash
curl -X POST http://127.0.0.1:8787/api/courses ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"title\":\"JavaScript Basics\",\"description\":\"Learn JavaScript from scratch\",\"thumbnail\":\"https://via.placeholder.com/400x300\",\"price\":0,\"published\":true}"
```

### 4. ทดสอบดู Courses

```bash
curl http://127.0.0.1:8787/api/courses
```

---

## 🎬 วิธีเพิ่มวิดีโอ

### ขั้นตอน:

1. **อัพโหลดวิดีโอไป YouTube**
   - ไปที่ https://studio.youtube.com/
   - อัพโหลดวิดีโอ
   - ตั้งค่าเป็น **Unlisted**

2. **คัดลอก YouTube URL**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

3. **สร้างบทเรียนพร้อม Video URL**
   ```bash
   curl -X POST http://127.0.0.1:8787/api/courses/1/lessons ^
     -H "Content-Type: application/json" ^
     -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
     -d "{\"title\":\"Introduction\",\"content\":\"Welcome to the course\",\"videoUrl\":\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",\"order\":1,\"duration\":10}"
   ```

**เท่านี้เสร็จแล้ว!** วิดีโอจะแสดงในระบบทันที

---

## 🔧 คำสั่งที่ใช้บ่อย

### รัน Development Server
```bash
cd backend
npm run dev
```

### ดูข้อมูลใน Database
```bash
npx wrangler d1 execute learning_platform --command "SELECT * FROM users"
npx wrangler d1 execute learning_platform --command "SELECT * FROM courses"
```

### Deploy to Production
```bash
npm run deploy
```

### ดู Logs (หลัง deploy)
```bash
npx wrangler tail
```

---

## 📁 โครงสร้างโปรเจกต์

```
backend/
├── src/
│   └── server.js          # API endpoints ทั้งหมด
├── schema.sql             # Database schema
├── wrangler.toml          # Cloudflare config
├── .dev.vars              # Environment variables (local)
├── package.json
├── README.md              # คู่มือหลัก
├── YOUTUBE_GUIDE.md       # คู่มือใช้ YouTube
└── QUICK_START.md         # ไฟล์นี้
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### Courses
- `GET /api/courses` - ดูคอร์สทั้งหมด
- `GET /api/courses/:id` - ดูคอร์สเดียว
- `POST /api/courses` - สร้างคอร์ส (INSTRUCTOR only)
- `PUT /api/courses/:id` - แก้ไขคอร์ส
- `DELETE /api/courses/:id` - ลบคอร์ส

### Lessons
- `GET /api/courses/:courseId/lessons` - ดูบทเรียน
- `POST /api/courses/:courseId/lessons` - สร้างบทเรียน
- `PUT /api/lessons/:id` - แก้ไขบทเรียน
- `DELETE /api/lessons/:id` - ลบบทเรียน

### Quizzes
- `GET /api/lessons/:lessonId/quizzes` - ดูแบบทดสอบ
- `POST /api/lessons/:lessonId/quizzes` - สร้างแบบทดสอบ
- `POST /api/quizzes/:quizId/start` - เริ่มทำแบบทดสอบ
- `POST /api/attempts/:attemptId/submit` - ส่งคำตอบ

### Enrollments
- `POST /api/courses/:courseId/enroll` - ลงทะเบียนเรียน
- `GET /api/my-courses` - ดูคอร์สของฉัน

### Progress
- `POST /api/lessons/:lessonId/complete` - ทำเครื่องหมายบทเรียนเสร็จ

### Upload
- `POST /api/upload` - อัพโหลดรูปภาพ (ImgBB)
- `POST /api/upload/video` - บันทึก YouTube URL

---

## 🎯 ขั้นตอนถัดไป

### 1. เชื่อมต่อกับ Frontend
แก้ไข `frontend/src/config/api.js`:
```javascript
export const API_URL = 'http://127.0.0.1:8787'
```

### 2. สมัคร ImgBB API Key (ถ้ายังไม่ได้สมัคร)
- ไปที่ https://api.imgbb.com/
- สมัครฟรี
- คัดลอก API Key
- แก้ไขใน `backend/.dev.vars`:
  ```
  IMGBB_API_KEY=your-real-api-key-here
  ```

### 3. Deploy to Production
```bash
npm run deploy
```

หลัง deploy จะได้ URL แบบนี้:
```
https://learning-platform-api.your-subdomain.workers.dev
```

แก้ไข frontend ให้ชี้ไปที่ URL นี้

---

## ❓ ปัญหาที่พบบ่อย

### Q: API ไม่ทำงาน
**A:** ตรวจสอบว่า `npm run dev` รันอยู่

### Q: Database error
**A:** รัน `npx wrangler d1 execute learning_platform --file=schema.sql` อีกครั้ง

### Q: CORS error
**A:** เพิ่ม frontend URL ใน `server.js` ที่ CORS config

### Q: Token invalid
**A:** Login ใหม่เพื่อได้ token ใหม่

---

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - คู่มือหลักและ API documentation
- [YOUTUBE_GUIDE.md](./YOUTUBE_GUIDE.md) - คู่มือใช้ YouTube แบบละเอียด
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - คู่มือ setup ทางเลือกอื่นๆ

---

**🎉 ระบบพร้อมใช้งานแล้ว! Happy Coding!**
