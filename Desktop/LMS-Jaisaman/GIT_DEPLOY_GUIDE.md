# 🚀 Deploy ผ่าน Git + Vercel/Railway/Render

## ขั้นตอนที่ 1: Push โปรเจ็คขึ้น GitHub

### 1.1 สร้าง Repository บน GitHub

1. ไปที่ https://github.com
2. คลิก "New repository" (ปุ่มสีเขียว)
3. ตั้งชื่อ repository เช่น `lms-project`
4. เลือก **Public** หรือ **Private**
5. **อย่า** เลือก "Initialize with README" (เพราะเรามีแล้ว)
6. คลิก "Create repository"

### 1.2 Push โค้ดขึ้น GitHub

```bash
# 1. เช็คสถานะ Git
git status

# 2. Add ไฟล์ทั้งหมด
git add .

# 3. Commit
git commit -m "Initial commit: LMS project"

# 4. เชื่อม GitHub repository (แก้ไข URL ให้ตรงกับของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/lms-project.git

# 5. Push ขึ้น GitHub
git push -u origin main
```

**หมายเหตุ:** ถ้า branch ชื่อ `master` ให้ใช้:
```bash
git branch -M main
git push -u origin main
```

---

## ขั้นตอนที่ 2: Deploy ด้วย Vercel (แนะนำ)

### 2.1 Deploy Backend

1. ไปที่ https://vercel.com
2. คลิก "Add New" > "Project"
3. Import GitHub repository ที่เพิ่ง push
4. ตั้งค่า:
   - **Framework Preset:** Other
   - **Root Directory:** `api`
   - **Build Command:** `npm install && npx prisma generate`
   - **Output Directory:** (ว่างไว้)
   - **Install Command:** `npm install`

5. เพิ่ม Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-random-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

6. คลิก "Deploy"

7. **บันทึก URL ที่ได้** เช่น `https://lms-api-xxx.vercel.app`

### 2.2 Setup Database

**ตัวเลือก 1: Supabase (แนะนำ)**
1. ไปที่ https://supabase.com
2. New Project
3. คัดลอก Connection String (URI)
4. ไปที่ Vercel > Project Settings > Environment Variables
5. แก้ไข `DATABASE_URL` ให้เป็น connection string จาก Supabase

**ตัวเลือก 2: Vercel Postgres**
1. ใน Vercel Project > Storage > Create Database
2. เลือก Postgres
3. Vercel จะตั้งค่า `DATABASE_URL` ให้อัตโนมัติ

### 2.3 Run Database Migrations

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd api
vercel link

# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy
```

### 2.4 Deploy Frontend

1. ใน Vercel Dashboard คลิก "Add New" > "Project"
2. เลือก repository เดียวกัน
3. ตั้งค่า:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. เพิ่ม Environment Variables:
   ```
   VITE_API_URL=https://lms-api-xxx.vercel.app
   ```

5. คลิก "Deploy"

6. **บันทึก URL ที่ได้** เช่น `https://lms-frontend-xxx.vercel.app`

### 2.5 อัปเดต CORS

1. กลับไปที่ Backend Project
2. Settings > Environment Variables
3. แก้ไข `FRONTEND_URL` เป็น `https://lms-frontend-xxx.vercel.app`
4. Redeploy: Deployments > คลิก "..." > Redeploy

---

## ขั้นตอนที่ 3: Deploy ด้วย Railway (ทางเลือก)

### 3.1 Deploy ทั้ง Backend + Frontend + Database

1. ไปที่ https://railway.app
2. "New Project" > "Deploy from GitHub repo"
3. เลือก repository
4. Railway จะ detect และสร้าง 2 services:
   - `api` (Backend)
   - `frontend` (Frontend)

### 3.2 เพิ่ม PostgreSQL

1. คลิก "+ New" > "Database" > "Add PostgreSQL"
2. Railway จะสร้าง `DATABASE_URL` ให้อัตโนมัติ

### 3.3 ตั้งค่า Environment Variables

**Backend Service:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-random-secret
FRONTEND_URL=${{frontend.url}}
NODE_ENV=production
```

**Frontend Service:**
```
VITE_API_URL=${{api.url}}
```

### 3.4 ตั้งค่า Build Commands

**Backend:**
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start Command: `npm start`
- Root Directory: `/api`

**Frontend:**
- Build Command: `npm run build`
- Start Command: (ว่างไว้ - Railway จะ serve static files)
- Root Directory: `/frontend`

---

## ขั้นตอนที่ 4: Deploy ด้วย Render (ทางเลือก)

### 4.1 Deploy Backend

1. ไปที่ https://render.com
2. "New" > "Web Service"
3. Connect GitHub repository
4. ตั้งค่า:
   - Name: `lms-api`
   - Root Directory: `api`
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

5. เพิ่ม Environment Variables

### 4.2 เพิ่ม PostgreSQL

1. "New" > "PostgreSQL"
2. คัดลอก Internal Database URL
3. เพิ่มใน Backend Environment Variables

### 4.3 Deploy Frontend

1. "New" > "Static Site"
2. ตั้งค่า:
   - Name: `lms-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

3. เพิ่ม Environment Variables

---

## 🎉 เสร็จแล้ว!

### Auto-Deploy
ทุกครั้งที่คุณ push code ใหม่ขึ้น GitHub:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel/Railway/Render จะ **auto-deploy** ให้อัตโนมัติ!

### ตรวจสอบ Deployment

1. ✅ Frontend เข้าถึงได้: `https://your-frontend.vercel.app`
2. ✅ API ทำงาน: `https://your-api.vercel.app/health`
3. ✅ Database เชื่อมต่อสำเร็จ
4. ✅ Login/Register ทำงานได้

---

## 🔧 Troubleshooting

### ปัญหา: Build Failed

**แก้ไข:**
1. ตรวจสอบ Build Logs
2. ตรวจสอบ `package.json` ว่ามี scripts ครบ
3. ตรวจสอบ Node version (ใช้ 18+)

### ปัญหา: Database Connection Error

**แก้ไข:**
1. ตรวจสอบ `DATABASE_URL` ถูกต้อง
2. Run migrations: `npx prisma migrate deploy`
3. ตรวจสอบ Database ยังทำงานอยู่

### ปัญหา: CORS Error

**แก้ไข:**
1. ตรวจสอบ `FRONTEND_URL` ใน Backend
2. ตรวจสอบ `VITE_API_URL` ใน Frontend
3. Redeploy Backend

### ปัญหา: File Upload ไม่ทำงาน

**แก้ไข:**
- Vercel ไม่รองรับ file system
- ใช้ Cloudinary แทน (ดูใน DEPLOYMENT.md)

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs

---

## 💡 Tips

1. **Custom Domain:** ตั้งค่าได้ใน Dashboard > Settings > Domains
2. **Environment Variables:** แก้ไขได้ตลอดเวลา แล้ว redeploy
3. **Logs:** ดูได้ใน Dashboard > Deployments > View Logs
4. **Rollback:** ย้อนกลับไปเวอร์ชันเก่าได้ใน Deployments
