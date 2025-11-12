# 🚀 Deploy บน GitHub Pages

## ⚠️ ข้อจำกัดของ GitHub Pages

GitHub Pages รองรับเฉพาะ **Static Website** (HTML, CSS, JS) เท่านั้น
- ✅ Deploy **Frontend** ได้
- ❌ Deploy **Backend** ไม่ได้ (ต้องใช้ Vercel, Railway, Render)

---

## วิธีที่ 1: Deploy Frontend บน GitHub Pages (แนะนำ)

### ขั้นตอนที่ 1: Enable GitHub Pages

1. ไปที่ repository: https://github.com/Apichaisorayan/lms-project
2. คลิก **Settings** (แท็บด้านบน)
3. เลื่อนลงไปหา **Pages** (เมนูด้านซ้าย)
4. ใน **Source** เลือก:
   - Source: **GitHub Actions**
5. บันทึก

### ขั้นตอนที่ 2: Push การเปลี่ยนแปลง

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

### ขั้นตอนที่ 3: รอ Deploy

1. ไปที่ **Actions** tab ใน GitHub
2. รอให้ workflow สีเขียว (ประมาณ 2-3 นาที)
3. Frontend จะพร้อมใช้งานที่:
   ```
   https://apichaisorayan.github.io/lms-project/
   ```

---

## วิธีที่ 2: Deploy ทั้ง Frontend + Backend (แนะนำมากกว่า)

เนื่องจาก GitHub Pages ไม่รองรับ Backend ควรใช้:

### A. Vercel (ฟรี, ง่ายที่สุด)

**Deploy Backend:**
1. ไปที่ https://vercel.com
2. Sign up ด้วย GitHub
3. "Add New" > "Project"
4. Import `lms-project`
5. ตั้งค่า:
   - Root Directory: `api`
   - Framework Preset: Other
   - Build Command: `npm install && npx prisma generate`
   - Install Command: `npm install`
6. เพิ่ม Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   FRONTEND_URL=https://apichaisorayan.github.io/lms-project
   ```
7. Deploy

**Deploy Frontend:**
1. "Add New" > "Project"
2. Import `lms-project` อีกครั้ง
3. ตั้งค่า:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. เพิ่ม Environment Variables:
   ```
   VITE_API_URL=https://your-api.vercel.app
   ```
5. Deploy

### B. Railway (ฟรี, ง่าย, มี Database)

1. ไปที่ https://railway.app
2. "New Project" > "Deploy from GitHub repo"
3. เลือก `lms-project`
4. Railway จะ detect และสร้าง 2 services อัตโนมัติ
5. เพิ่ม PostgreSQL database
6. ตั้งค่า Environment Variables
7. Deploy

---

## 🎯 แนะนำ: ใช้ Vercel สำหรับทั้ง Frontend + Backend

**ทำไม?**
- ✅ ฟรี
- ✅ Deploy ทั้ง Frontend และ Backend ได้
- ✅ Auto-deploy เมื่อ push code
- ✅ ได้ HTTPS ฟรี
- ✅ มี Database (Vercel Postgres)
- ✅ ง่ายกว่า GitHub Pages

---

## 📊 เปรียบเทียบ

| Platform | Frontend | Backend | Database | ราคา |
|----------|----------|---------|----------|------|
| GitHub Pages | ✅ | ❌ | ❌ | ฟรี |
| Vercel | ✅ | ✅ | ✅ | ฟรี |
| Railway | ✅ | ✅ | ✅ | ฟรี $5/เดือน |
| Render | ✅ | ✅ | ✅ | ฟรี |

---

## 🚀 Quick Start: Deploy ด้วย Vercel

```bash
# 1. ติดตั้ง Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy Backend
cd api
vercel

# 4. Deploy Frontend
cd ../frontend
vercel
```

---

## 💡 คำแนะนำ

ถ้าต้องการ:
- **แค่ทดสอบ Frontend** → ใช้ GitHub Pages
- **ใช้งานจริง (มี Backend)** → ใช้ Vercel หรือ Railway

---

## 🆘 ต้องการความช่วยเหลือ?

บอกผมว่าต้องการ deploy แบบไหน:
1. GitHub Pages (แค่ Frontend)
2. Vercel (Frontend + Backend)
3. Railway (Frontend + Backend + Database)

ผมจะแนะนำทีละขั้นตอน!
