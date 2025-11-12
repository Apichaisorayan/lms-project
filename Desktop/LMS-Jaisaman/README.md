# 🎓 LMS (Learning Management System)

ระบบจัดการการเรียนรู้ออนไลน์ที่สมบูรณ์แบบ พัฒนาด้วย Vue.js และ Express.js

## ✨ Features

- 🔐 ระบบ Authentication (Login/Register + OAuth)
- 👥 จัดการผู้ใช้ 3 ระดับ (Admin, Instructor, Student)
- 📚 จัดการคอร์สเรียน
- 📖 บทเรียนพร้อมวิดีโอ
- 📝 ระบบ Quiz และแบบทดสอบ
- 📊 ติดตามความคืบหน้าการเรียน
- 🎓 ออกใบประกาศนียบัตร
- 📤 อัปโหลดไฟล์ (รูปภาพ, วิดีโอ, เอกสาร)
- 🔗 OAuth (Google, Facebook)

## 🛠️ Tech Stack

### Frontend
- Vue 3 + Vite
- Vue Router
- Axios
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL / SQLite
- JWT Authentication
- Passport.js (OAuth)
- Multer (File Upload)

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL (สำหรับ production) หรือ SQLite (สำหรับ development)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd LMS-Jaisaman
```

### 2. Setup Backend
```bash
cd api
npm install
cp .env.example .env
# แก้ไข .env ตามต้องการ
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 🚀 Deployment

อ่านคู่มือการ deploy ได้ที่:
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Deploy ด้วย Vercel (แนะนำ)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy แบบละเอียด (ทุกวิธี)

### Quick Deploy with Vercel

```bash
# Deploy Backend
cd api
vercel

# Deploy Frontend
cd ../frontend
vercel
```

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
```

### Frontend (.env)
```
VITE_API_URL="http://localhost:5000"
```

## 📖 API Documentation

API endpoint documentation:
- `GET /api/courses` - ดึงรายการคอร์สทั้งหมด
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก
- และอื่นๆ...

## 🤝 Contributing

Pull requests are welcome!

## 📄 License

MIT License
