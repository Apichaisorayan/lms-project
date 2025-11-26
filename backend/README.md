# Learning Platform API

Backend API สำหรับระบบเรียนออนไลน์ ใช้ Hono + Cloudflare Workers + D1 + R2

## 🚀 Setup

### 1. ติดตั้ง dependencies
```bash
cd backend
npm install
```

### 2. สร้าง D1 Database
```bash
npx wrangler d1 create learning_platform
```
คัดลอก `database_id` ที่ได้ไปแทนใน `wrangler.toml`

### 3. สร้าง tables
```bash
npx wrangler d1 execute learning_platform --file=schema.sql
```

### 4. สร้าง R2 Bucket
```bash
npx wrangler r2 bucket create learning-videos
```

### 5. ตั้งค่า Environment Variables
แก้ไขใน `wrangler.toml`:
- `IMGBB_API_KEY` - สมัครฟรีที่ https://api.imgbb.com/
- `JWT_SECRET` - เปลี่ยนเป็น random string ยาวๆ
- `R2_PUBLIC_URL` - URL สำหรับเข้าถึง R2 bucket (หรือใช้ Cloudflare Workers URL)

### 6. รัน Development Server
```bash
npm run dev
```
API จะรันที่ `http://localhost:8787`

### 7. Deploy to Production
```bash
npm run deploy
```

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - สมัครสมาชิก
  ```json
  { "email": "user@example.com", "password": "123456", "name": "John Doe", "role": "STUDENT" }
  ```
- `POST /api/auth/login` - เข้าสู่ระบบ
  ```json
  { "email": "user@example.com", "password": "123456" }
  ```

### 📖 Courses
- `GET /api/courses?published=true` - ดูคอร์สทั้งหมด
- `GET /api/courses/:id` - ดูคอร์สเดียว (พร้อม lessons)
- `POST /api/courses` - สร้างคอร์ส (INSTRUCTOR only)
- `PUT /api/courses/:id` - แก้ไขคอร์ส
- `DELETE /api/courses/:id` - ลบคอร์ส

### 📝 Lessons
- `GET /api/courses/:courseId/lessons` - ดูบทเรียนในคอร์ส
- `POST /api/courses/:courseId/lessons` - สร้างบทเรียน
- `PUT /api/lessons/:id` - แก้ไขบทเรียน
- `DELETE /api/lessons/:id` - ลบบทเรียน

### 📄 Resources (เอกสารประกอบ)
- `GET /api/lessons/:lessonId/resources` - ดูเอกสารในบทเรียน
- `POST /api/lessons/:lessonId/resources` - เพิ่มเอกสาร
- `DELETE /api/resources/:id` - ลบเอกสาร

### 📝 Quizzes
- `GET /api/lessons/:lessonId/quizzes` - ดูแบบทดสอบในบทเรียน
- `POST /api/lessons/:lessonId/quizzes` - สร้างแบบทดสอบ (พร้อม questions และ choices)
- `DELETE /api/quizzes/:id` - ลบแบบทดสอบ

### ✅ Quiz Attempts
- `GET /api/quizzes/:quizId/attempts` - ดูประวัติการทำแบบทดสอบ
- `POST /api/quizzes/:quizId/start` - เริ่มทำแบบทดสอบ
- `POST /api/attempts/:attemptId/submit` - ส่งคำตอบ

### 🎓 Enrollments
- `GET /api/enrollments` - ดูคอร์สที่ลงทะเบียน
- `POST /api/courses/:courseId/enroll` - ลงทะเบียนเรียน
- `GET /api/my-courses` - ดูคอร์สของฉัน

### 📊 Progress
- `GET /api/courses/:courseId/progress` - ดูความคืบหน้าในคอร์ส
- `POST /api/lessons/:lessonId/complete` - ทำเครื่องหมายบทเรียนเสร็จ

### 💬 Comments
- `GET /api/lessons/:lessonId/comments` - ดูความคิดเห็นในบทเรียน
- `POST /api/lessons/:lessonId/comments` - เพิ่มความคิดเห็น
- `DELETE /api/comments/:id` - ลบความคิดเห็น

### 📤 Upload
- `POST /api/upload` - อัพโหลดรูปภาพ (ImgBB)
- `POST /api/upload/video` - อัพโหลดวิดีโอ (R2)
- `POST /api/upload/document` - อัพโหลดเอกสาร (R2)
- `GET /api/files/:path` - ดาวน์โหลดไฟล์จาก R2

## 🗄️ Database Schema

### Users
- id, email, password, name, role (STUDENT/INSTRUCTOR)

### Courses
- id, title, description, thumbnail, price, published, instructor_id

### Lessons
- id, course_id, title, content, video_url, order_index, duration

### Resources
- id, lesson_id, name, file_url, file_type, file_size

### Quizzes
- id, lesson_id, title, description, passing_score, time_limit

### Questions
- id, quiz_id, question, type, points, order_index

### Choices
- id, question_id, text, is_correct, order_index

### Quiz_Attempts
- id, user_id, quiz_id, started_at, submitted_at, score, passed

### Answers
- id, attempt_id, question_id, answer, is_correct

### Enrollments
- id, user_id, course_id, enrolled_at

### Progress
- id, user_id, lesson_id, completed, completed_at

### Comments
- id, user_id, lesson_id, content, likes, created_at

## 💰 ค่าใช้จ่าย (ฟรีทั้งหมด!)

- **Cloudflare Workers**: ฟรี 100,000 requests/วัน
- **Cloudflare D1**: ฟรี 5GB storage + 5M reads/วัน
- **Cloudflare R2**: ฟรี 10GB storage + ไม่จำกัด bandwidth
- **ImgBB**: ฟรี unlimited uploads (มี rate limit)

## 🔧 Development Tips

### ทดสอบ API ด้วย curl
```bash
# Register
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User","role":"STUDENT"}'

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### ดู Database
```bash
npx wrangler d1 execute learning_platform --command "SELECT * FROM users"
```

### ลบข้อมูลทั้งหมด (ระวัง!)
```bash
npx wrangler d1 execute learning_platform --file=schema.sql
```

## 🐛 Troubleshooting

**ปัญหา: Database not found**
- ตรวจสอบว่า `database_id` ใน `wrangler.toml` ถูกต้อง
- รัน `npx wrangler d1 list` เพื่อดู database ทั้งหมด

**ปัญหา: R2 bucket not found**
- รัน `npx wrangler r2 bucket list` เพื่อดู buckets
- สร้าง bucket ใหม่ด้วย `npx wrangler r2 bucket create learning-videos`

**ปัญหา: CORS error**
- เพิ่ม frontend URL ใน CORS config ใน `server.js`

## 📝 License

MIT
