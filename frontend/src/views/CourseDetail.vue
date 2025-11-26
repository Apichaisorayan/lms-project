<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Course Detail -->
    <div v-else-if="course" class="pb-20">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div class="container mx-auto px-4 py-12">
          <button @click="$router.back()" class="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft :size="20" />
            <span>กลับ</span>
          </button>

          <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- Left: Course Info -->
            <div>
              <div class="inline-block px-3 py-1 bg-primary rounded-full text-sm font-semibold mb-4">
                {{ course.published ? '🎓 เปิดสอนแล้ว' : '📝 กำลังเตรียม' }}
              </div>
              <h1 class="text-4xl font-bold mb-4">{{ course.title }}</h1>
              <p class="text-xl text-gray-300 mb-6">{{ course.description }}</p>
              
              <!-- Stats -->
              <div class="flex flex-wrap gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <BookOpen :size="20" class="text-primary" />
                  <span>{{ course.lessons?.length || 0 }} บทเรียน</span>
                </div>
                <div class="flex items-center gap-2">
                  <Users :size="20" class="text-primary" />
                  <span>{{ course._count?.enrollments || 0 }} คนเรียน</span>
                </div>
                <div class="flex items-center gap-2">
                  <Clock :size="20" class="text-primary" />
                  <span>{{ totalDuration }} นาที</span>
                </div>
              </div>

              <!-- Instructor -->
              <div class="mt-6 flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {{ course.instructor?.name?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm text-gray-400">สอนโดย</div>
                  <div class="font-semibold">{{ course.instructor?.name }}</div>
                </div>
              </div>
            </div>

            <!-- Right: Course Image -->
            <div class="relative">
              <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img v-if="course.thumbnail" :src="course.thumbnail" :alt="course.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <GraduationCap :size="120" class="text-white opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrollment Card (Sticky) -->
      <div class="sticky top-4 z-10 container mx-auto px-4 -mt-8">
        <div class="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          <div class="text-center mb-4">
            <div class="text-4xl font-bold text-primary mb-2">
              {{ course.price > 0 ? `฿${course.price}` : 'ฟรี' }}
            </div>
            <div v-if="isEnrolled" class="text-green-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle :size="20" />
              <span>คุณลงทะเบียนแล้ว</span>
            </div>
          </div>

          <button
            v-if="isEnrolled"
            @click="continueCourse"
            class="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play :size="20" />
            <span>เข้าเรียนเลย</span>
          </button>
          <button
            v-else
            @click="enrollCourse"
            :disabled="enrolling"
            class="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <BookOpen v-if="!enrolling" :size="20" />
            <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>{{ enrolling ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเรียนฟรี' }}</span>
          </button>

          <div class="mt-4 space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              <span>เข้าถึงได้ตลอดชีพ</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              <span>เรียนได้ทุกที่ ทุกเวลา</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              <span>มีใบประกาศนียบัตร</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="container mx-auto px-4 mt-12">
        <div class="max-w-4xl mx-auto">
          <!-- What You'll Learn -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">สิ่งที่คุณจะได้เรียนรู้</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="(item, i) in learningPoints" :key="i" class="flex items-start gap-3">
                <CheckCircle :size="20" class="text-primary mt-1 flex-shrink-0" />
                <span class="text-gray-700">{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- Instructor Profile -->
          <div v-if="instructorProfile" class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">เกี่ยวกับผู้สอน</h2>
            
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Instructor Avatar & Basic Info -->
              <div class="flex-shrink-0">
                <div class="relative">
                  <div v-if="instructorProfile.avatar_url" class="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
                    <img :src="instructorProfile.avatar_url" :alt="instructorProfile.name" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {{ instructorProfile.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div class="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                    <Award :size="20" />
                  </div>
                </div>
              </div>

              <!-- Instructor Details -->
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ instructorProfile.name }}</h3>
                
                <!-- Stats -->
                <div class="flex flex-wrap gap-4 mb-4">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen :size="16" class="text-primary" />
                    <span class="font-semibold">{{ instructorProfile.total_courses || 0 }}</span>
                    <span>คอร์ส</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <Users :size="16" class="text-primary" />
                    <span class="font-semibold">{{ instructorProfile.total_students || 0 }}</span>
                    <span>นักเรียน</span>
                  </div>
                  <div v-if="instructorProfile.experience_years" class="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase :size="16" class="text-primary" />
                    <span class="font-semibold">{{ instructorProfile.experience_years }}</span>
                    <span>ปีประสบการณ์</span>
                  </div>
                </div>

                <!-- Bio -->
                <p v-if="instructorProfile.bio" class="text-gray-700 mb-4 leading-relaxed">
                  {{ instructorProfile.bio }}
                </p>

                <!-- Expertise -->
                <div v-if="instructorProfile.expertise" class="mb-4">
                  <div class="text-sm font-semibold text-gray-900 mb-2">ความเชี่ยวชาญ</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(skill, index) in instructorProfile.expertise.split(',')"
                      :key="index"
                      class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {{ skill.trim() }}
                    </span>
                  </div>
                </div>

                <!-- Education -->
                <div v-if="instructorProfile.education" class="mb-4">
                  <div class="text-sm font-semibold text-gray-900 mb-1">การศึกษา</div>
                  <p class="text-gray-700 text-sm">{{ instructorProfile.education }}</p>
                </div>

                <!-- Social Links -->
                <div class="flex flex-wrap gap-3 mt-4">
                  <a
                    v-if="instructorProfile.website"
                    :href="instructorProfile.website"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                  >
                    <Globe :size="16" />
                    <span>เว็บไซต์</span>
                  </a>
                  <a
                    v-if="instructorProfile.linkedin"
                    :href="instructorProfile.linkedin"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 text-sm font-medium transition-colors"
                  >
                    <Linkedin :size="16" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    v-if="instructorProfile.facebook"
                    :href="instructorProfile.facebook"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 text-sm font-medium transition-colors"
                  >
                    <Facebook :size="16" />
                    <span>Facebook</span>
                  </a>
                  <a
                    v-if="instructorProfile.twitter"
                    :href="instructorProfile.twitter"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 rounded-lg text-sky-600 text-sm font-medium transition-colors"
                  >
                    <Twitter :size="16" />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Other Courses by Instructor -->
            <div v-if="instructorProfile.courses && instructorProfile.courses.length > 1" class="mt-8 pt-8 border-t border-gray-200">
              <h4 class="text-lg font-bold text-gray-900 mb-4">คอร์สอื่นๆ จากผู้สอนท่านนี้</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="otherCourse in instructorProfile.courses.filter(c => c.id !== course.id && c.published)"
                  :key="otherCourse.id"
                  @click="$router.push(`/courses/${otherCourse.id}`)"
                  class="flex gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img v-if="otherCourse.thumbnail" :src="otherCourse.thumbnail" :alt="otherCourse.title" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                      <BookOpen :size="24" class="text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-semibold text-gray-900 text-sm line-clamp-1">{{ otherCourse.title }}</h5>
                    <p class="text-xs text-gray-600 line-clamp-2 mt-1">{{ otherCourse.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Course Curriculum -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">เนื้อหาคอร์ส</h2>
            
            <div v-if="course.lessons && course.lessons.length > 0" class="space-y-3">
              <div
                v-for="(lesson, index) in course.lessons"
                :key="lesson.id"
                class="border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ lesson.title }}</h3>
                    <p class="text-sm text-gray-600 line-clamp-2">{{ lesson.content }}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div class="flex items-center gap-1">
                        <Clock :size="14" />
                        <span>{{ lesson.duration || 0 }} นาที</span>
                      </div>
                      <div v-if="lesson.video_url" class="flex items-center gap-1">
                        <Video :size="14" />
                        <span>มีวิดีโอ</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="isEnrolled" class="flex-shrink-0">
                    <Play :size="20" class="text-primary" />
                  </div>
                  <div v-else class="flex-shrink-0">
                    <Lock :size="20" class="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12 text-gray-500">
              <BookOpen :size="48" class="mx-auto mb-4 text-gray-300" />
              <p>ยังไม่มีบทเรียน</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">ไม่พบคอร์สนี้</h2>
        <button @click="$router.back()" class="text-primary hover:text-orange-600 font-semibold">
          กลับหน้าก่อนหน้า
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/config/api'
import {
  ArrowLeft,
  BookOpen,
  Users,
  Clock,
  GraduationCap,
  CheckCircle,
  Play,
  Video,
  Lock,
  Award,
  Briefcase,
  Globe,
  Linkedin,
  Facebook,
  Twitter
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const enrolling = ref(false)
const course = ref(null)
const enrollments = ref([])
const instructorProfile = ref(null)

const isEnrolled = computed(() => {
  if (!course.value) return false
  return enrollments.value.some(e => 
    String(e.course_id) === String(course.value.id) || 
    String(e.courseId) === String(course.value.id)
  )
})

const totalDuration = computed(() => {
  if (!course.value?.lessons) return 0
  return course.value.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
})

const learningPoints = computed(() => {
  // Generate learning points from course description or use defaults
  return [
    'เข้าใจพื้นฐานและแนวคิดหลักของหลักสูตร',
    'สามารถนำความรู้ไปประยุกต์ใช้ได้จริง',
    'ฝึกฝนผ่านตัวอย่างและแบบฝึกหัด',
    'พัฒนาทักษะอย่างเป็นระบบ',
    'เข้าถึงเนื้อหาและเอกสารประกอบ',
    'รับใบประกาศนียบัตรเมื่อจบคอร์ส'
  ]
})

onMounted(async () => {
  await loadEnrollments()
  await loadCourse()
})

const loadInstructorProfile = async (instructorId) => {
  try {
    const response = await api.get(`/api/instructors/${instructorId}/profile`)
    instructorProfile.value = response.data
  } catch (error) {
    console.error('Error loading instructor profile:', error)
    instructorProfile.value = null
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

const loadCourse = async () => {
  try {
    loading.value = true
    const response = await api.get(`/api/courses/${route.params.id}`)
    course.value = response.data
    
    // Load instructor profile
    if (course.value?.instructor_id) {
      await loadInstructorProfile(course.value.instructor_id)
    }
  } catch (error) {
    console.error('Error loading course:', error)
  } finally {
    loading.value = false
  }
}

const enrollCourse = async () => {
  enrolling.value = true
  
  try {
    await api.post(`/api/courses/${course.value.id}/enroll`)
    
    // Reload enrollments
    await loadEnrollments()
    
    // Show success and redirect
    alert('🎉 ลงทะเบียนสำเร็จ! กำลังพาคุณเข้าสู่คอร์สเรียน...')
    router.push(`/courses/${course.value.id}/learn`)
  } catch (error) {
    console.error('Error enrolling:', error)
    alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการลงทะเบียน')
  } finally {
    enrolling.value = false
  }
}

const continueCourse = () => {
  router.push(`/courses/${course.value.id}/learn`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
