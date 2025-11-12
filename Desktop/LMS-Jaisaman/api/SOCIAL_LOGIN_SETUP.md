# 🔐 Social Login Setup Guide

## ขั้นตอนการตั้งค่า Social Authentication

### 1. ติดตั้ง Dependencies

```bash
cd api
npm install passport passport-google-oauth20 passport-facebook
```

### 2. สร้าง Google OAuth App

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่หรือเลือก Project ที่มีอยู่
3. ไปที่ **APIs & Services** > **Credentials**
4. คลิก **Create Credentials** > **OAuth 2.0 Client ID**
5. เลือก Application type: **Web application**
6. ตั้งค่า:
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5000/api/auth/google/callback`
7. คัดลอก **Client ID** และ **Client Secret**

### 3. สร้าง Facebook OAuth App

1. ไปที่ [Facebook Developers](https://developers.facebook.com/)
2. คลิก **My Apps** > **Create App**
3. เลือก **Consumer** > **Next**
4. กรอกชื่อ App และอีเมล
5. ไปที่ **Settings** > **Basic**
6. คัดลอก **App ID** และ **App Secret**
7. ไปที่ **Facebook Login** > **Settings**
8. เพิ่ม **Valid OAuth Redirect URIs**: `http://localhost:5000/api/auth/facebook/callback`

### 4. อัปเดต .env

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id-here"
FACEBOOK_APP_SECRET="your-facebook-app-secret-here"
FACEBOOK_CALLBACK_URL="http://localhost:5000/api/auth/facebook/callback"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### 5. เพิ่ม Provider ใน Prisma Schema

```prisma
model User {
  // ... existing fields
  provider     String?  // 'local', 'google', 'facebook'
  providerId   String?  // ID from OAuth provider
}
```

จากนั้นรัน:
```bash
npx prisma migrate dev --name add_oauth_fields
```

### 6. เพิ่ม Passport Configuration

สร้างไฟล์ `api/config/passport.js` (ดูในโค้ดที่สร้างให้)

### 7. อัปเดต server.js

เพิ่ม Passport middleware และ OAuth routes (ดูในโค้ดที่สร้างให้)

### 8. อัปเดต Frontend

ปุ่ม Social Login จะเปลี่ยนจาก:
```javascript
<button onClick={handleGoogleLogin}>
```

เป็น:
```javascript
<a href="http://localhost:5000/api/auth/google">
```

### 9. ทดสอบ

1. รัน Backend: `cd api && npm start`
2. รัน Frontend: `cd frontend && npm run dev`
3. คลิกปุ่ม "Google" หรือ "Facebook" ในหน้า Login/Register
4. ระบบจะ redirect ไปยัง Google/Facebook
5. หลังจาก authorize จะกลับมาพร้อม token

### 🔒 Security Notes

- ใช้ HTTPS ใน production
- เก็บ secrets ใน environment variables
- ตั้งค่า CORS อย่างถูกต้อง
- Validate redirect URLs
- ใช้ state parameter เพื่อป้องกัน CSRF

### 📚 Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)
