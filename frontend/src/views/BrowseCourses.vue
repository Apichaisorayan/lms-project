<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      <div class="p-6 border-b border-gray-200">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="bg-gradient-to-br from-primary to-orange-600 p-2 rounded-xl">
            <GraduationCap :size="24" class="text-white" />
          </div>
          <span class="text-xl font-bold text-gray-800">LearnHub</span>
        </router-link>
      </div>

      <nav class="p-4 space-y-2">
        <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
          <LayoutDashboard :size="20" />
          <span class="font-medium">แดชบอร์ด</span>
        </router-link>
        <router-link to="/browse" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-orange-600 text-white transition-all duration-200">
          <BookOpen :size="20" />
          <span class="font-medium">คอร์สทั้งหมด</span>
        </router-link>
        <router-link to="/my-courses" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
          <GraduationCap :size="20" />
          <span class="font-medium">คอร์สของฉัน</span>
        </router-link>
        <router-link to="/certificates" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200">
          <Award :size="20" />
          <span class="font-medium">ใบประกาศ</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full">
          <LogOut :size="20" />
          <span class="font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="px-8 py-4">
          <h1 class="text-2xl font-bold text-gray-800">สำรวจคอร์สเรียน</h1>
          <p class="text-sm text-gray-500 mt-1">ค้นหาและลงทะเบียนคอร์สที่คุณสนใจ</p>
        </div>
      </header>

      <main class="p-8">
        <!-- Filters -->
        <div class="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div class="flex items-center gap-4">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
              <input v-model="searchQuery" type="text" placeholder="ค้นหาคอร์ส..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <select v-model="filterEnrolled" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
              <option value="all">ทั้งหมด</option>
              <option value="enrolled">ลงทะเบียนแล้ว</option>
              <option value="not-enrolled">ยังไม่ได้ลงทะเบียน</option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in filteredCourses" :key="course.id" class="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div class="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
              <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <BookOpen :size="48" class="text-white opacity-50" />
              </div>
              <div v-if="course.isEnrolled" class="absolute top-3 right-3">
                <span class="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">ลงทะเบียนแล้ว</span>
              </div>
            </div>

            <div class="p-5">
              <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{{ course.title }}</h3>
              <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ course.description }}</p>

              <div class="flex items-center justify-between text-sm mb-4">
                <div class="flex items-center gap-2 text-gray-600">
                  <BookOpen :size="16" />
                  <span>{{ course._count?.lessons || 0 }} บทเรียน</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <Users :size="16" />
                  <span>{{ course._count?.enrollments || 0 }} คน</span>
                </div>
              </div>

              <button
                v-if="course.isEnrolled"
                @click="goToCourse(course.id)"
                class="w-full py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                เรียนต่อ
              </button>
              <button
                v-else
                @click="enrollCourse(course.id)"
                :disabled="enrolling === course.id"
                class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {{ enrolling === course.id ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเรียน' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredCourses.length === 0" class="text-center py-12">
          <BookOpen :size="64" class="mx-auto text-gray-300 mb-4" />
          <h3 class="text-xl font-semibold text-gray-600 mb-2">ไม่พบคอร์สเรียน</h3>
          <p class="text-gray-500">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Award,
  LogOut,
  Search,
  Users
} from 'lucide-vue-next'

const router = useRouter()
const courses = ref([])
const enrollments = ref([])
const loading = ref(true)
const enrolling = ref(null)
const searchQuery = ref('')
const filterEnrolled = ref('all')

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchQuery.value) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterEnrolled.value === 'enrolled') {
    filtered = filtered.filter(course => course.isEnrolled)
  } else if (filterEnrolled.value === 'not-enrolled') {
    filtered = filtered.filter(course => !course.isEnrolled)
  }

  return filtered
})

onMounted(async () => {
  await loadEnrollments()
  await loadCourses()
})

const loadEnrollments = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8787/api/enrollments', {
      headers: { Authorization: `Bearer ${token}` }
    })
    enrollments.value = response.data
  } catch (error) {
    console.error('Error loading enrollments:', error)
  }
}

const loadCourses = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8787/api/courses?published=true', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    courses.value = response.data.map(course => ({
      ...course,
      isEnrolled: enrollments.value.some(e => e.courseId === course.id)
    }))
    
    loading.value = false
  } catch (error) {
    console.error('Error loading courses:', error)
    loading.value = false
  }
}

const enrollCourse = async (courseId) => {
  enrolling.value = courseId
  
  try {
    const token = localStorage.getItem('token')
    await axios.post(`http://localhost:8787/api/courses/${courseId}/enroll`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    await loadEnrollments()
    await loadCourses()
  } catch (error) {
    console.error('Error enrolling:', error)
    alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลงทะเบียน')
  } finally {
    enrolling.value = null
  }
}

const goToCourse = (courseId) => {
  router.push(`/courses/${courseId}/learn`)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
