# ตัวอย่างการผสานระบบ Quiz เข้ากับหน้าที่มีอยู่

## วิธีที่ 1: ใช้ LessonItem Component

### ในหน้า CourseLessons.vue หรือหน้าที่แสดงรายการบทเรียน

```vue
<template>
  <div class="lessons-container">
    <h2>บทเรียนทั้งหมด</h2>
    
    <!-- ใช้ LessonItem component -->
    <LessonItem
      v-for="lesson in lessons"
      :key="lesson.id"
      :lesson="lesson"
      :show-quiz-button="true"
      :is-instructor="isInstructor"
      :can-edit="isInstructor"
      :can-delete="isInstructor"
      @learn="goToLesson"
      @quiz="goToQuizzes"
      @manageQuiz="manageQuizzes"
      @edit="editLesson"
      @delete="deleteLesson"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import LessonItem from '../components/LessonItem.vue'

const router = useRouter()
const lessons = ref([])
const user = ref(null)

const isInstructor = computed(() => {
  return user.value?.role === 'INSTRUCTOR' || user.value?.role === 'ADMIN'
})

const goToLesson = (lessonId) => {
  router.push({ name: 'CourseLearn', params: { id: lessonId } })
}

const goToQuizzes = (lessonId) => {
  router.push({ name: 'LessonQuizzes', params: { lessonId } })
}

const manageQuizzes = (lessonId) => {
  router.push({ name: 'QuizManage', params: { lessonId } })
}

const editLesson = (lessonId) => {
  // โค้ดแก้ไขบทเรียน
}

const deleteLesson = (lessonId) => {
  // โค้ดลบบทเรียน
}
</script>
```

## วิธีที่ 2: เพิ่มปุ่มในหน้าที่มีอยู่แล้ว

### ตัวอย่างการเพิ่มในหน้า CourseLearn.vue

```vue
<template>
  <div class="course-learn">
    <!-- เนื้อหาเดิม -->
    
    <!-- เพิ่มส่วนแบบทดสอบ -->
    <div class="quiz-section mt-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">แบบทดสอบ</h3>
        <button
          v-if="isInstructor"
          @click="manageQuizzes"
          class="text-blue-600 hover:text-blue-700"
        >
          จัดการแบบทดสอบ
        </button>
      </div>
      
      <button
        @click="goToQuizzes"
        class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        ทำแบบทดสอบ
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isInstructor = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'INSTRUCTOR' || user.role === 'ADMIN'
})

const goToQuizzes = () => {
  router.push({ 
    name: 'LessonQuizzes', 
    params: { lessonId: route.params.lessonId } 
  })
}

const manageQuizzes = () => {
  router.push({ 
    name: 'QuizManage', 
    params: { lessonId: route.params.lessonId } 
  })
}
</script>
```

## วิธีที่ 3: เพิ่มเมนูใน Sidebar หรือ Navigation

```vue
<template>
  <nav class="sidebar">
    <ul>
      <li>
        <router-link :to="{ name: 'Dashboard' }">
          หน้าหลัก
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Courses' }">
          คอร์สเรียน
        </router-link>
      </li>
      
      <!-- เพิ่มเมนูแบบทดสอบ -->
      <li v-if="currentLesson">
        <router-link 
          :to="{ name: 'LessonQuizzes', params: { lessonId: currentLesson.id } }"
          class="flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          แบบทดสอบ
        </router-link>
      </li>
    </ul>
  </nav>
</template>
```

## วิธีที่ 4: เพิ่มแท็บในหน้าคอร์ส

```vue
<template>
  <div class="course-detail">
    <!-- Tabs -->
    <div class="tabs border-b">
      <button 
        @click="activeTab = 'lessons'"
        :class="{ active: activeTab === 'lessons' }"
      >
        บทเรียน
      </button>
      <button 
        @click="activeTab = 'quizzes'"
        :class="{ active: activeTab === 'quizzes' }"
      >
        แบบทดสอบ
      </button>
      <button 
        @click="activeTab = 'about'"
        :class="{ active: activeTab === 'about' }"
      >
        เกี่ยวกับ
      </button>
    </div>

    <!-- Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'lessons'">
        <!-- แสดงบทเรียน -->
      </div>
      
      <div v-if="activeTab === 'quizzes'">
        <!-- แสดงแบบทดสอบทั้งหมดในคอร์ส -->
        <div v-for="lesson in lessons" :key="lesson.id">
          <h3>{{ lesson.title }}</h3>
          <button @click="goToQuizzes(lesson.id)">
            ดูแบบทดสอบ
          </button>
        </div>
      </div>
      
      <div v-if="activeTab === 'about'">
        <!-- แสดงรายละเอียดคอร์ส -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('lessons')
const lessons = ref([])

const goToQuizzes = (lessonId) => {
  router.push({ name: 'LessonQuizzes', params: { lessonId } })
}
</script>
```

## การดึงข้อมูล User Role

```javascript
// ใน component ใดๆ
import { ref, onMounted } from 'vue'

const user = ref(null)
const isInstructor = ref(false)

onMounted(() => {
  // วิธีที่ 1: จาก localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  user.value = userData
  isInstructor.value = userData.role === 'INSTRUCTOR' || userData.role === 'ADMIN'

  // วิธีที่ 2: จาก API
  // const token = localStorage.getItem('token')
  // const response = await fetch('http://localhost:3000/api/auth/me', {
  //   headers: { 'Authorization': `Bearer ${token}` }
  // })
  // user.value = await response.json()
})
```

## การตรวจสอบว่ามีแบบทดสอบหรือไม่

```javascript
const checkQuizzes = async (lessonId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}/quizzes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const quizzes = await response.json()
    return quizzes.length > 0
  } catch (error) {
    console.error('Error checking quizzes:', error)
    return false
  }
}

// ใช้งาน
const hasQuizzes = await checkQuizzes(lessonId)
if (hasQuizzes) {
  // แสดงปุ่มแบบทดสอบ
}
```

## สไตล์ CSS เพิ่มเติม

```css
/* ปุ่มแบบทดสอบ */
.btn-quiz {
  @apply bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2;
}

/* ปุ่มจัดการแบบทดสอบ */
.btn-manage-quiz {
  @apply bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2;
}

/* Badge แสดงจำนวนแบบทดสอบ */
.quiz-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800;
}

/* สถานะผ่าน/ไม่ผ่าน */
.status-passed {
  @apply text-green-600 font-semibold;
}

.status-failed {
  @apply text-red-600 font-semibold;
}
```
