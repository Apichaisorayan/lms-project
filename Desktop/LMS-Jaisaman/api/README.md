# LMS API Backend

Backend API สำหรับระบบ Learning Management System

## Tech Stack
- Node.js + Express
- Prisma ORM
- SQLite Database
- JWT Authentication

## Setup

1. ติดตั้ง dependencies:
```bash
npm install
```

2. สร้าง database และ generate Prisma client:
```bash
npm run prisma:generate
npm run prisma:migrate
```

3. รัน development server:
```bash
npm run dev
```

Server จะรันที่ `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

### Courses
- `GET /api/courses` - ดูคอร์สทั้งหมด
- `GET /api/courses/:id` - ดูรายละเอียดคอร์ส
- `POST /api/courses` - สร้างคอร์ส (Instructor only)
- `PUT /api/courses/:id` - แก้ไขคอร์ส (Instructor only)
- `DELETE /api/courses/:id` - ลบคอร์ส (Instructor only)

### Enrollments
- `GET /api/enrollments/my` - ดูคอร์สที่ลงทะเบียน
- `POST /api/enrollments` - ลงทะเบียนคอร์ส

### Progress
- `GET /api/progress/course/:courseId` - ดูความคืบหน้าในคอร์ส
- `POST /api/progress` - บันทึกความคืบหน้า

## Database Schema

- User (นักเรียน, ผู้สอน, แอดมิน)
- Course (คอร์สเรียน)
- Lesson (บทเรียน)
- Enrollment (การลงทะเบียน)
- Progress (ความคืบหน้า)
- Certificate (ใบประกาศนียบัตร)
