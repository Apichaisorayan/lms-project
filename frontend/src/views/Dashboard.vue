<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Menu Overlay -->
    <div
      v-if="mobileMenuOpen"
      @click="mobileMenuOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-gray-200">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="bg-gradient-to-br from-primary to-orange-600 p-2 rounded-xl">
            <GraduationCap :size="24" class="text-white" />
          </div>
          <span class="text-xl font-bold text-gray-800">LearnHub</span>
        </router-link>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4 space-y-2">
        <!-- Dashboard -->
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="currentRoute === 'dashboard' ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          <LayoutDashboard :size="20" />
          <span class="font-medium">แดชบอร์ด</span>
        </router-link>

        <!-- Courses -->
        <router-link
          to="/dashboard/courses"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="currentRoute === 'courses' ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          <BookOpen :size="20" />
          <span class="font-medium">คอร์สเรียนทั้งหมด</span>
        </router-link>

        <!-- Users -->
        <router-link
          to="/dashboard/users"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="currentRoute === 'users' ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          <Users :size="20" />
          <span class="font-medium">ความก้าวหน้า</span>
        </router-link>

        <!-- Certificates -->
        <router-link
          to="/dashboard/certificates"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="currentRoute === 'certificates' ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          <Award :size="20" />
          <span class="font-medium">ใบประกาศนียบัตร</span>
        </router-link>

        <!-- Calendar -->
        <router-link
          to="/dashboard/calendar"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="currentRoute === 'calendar' ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
        >
          <Calendar :size="20" />
          <span class="font-medium">ปฏิทิน</span>
        </router-link>
      </nav>

      <!-- Bottom Menu -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
        <!-- Instructor Profile (only for instructors) -->
        <router-link
          v-if="user?.role === 'INSTRUCTOR'"
          to="/instructor/profile"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full"
        >
          <Settings :size="20" />
          <span class="font-medium">แก้ไขโปรไฟล์ผู้สอน</span>
        </router-link>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full"
        >
          <LogOut :size="20" />
          <span class="font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:ml-64">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="px-4 lg:px-8 py-4 flex items-center justify-between">
          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu v-if="!mobileMenuOpen" :size="24" class="text-gray-600" />
            <X v-else :size="24" class="text-gray-600" />
          </button>
          <div class="flex-1 ml-4 lg:ml-0">
            <h1 class="text-lg lg:text-2xl font-bold text-gray-800">ยินดีต้อนรับ, {{ user?.name }}!</h1>
            <p class="text-xs lg:text-sm text-gray-500 mt-1 hidden sm:block">มาเริ่มต้นสร้างสรรค์สิ่งใหม่กันเถอะ</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell :size="20" class="text-gray-600" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <!-- User Avatar -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-semibold">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="p-4 lg:p-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-blue-100 rounded-lg">
                <BookOpen :size="24" class="text-blue-600" />
              </div>
              <span class="text-sm text-gray-500">คอร์สที่ลงทะเบียน</span>
            </div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.totalCourses }}</div>
            <p class="text-sm text-gray-600 mt-2">คอร์สที่คุณกำลังเรียน</p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-100 rounded-lg">
                <Users :size="24" class="text-purple-600" />
              </div>
              <span class="text-sm text-gray-500">บทเรียนทั้งหมด</span>
            </div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.totalStudents }}</div>
            <p class="text-sm text-gray-600 mt-2">ในคอร์สที่ลงทะเบียน</p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-green-100 rounded-lg">
                <Award :size="24" class="text-green-600" />
              </div>
              <span class="text-sm text-gray-500">ใบประกาศ</span>
            </div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.totalCertificates }}</div>
            <p class="text-sm text-green-600 mt-2">+15% จากเดือนที่แล้ว</p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-orange-100 rounded-lg">
                <TrendingUp :size="24" class="text-orange-600" />
              </div>
              <span class="text-sm text-gray-500">อัตราสำเร็จ</span>
            </div>
            <div class="text-3xl font-bold text-gray-800">{{ stats.completionRate }}%</div>
            <p class="text-sm text-green-600 mt-2">+5% จากเดือนที่แล้ว</p>
          </div>
        </div>

        <!-- Courses Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800">เรียนต่อจากที่ค้างไว้</h2>
            <button class="text-primary hover:text-orange-600 font-medium text-sm transition-colors">
              ดูทั้งหมด
            </button>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="course in courses"
              :key="course.id"
              class="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
            >
              <!-- Course Image -->
              <div class="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                <img
                  v-if="course.thumbnail"
                  :src="course.thumbnail"
                  :alt="course.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <BookOpen :size="48" class="text-white opacity-50" />
                </div>
              </div>

              <!-- Course Info -->
              <div class="p-5">
                <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{{ course.title }}</h3>
                <p class="text-sm text-gray-500 mb-4">โดย {{ course.instructor?.name }}</p>

                <!-- Progress Bar -->
                <div v-if="course.isEnrolled" class="mb-4">
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-gray-600">ความก้าวหน้า</span>
                    <span class="font-semibold text-primary">{{ course.progress || 0 }}/{{ course.totalLessons || 0 }} บทเรียน</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-gradient-to-r from-primary to-orange-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${calculateProgress(course)}%` }"
                    ></div>
                  </div>
                </div>
                <div v-else class="mb-4">
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen :size="16" />
                    <span>{{ course.totalLessons || 0 }} บทเรียน</span>
                  </div>
                </div>

                <!-- Action Button -->
                <button
                  v-if="course.isEnrolled"
                  @click="continueCourse(course.id)"
                  class="w-full py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play :size="18" />
                  <span>เรียนต่อ</span>
                </button>
                <button
                  v-else
                  @click="viewCourseDetail(course.id)"
                  class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <BookOpen :size="18" />
                  <span>ดูรายละเอียด</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Activity -->
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <div class="flex items-center gap-2 mb-6">
              <Calendar :size="20" class="text-primary" />
              <h3 class="text-lg font-bold text-gray-800">กิจกรรมล่าสุดที่ต้องทำ</h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <FileText :size="20" class="text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-800">มีการบ้านใหม่ที่ต้องส่ง</p>
                  <p class="text-sm text-gray-500 mt-1">วิชาพัฒนาเว็บไซต์ขั้นสูง</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <div class="flex items-center gap-2 mb-6">
              <Award :size="20" class="text-primary" />
              <h3 class="text-lg font-bold text-gray-800">ความสำเร็จ</h3>
            </div>
            <div class="text-center py-8">
              <p class="text-gray-500">ยังไม่มีความสำเร็จ</p>
              <p class="text-sm text-gray-400 mt-2">เริ่มเรียนเพื่อปลดล็อคความสำเร็จ</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/config/api'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Users,
  Award,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Play,
  Calendar,
  FileText,
  Menu,
  X
} from 'lucide-vue-next'

const router = useRouter()
const user = ref(null)
const courses = ref([])
const stats = ref({
  totalCourses: 0,
  totalStudents: 0,
  totalCertificates: 0,
  completionRate: 0
})
const loading = ref(true)
const currentRoute = ref('dashboard')
const enrolling = ref(null)
const enrollments = ref([])
const mobileMenuOpen = ref(false)

onMounted(async () => {
  await loadUserData()
  await loadEnrollments()
  await loadDashboardData()
})

const loadUserData = async () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      user.value = JSON.parse(userData)
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

const loadEnrollments = async () => {
  try {
    const response = await api.get('/api/enrollments')
    enrollments.value = response.data
  } catch (error) {
    console.error('Error loading enrollments:', error)
  }
}

const loadDashboardData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Load enrolled courses with details
    const enrolledCoursesData = []
    for (const enrollment of enrollments.value) {
      try {
        const courseResponse = await api.get(`/api/courses/${enrollment.course_id}`)
        const course = courseResponse.data
        
        // Get progress for this course
        const progressResponse = await api.get(`/api/courses/${course.id}/progress`)
        const completedLessons = progressResponse.data.filter(p => p.completed).length
        
        enrolledCoursesData.push({
          ...course,
          isEnrolled: true,
          progress: completedLessons,
          totalLessons: course.lessons?.length || 0,
          instructor: { name: course.instructor_name }
        })
      } catch (error) {
        console.error('Error loading course:', error)
      }
    }

    // If less than 6 enrolled courses, add some published courses
    if (enrolledCoursesData.length < 6) {
      const coursesResponse = await api.get('/api/courses?published=true')
      const otherCourses = coursesResponse.data
        .filter(c => !enrollments.value.some(e => e.course_id === c.id))
        .slice(0, 6 - enrolledCoursesData.length)
        .map(course => ({
          ...course,
          isEnrolled: false,
          progress: 0,
          totalLessons: 0,
          instructor: { name: course.instructor_name }
        }))
      
      courses.value = [...enrolledCoursesData, ...otherCourses]
    } else {
      courses.value = enrolledCoursesData
    }

    // Calculate stats
    const totalEnrolled = enrollments.value.length
    let totalCompleted = 0
    let totalLessons = 0
    
    for (const course of enrolledCoursesData) {
      totalCompleted += course.progress
      totalLessons += course.totalLessons
    }
    
    const completionRate = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

    stats.value = {
      totalCourses: totalEnrolled,
      totalStudents: enrolledCoursesData.reduce((sum, c) => sum + (c.totalLessons || 0), 0),
      totalCertificates: enrolledCoursesData.filter(c => c.progress === c.totalLessons && c.totalLessons > 0).length,
      completionRate: completionRate
    }

    loading.value = false
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
    loading.value = false
  }
}

const viewCourseDetail = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const calculateProgress = (course) => {
  if (!course.totalLessons || course.totalLessons === 0) return 0
  const progress = course.progress || 0
  return Math.round((progress / course.totalLessons) * 100)
}

const continueCourse = (courseId) => {
  router.push(`/courses/${courseId}/learn`)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
