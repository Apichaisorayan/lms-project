<template>
  <DashboardLayout title="สำรวจคอร์สเรียน" subtitle="ค้นหาและลงทะเบียนคอร์สที่คุณสนใจ">
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
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout.vue'
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
