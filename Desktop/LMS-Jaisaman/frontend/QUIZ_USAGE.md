# คู่มือการใช้งาน Quiz System

## ภาพรวม
ระบบแบบทดสอบ (Quiz) ที่สร้างขึ้นประกอบด้วย:

### คอมโพเนนต์
1. **QuizCard.vue** - แสดงการ์ดแบบทดสอบพร้อมข้อมูลสรุป
2. **QuizQuestion.vue** - แสดงคำถามและตัวเลือกคำตอบ

### หน้าจอ (Views)
1. **LessonQuizzes.vue** - หน้าแสดงรายการแบบทดสอบในบทเรียน (สำหรับนักเรียน)
2. **QuizTake.vue** - หน้าทำแบบทดสอบ
3. **QuizManage.vue** - หน้าจัดการแบบทดสอบ (สำหรับผู้สอน)

## การใช้งาน

### สำหรับนักเรียน

#### 1. ดูรายการแบบทดสอบ
```javascript
// นำทางไปยังหน้ารายการแบบทดสอบ
router.push({ 
  name: 'LessonQuizzes', 
  params: { lessonId: 'lesson-id' } 
})
```

#### 2. เริ่มทำแบบทดสอบ
```javascript
// นำทางไปยังหน้าทำแบบทดสอบ
router.push({ 
  name: 'QuizTake', 
  params: { quizId: 'quiz-id' } 
})
```

### สำหรับผู้สอน

#### 1. จัดการแบบทดสอบ
```javascript
// นำทางไปยังหน้าจัดการแบบทดสอบ
router.push({ 
  name: 'QuizManage', 
  params: { lessonId: 'lesson-id' } 
})
```

## ตัวอย่างการเพิ่มปุ่มในหน้าบทเรียน

### เพิ่มในหน้า CourseLessons.vue หรือ CourseLearn.vue

```vue
<template>
  <!-- ในส่วนของแต่ละบทเรียน -->
  <div class="lesson-item">
    <h3>{{ lesson.title }}</h3>
    
    <!-- ปุ่มสำหรับนักเรียน -->
    <button 
      v-if="userRole === 'STUDENT'"
      @click="goToQuizzes(lesson.id)"
      class="btn-quiz"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      แบบทดสอบ
    </button>

    <!-- ปุ่มสำหรับผู้สอน -->
    <button 
      v-if="userRole === 'INSTRUCTOR' || userRole === 'ADMIN'"
      @click="manageQuizzes(lesson.id)"
      class="btn-manage-quiz"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      จัดการแบบทดสอบ
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref('STUDENT') // ดึงจาก localStorage หรือ store

const goToQuizzes = (lessonId) => {
  router.push({ name: 'LessonQuizzes', params: { lessonId } })
}

const manageQuizzes = (lessonId) => {
  router.push({ name: 'QuizManage', params: { lessonId } })
}
</script>
```

## ฟีเจอร์ที่รองรับ

### ประเภทคำถาม
1. **Multiple Choice** (ปรนัย) - เลือกตอบ 1 ข้อจากหลายตัวเลือก
2. **True/False** (ถูก/ผิด) - เลือกว่าข้อความถูกหรือผิด
3. **Short Answer** (อัตนัย) - พิมพ์คำตอบสั้นๆ

### ฟีเจอร์หลัก
- ⏱️ จำกัดเวลาทำแบบทดสอบ
- 📊 แสดงคะแนนและผลลัพธ์ทันที
- ✅ ตรวจคำตอบอัตโนมัติ (สำหรับปรนัยและถูก/ผิด)
- 📈 เก็บประวัติการทำแบบทดสอบ
- 🔄 ทำแบบทดสอบซ้ำได้
- 📝 แสดงเฉลยหลังส่งคำตอบ
- 🎯 กำหนดคะแนนผ่าน

## API Endpoints ที่ใช้

```javascript
// ดูรายการแบบทดสอบ
GET /api/lessons/:lessonId/quizzes

// สร้างแบบทดสอบ (ผู้สอน)
POST /api/lessons/:lessonId/quizzes

// เริ่มทำแบบทดสอบ
POST /api/quizzes/:quizId/start

// ส่งคำตอบ
POST /api/attempts/:attemptId/submit

// ดูประวัติการทำแบบทดสอบ
GET /api/quizzes/:quizId/attempts

// ลบแบบทดสอบ (ผู้สอน)
DELETE /api/quizzes/:id
```

## Routes ที่เพิ่มเข้ามา

```javascript
{
  path: '/lessons/:lessonId/quizzes',
  name: 'LessonQuizzes',
  component: () => import('../views/LessonQuizzes.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/lessons/:lessonId/quizzes/manage',
  name: 'QuizManage',
  component: () => import('../views/QuizManage.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/quizzes/:quizId/take',
  name: 'QuizTake',
  component: () => import('../views/QuizTake.vue'),
  meta: { requiresAuth: true }
}
```

## การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขคลาส Tailwind ในไฟล์ Vue:
- `bg-blue-600` → สีหลัก
- `text-blue-600` → สีข้อความ
- `border-blue-500` → สีขอบ

### เพิ่มฟีเจอร์
1. เพิ่มประเภทคำถามใหม่ใน QuizQuestion.vue
2. อัพเดทการตรวจคำตอบใน QuizTake.vue
3. เพิ่มฟิลด์ในฟอร์มสร้างแบบทดสอบใน QuizManage.vue
