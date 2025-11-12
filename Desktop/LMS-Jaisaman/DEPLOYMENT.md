# คู่มือ Deploy โปรเจ็ค LMS

## เตรียมโปรเจ็คก่อน Deploy

### 1. ตั้งค่า Database
- เปลี่ยนจาก SQLite เป็น PostgreSQL (แนะนำสำหรับ production)
- หรือใช้ Turso (SQLite cloud) ถ้าต้องการใช้ SQLite

### 2. Environment Variables ที่ต้องตั้งค่า

**Backend (.env):**
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secure-random-string"
PORT=5000
FRONTEND_URL="https://your-frontend-url.vercel.app"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="https://your-api-url.vercel.app/api/auth/google/callback"
FACEBOOK_APP_ID="..."
FACEBOOK_APP_SECRET="..."
FACEBOOK_CALLBACK_URL="https://your-api-url.vercel.app/api/auth/facebook/callback"
```

**Frontend (.env):**
```
VITE_API_URL="https://your-api-url.vercel.app"
```

---

## วิธีที่ 1: Deploy ด้วย Vercel (แนะนำ)

### Deploy Frontend

1. ติดตั้ง Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy Frontend:
```bash
cd frontend
vercel
```

3. ตอบคำถาม:
- Set up and deploy? `Y`
- Which scope? เลือก account ของคุณ
- Link to existing project? `N`
- Project name? `lms-frontend`
- Directory? `./`
- Override settings? `N`

4. ตั้งค่า Environment Variables ใน Vercel Dashboard:
- ไปที่ Project Settings > Environment Variables
- เพิ่ม `VITE_API_URL`

5. Deploy production:
```bash
vercel --prod
```

### Deploy Backend

1. Deploy API:
```bash
cd ../api
vercel
```

2. ตั้งค่า Environment Variables ใน Vercel Dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- OAuth credentials (ถ้ามี)

3. เพิ่มไฟล์ `vercel.json` (ดูด้านล่าง)

4. Deploy production:
```bash
vercel --prod
```

---

## วิธีที่ 2: Deploy ด้วย Railway

### ขั้นตอน:

1. สมัคร Railway: https://railway.app
2. เชื่อม GitHub repository
3. สร้าง New Project > Deploy from GitHub
4. เลือก repository ของคุณ
5. Railway จะ detect และ deploy อัตโนมัติ

### ตั้งค่า:

1. เพิ่ม PostgreSQL:
- คลิก "+ New" > Database > PostgreSQL
- Railway จะสร้าง `DATABASE_URL` ให้อัตโนมัติ

2. ตั้งค่า Environment Variables:
- ไปที่ Variables tab
- เพิ่มตัวแปรทั้งหมดตามด้านบน

3. ตั้งค่า Build Command:
```
Frontend: npm run build
Backend: npm install && npx prisma generate && npx prisma migrate deploy
```

4. ตั้งค่า Start Command:
```
Frontend: (ไม่ต้องตั้ง - Railway จะ serve static files)
Backend: npm start
```

---

## วิธีที่ 3: Deploy ด้วย Render

### Deploy Backend:

1. สมัคร Render: https://render.com
2. New > Web Service
3. เชื่อม GitHub repository
4. ตั้งค่า:
   - Name: `lms-api`
   - Root Directory: `api`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

5. เพิ่ม PostgreSQL:
   - New > PostgreSQL
   - เชื่อม `DATABASE_URL` กับ Web Service

6. ตั้งค่า Environment Variables

### Deploy Frontend:

1. New > Static Site
2. ตั้งค่า:
   - Name: `lms-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. ตั้งค่า Environment Variables

---

## ไฟล์เพิ่มเติมที่ต้องสร้าง

### api/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### frontend/.env.production
```
VITE_API_URL=https://your-api-url.vercel.app
```

---

## เปลี่ยน Database จาก SQLite เป็น PostgreSQL

1. แก้ไข `api/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // เปลี่ยนจาก "sqlite"
  url      = env("DATABASE_URL")
}
```

2. สร้าง Database ใหม่:
- Railway: เพิ่ม PostgreSQL service
- Render: สร้าง PostgreSQL database
- Supabase: ใช้ฟรี PostgreSQL

3. Run migrations:
```bash
npx prisma migrate deploy
```

---

## ตรวจสอบหลัง Deploy

1. ✅ Frontend เข้าถึงได้ผ่าน HTTPS
2. ✅ API ตอบกลับได้ (ทดสอบ `/health`)
3. ✅ Database เชื่อมต่อสำเร็จ
4. ✅ Login/Register ทำงานได้
5. ✅ Upload ไฟล์ทำงานได้
6. ✅ OAuth (Google/Facebook) ทำงานได้

---

## ปัญหาที่พบบ่อย

### 1. CORS Error
- ตรวจสอบ `FRONTEND_URL` ใน backend
- ตรวจสอบ CORS config ใน `server.js`

### 2. Database Connection Error
- ตรวจสอบ `DATABASE_URL`
- Run `npx prisma migrate deploy`

### 3. File Upload ไม่ทำงาน
- Vercel ไม่รองรับ file system
- ใช้ Cloudinary หรือ AWS S3 แทน

### 4. OAuth Redirect Error
- อัปเดต Callback URLs ใน Google/Facebook Console
- ตรวจสอบ `GOOGLE_CALLBACK_URL` และ `FACEBOOK_CALLBACK_URL`

---

## แนะนำเพิ่มเติม

1. **ใช้ CDN สำหรับไฟล์ Upload:**
   - Cloudinary (ฟรี 25GB)
   - AWS S3 + CloudFront
   - UploadThing

2. **ใช้ Database ฟรี:**
   - Supabase (PostgreSQL ฟรี)
   - PlanetScale (MySQL ฟรี)
   - Turso (SQLite cloud ฟรี)

3. **Monitor & Analytics:**
   - Vercel Analytics
   - Sentry (error tracking)
   - LogRocket (session replay)

---

## ลิงค์ที่เป็นประโยชน์

- Vercel: https://vercel.com
- Railway: https://railway.app
- Render: https://render.com
- Supabase: https://supabase.com
- Cloudinary: https://cloudinary.com
