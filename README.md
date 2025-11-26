# 🎓 Learning Platform - ระบบเรียนออนไลน์

ระบบจัดการเรียนการสอนออนไลน์แบบครบวงจร พัฒนาด้วย Vue.js + Cloudflare Workers + D1 Database

## ✨ Features

- 🔐 ระบบ Authentication (Login/Register)
- 📚 จัดการคอร์สเรียน (CRUD)
- 📝 บทเรียนพร้อมวิดีโอและเอกสารประกอบ
- ✅ ระบบแบบทดสอบ (Quiz) พร้อมตรวจคำตอบอัตโนมัติ
- 📊 ติดตามความก้าวหน้าการเรียน
- 👨‍🏫 โปรไฟล์ผู้สอนแบบละเอียด
- 💬 ระบบแสดงความคิดเห็น
- 🎓 ลงทะเบียนเรียนและจัดการคอร์ส
- 📱 Responsive Design

## 🚀 Tech Stack

### Frontend
- Vue 3 + Vite
- Vue Router
- Tailwind CSS
- Lucide Icons

### Backend
- Cloudflare Workers
- Hono Framework
- Cloudflare D1 (SQLite)
- ImgBB API (Image Upload)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm หรือ yarn
- Cloudflare Account (สำหรับ deploy)

### Setup

1. Clone repository
```bash
git clone <your-repo-url>
cd learning-platform
```

2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

3. Setup Environment Variables

**Backend** - สร้างไฟล์ `backend/.dev.vars`:
```env
IMGBB_API_KEY=your_imgbb_api_key
JWT_SECRET=your_super_secret_jwt_key_32_characters_long
```

**Frontend** - สร้างไฟล์ `frontend/.env`:
```env
VITE_API_URL=http://localhost:8787
```

4. Setup Database

```bash
cd backend
npx wrangler d1 create learning_platform
# คัดลอก database_id ไปใส่ใน wrangler.toml

# สร้างตาราง
npx wrangler d1 execute learning_platform --local --file=schema.sql
```

5. Run Development Servers

**Backend:**
```bash
cd backend
npm run dev
# รันที่ http://localhost:8787
```

**Frontend:**
```bash
cd frontend
npm run dev
# รันที่ http://localhost:5173
```

## 🌐 Deployment

### GitHub Actions (Automatic)

1. ตั้งค่า Secrets ใน GitHub Repository:
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
   - `VITE_API_URL` - URL ของ Backend (เช่น https://your-worker.workers.dev)
   - `CUSTOM_DOMAIN` (optional) - Custom domain สำหรับ frontend

2. Push code ไปที่ branch `main` หรือ `master`

3. GitHub Actions จะ deploy อัตโนมัติ:
   - Backend → Cloudflare Workers
   - Frontend → GitHub Pages

### Manual Deployment

**Backend:**
```bash
cd backend
npm run deploy
```

**Frontend:**
```bash
cd frontend
npm run build
# Upload ไฟล์ใน dist/ ไปที่ hosting ที่ต้องการ
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### Courses
- `GET /api/courses` - ดูคอร์สทั้งหมด
- `GET /api/courses/:id` - ดูคอร์สเดียว
- `POST /api/courses` - สร้างคอร์ส (INSTRUCTOR)
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
- `GET /api/enrollments` - ดูคอร์สที่ลงทะเบียน
- `POST /api/courses/:courseId/enroll` - ลงทะเบียนเรียน

### Instructor Profile
- `GET /api/instructor/profile` - ดูโปรไฟล์ของตัวเอง
- `POST /api/instructor/profile` - สร้าง/แก้ไขโปรไฟล์
- `GET /api/instructors/:userId/profile` - ดูโปรไฟล์ผู้สอน
- `GET /api/instructors` - ดูรายชื่อผู้สอนทั้งหมด

## 🎯 User Roles

- **STUDENT** - นักเรียน (ลงทะเบียนเรียน, ทำแบบทดสอบ, ติดตามความก้าวหน้า)
- **INSTRUCTOR** - ผู้สอน (สร้างคอร์ส, จัดการบทเรียน, สร้างแบบทดสอบ)

## 💰 Cost (ฟรีทั้งหมด!)

- Cloudflare Workers: ฟรี 100,000 requests/วัน
- Cloudflare D1: ฟรี 5GB storage
- GitHub Pages: ฟรี
- ImgBB: ฟรี unlimited uploads

## 📄 License

MIT

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Pull requests are welcome!

## 📧 Contact

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
