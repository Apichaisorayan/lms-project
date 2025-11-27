<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div class="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div class="flex items-center justify-between gap-2 sm:gap-4">
          <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button @click="goBack" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <ChevronLeft :size="20" />
            </button>
            <div class="min-w-0 flex-1">
              <h1 class="font-semibold text-sm sm:text-lg line-clamp-1">{{ course?.title }}</h1>
              <p class="text-xs sm:text-sm text-gray-500 hidden sm:block">โดย {{ course?.instructor?.name }}</p>
            </div>
          </div>
          <div class="hidden lg:flex items-center gap-3 flex-shrink-0">
            <span class="text-sm text-gray-600">ความคืบหน้า</span>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-primary to-orange-600 h-2 rounded-full transition-all" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
            <span class="text-sm font-medium">{{ progressPercentage }}%</span>
          </div>
        </div>
        <!-- Mobile Progress Bar -->
        <div class="lg:hidden mt-2 flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-1.5">
            <div class="bg-gradient-to-r from-primary to-orange-600 h-1.5 rounded-full transition-all" :style="{ width: `${progressPercentage}%` }"></div>
          </div>
          <span class="text-xs font-medium text-gray-600 flex-shrink-0">{{ progressPercentage }}%</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
      <div class="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-3 sm:gap-6">
        <!-- Video & Content Section -->
        <div class="space-y-3 sm:space-y-6">
          <!-- Video Player -->
          <div class="bg-white rounded-lg sm:rounded-xl overflow-hidden border sm:border-2 shadow-sm">
            <div class="relative bg-black aspect-video group">
              <div v-if="currentLesson?.videoUrl" class="w-full h-full">
                <EnhancedVideoPlayer
                  :video-url="currentLesson.videoUrl"
                  :title="currentLesson.title"
                  :show-info="false"
                  @video-ended="markAsComplete"
                />
              </div>
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-900">
                <div class="text-center px-4">
                  <ImageIcon :size="48" class="sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p class="text-sm sm:text-base">ไม่มีวิดีโอสำหรับบทเรียนนี้</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Lesson Info -->
          <div class="bg-white rounded-lg sm:rounded-xl border sm:border-2 shadow-sm">
            <div class="p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4">
                <div class="flex-1 w-full">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="px-2 sm:px-3 py-1 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
                      บทที่ {{ currentLesson?.order }}
                    </span>
                    <span class="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full">
                      JavaScript
                    </span>
                  </div>
                  <h2 class="text-lg sm:text-2xl font-bold text-gray-800 mb-2">{{ currentLesson?.title }}</h2>
                  <p class="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">{{ currentLesson?.content?.substring(0, 150) }}...</p>
                </div>
                <button
                  @click="markAsComplete"
                  class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all w-full sm:w-auto flex-shrink-0 text-sm sm:text-base"
                  :class="isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  <CheckCircle :size="18" class="sm:w-5 sm:h-5" />
                  <span class="hidden sm:inline">{{ isCompleted ? 'เรียนจบแล้ว' : 'ทำเครื่องหมายว่าเรียนจบ' }}</span>
                  <span class="sm:hidden">{{ isCompleted ? 'เรียนจบ' : 'ทำเครื่องหมาย' }}</span>
                </button>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t">
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <Clock :size="14" class="sm:w-4 sm:h-4" />
                  <span>{{ currentLesson?.duration || 0 }} นาที</span>
                </div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen :size="14" class="sm:w-4 sm:h-4" />
                  <span>บทที่ {{ currentLesson?.order }} จาก {{ lessons.length }}</span>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                <button
                  v-if="currentLessonIndex > 0"
                  @click="previousLesson"
                  class="flex-1 py-2 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                >
                  <ChevronLeft :size="16" class="sm:w-[18px] sm:h-[18px]" />
                  <span class="hidden sm:inline">บทก่อนหน้า</span>
                  <span class="sm:hidden">ก่อนหน้า</span>
                </button>
                <button
                  v-if="currentLessonIndex < lessons.length - 1"
                  @click="nextLesson"
                  class="flex-1 py-2 sm:py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                >
                  <span class="hidden sm:inline">บทถัดไป</span>
                  <span class="sm:hidden">ถัดไป</span>
                  <ChevronRight :size="16" class="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-white rounded-lg sm:rounded-xl border sm:border-2 shadow-sm">
            <div class="border-b overflow-x-auto">
              <div class="flex min-w-max sm:min-w-0">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="flex-1 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors relative text-sm sm:text-base whitespace-nowrap"
                  :class="activeTab === tab.id ? 'text-primary' : 'text-gray-600 hover:text-gray-800'"
                >
                  {{ tab.label }}
                  <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                </button>
              </div>
            </div>

            <div class="p-4 sm:p-6">
              <!-- Overview Tab -->
              <div v-show="activeTab === 'overview'" class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-4">สิ่งที่จะได้เรียนรู้</h3>
                  <div class="space-y-3">
                    <div v-for="(item, i) in learningObjectives" :key="i" class="flex items-start gap-3">
                      <CheckCircle :size="20" class="text-primary mt-0.5 flex-shrink-0" />
                      <span class="text-gray-700">{{ item }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="pt-4 border-t">
                  <h4 class="font-semibold text-gray-800 mb-3">เนื้อหาบทเรียน</h4>
                  <div class="prose max-w-none text-gray-600" v-html="currentLesson?.content"></div>
                </div>
              </div>

              <!-- Resources Tab -->
              <div v-show="activeTab === 'resources'" class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-2">ดาวน์โหลดเอกสาร</h3>
                  <p class="text-sm text-gray-500 mb-4">เอกสารประกอบการเรียนและ Source Code ตัวอย่าง</p>
                </div>
                
                <div v-if="resources.length > 0" class="space-y-3">
                  <div v-for="(resource, i) in resources" :key="i" class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-gray-50 transition-colors group gap-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FileText :size="18" class="sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-800 truncate text-sm sm:text-base">{{ resource.name }}</div>
                        <div class="text-xs sm:text-sm text-gray-500">{{ resource.file_type || resource.fileType }} • {{ resource.file_size || resource.fileSize }}</div>
                      </div>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto flex-shrink-0">
                      <button @click="viewResource(resource)" class="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <Eye :size="16" />
                        <span>เปิดดู</span>
                      </button>
                      <button @click="downloadResource(resource)" class="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        <Download :size="16" />
                        <span class="hidden sm:inline">ดาวน์โหลด</span>
                        <span class="sm:hidden">ดาวน์</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-12">
                  <FileText :size="48" class="mx-auto text-gray-300 mb-4" />
                  <p class="text-gray-500">ยังไม่มีเอกสารประกอบ</p>
                </div>
              </div>

              <!-- Comments Tab -->
              <div v-show="activeTab === 'comments'" class="space-y-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-4">ถามคำถามหรือแบ่งปันความคิดเห็น</h3>
                  <textarea
                    v-model="newComment"
                    placeholder="พิมพ์คำถามหรือความคิดเห็นของคุณ..."
                    class="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  ></textarea>
                  <button
                    @click="postComment"
                    class="mt-3 px-6 py-2 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <MessageCircle :size="18" />
                    โพสต์คำถาม
                  </button>
                </div>
                
                <div v-if="comments.length > 0" class="space-y-4 pt-4">
                  <div v-for="comment in comments" :key="comment.id" class="border rounded-lg p-4">
                    <div class="flex gap-4">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {{ comment.author.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <span class="font-semibold text-gray-800">{{ comment.author }}</span>
                          <span class="text-sm text-gray-500">{{ comment.time }}</span>
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed mb-3">{{ comment.content }}</p>
                        <div class="flex items-center gap-4">
                          <button class="text-sm text-gray-600 hover:text-primary flex items-center gap-1">
                            <ThumbsUp :size="16" />
                            {{ comment.likes || 0 }}
                          </button>
                          <button class="text-sm text-gray-600 hover:text-primary">ตอบกลับ</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center py-12">
                  <MessageCircle :size="48" class="mx-auto text-gray-300 mb-4" />
                  <p class="text-gray-500">ยังไม่มีคำถามหรือความคิดเห็น</p>
                  <p class="text-sm text-gray-400 mt-2">เป็นคนแรกที่แสดงความคิดเห็น</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar - Lessons List -->
        <div class="space-y-3 sm:space-y-6">
          <div class="bg-white rounded-lg sm:rounded-xl border sm:border-2 shadow-sm lg:sticky lg:top-24">
            <div class="p-4 sm:p-6 border-b">
              <h3 class="font-bold text-gray-800 flex items-center gap-2 mb-2 text-sm sm:text-base">
                <BookOpen :size="18" class="sm:w-5 sm:h-5 text-primary" />
                เนื้อหาคอร์ส
              </h3>
              <p class="text-xs sm:text-sm text-gray-500">{{ lessons.length }} บทเรียน • {{ totalDuration }} นาที</p>
            </div>
            
            <div class="p-3 sm:p-4 max-h-[400px] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
              <!-- Progress -->
              <div class="mb-3 sm:mb-4 px-1 sm:px-2">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs sm:text-sm text-gray-600">ความก้าวหน้า</span>
                  <span class="text-xs sm:text-sm font-medium text-gray-800">{{ completedCount }}/{{ lessons.length }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    class="bg-gradient-to-r from-primary to-orange-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${progressPercentage}%` }"
                  ></div>
                </div>
              </div>

              <!-- Lessons by Section -->
              <div class="space-y-1.5 sm:space-y-2">
                <div v-for="section in groupedLessons" :key="section.name">
                  <button
                    @click="section.expanded = !section.expanded"
                    class="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span class="font-semibold text-gray-800 text-xs sm:text-sm">{{ section.name }}</span>
                    <ChevronDown :size="16" class="sm:w-[18px] sm:h-[18px] transition-transform text-gray-500" :class="{ 'rotate-180': section.expanded }" />
                  </button>

                  <div v-show="section.expanded" class="space-y-1 mt-1">
                    <button
                      v-for="lesson in section.lessons"
                      :key="lesson.id"
                      @click="selectLesson(lesson)"
                      class="w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200"
                      :class="currentLesson?.id === lesson.id ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'hover:bg-gray-50'"
                    >
                      <div class="flex items-start gap-2 sm:gap-3">
                        <div class="mt-0.5 flex-shrink-0">
                          <CheckCircle
                            v-if="isLessonCompleted(lesson.id)"
                            :size="16"
                            class="sm:w-[18px] sm:h-[18px] text-green-500"
                          />
                          <PlayCircle
                            v-else
                            :size="16"
                            class="sm:w-[18px] sm:h-[18px]"
                            :class="currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-400'"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2" :class="currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-800'">
                            {{ lesson.title }}
                          </p>
                          <p class="text-[10px] sm:text-xs" :class="currentLesson?.id === lesson.id ? 'text-white/80' : 'text-gray-500'">
                            {{ lesson.duration || 0 }} นาที
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/config/api'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  PlayCircle,
  Clock,
  BookOpen,
  FileText,
  Download,
  MessageCircle,
  ThumbsUp,
  ImageIcon,
  Eye
} from 'lucide-vue-next'
import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer.vue'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const lessons = ref([])
const currentLesson = ref(null)
const currentLessonIndex = ref(0)
const progress = ref([])
const loading = ref(true)
const activeTab = ref('overview')
const newComment = ref('')

const tabs = [
  { id: 'overview', label: 'ภาพรวม' },
  { id: 'resources', label: 'เอกสารประกอบ' },
  { id: 'comments', label: 'คำถาม & คำตอบ' }
]

const learningObjectives = computed(() => {
  if (!currentLesson.value?.content) return []
  // Extract learning objectives from content or use default
  return [
    'เข้าใจเนื้อหาและแนวคิดหลักของบทเรียน',
    'สามารถนำความรู้ไปประยุกต์ใช้ได้',
    'ฝึกฝนและพัฒนาทักษะอย่างต่อเนื่อง'
  ]
})

const resources = ref([])

const loadResources = async (lessonId) => {
  try {
    const response = await api.get(`/api/lessons/${lessonId}/resources`)
    resources.value = response.data
  } catch (error) {
    console.error('Error loading resources:', error)
  }
}
const comments = ref([])

const groupedLessons = computed(() => {
  if (lessons.value.length === 0) return []
  
  // Auto-group lessons into sections based on count
  const sections = []
  const lessonsPerSection = Math.ceil(lessons.value.length / 3)
  
  if (lessons.value.length > 0) {
    sections.push({
      name: 'ส่วนที่ 1: พื้นฐาน',
      expanded: true,
      lessons: lessons.value.slice(0, lessonsPerSection)
    })
  }
  
  if (lessons.value.length > lessonsPerSection) {
    sections.push({
      name: 'ส่วนที่ 2: ขั้นกลาง',
      expanded: true,
      lessons: lessons.value.slice(lessonsPerSection, lessonsPerSection * 2)
    })
  }
  
  if (lessons.value.length > lessonsPerSection * 2) {
    sections.push({
      name: 'ส่วนที่ 3: ขั้นสูง',
      expanded: false,
      lessons: lessons.value.slice(lessonsPerSection * 2)
    })
  }
  
  return sections
})

const totalDuration = computed(() => {
  return lessons.value.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
})

const completedCount = computed(() => {
  return progress.value.filter(p => p.completed).length
})

const progressPercentage = computed(() => {
  if (lessons.value.length === 0) return 0
  return Math.round((completedCount.value / lessons.value.length) * 100)
})

const isCompleted = computed(() => {
  if (!currentLesson.value) return false
  return progress.value.some(p => p.lessonId === currentLesson.value.id && p.completed)
})

onMounted(async () => {
  await loadCourse()
  await loadProgress()
})

const loadCourse = async () => {
  try {
    const token = localStorage.getItem('token')
    
    // Check enrollment first
    const enrollmentsResponse = await api.get('/api/enrollments')
    
    // Convert both to string for comparison
    const courseId = String(route.params.id)
    const isEnrolled = enrollmentsResponse.data.some(e => String(e.course_id) === courseId || String(e.courseId) === courseId)
    
    if (!isEnrolled) {
      alert('คุณยังไม่ได้ลงทะเบียนคอร์สนี้')
      router.push('/dashboard')
      return
    }
    
    const response = await api.get(`/api/courses/${route.params.id}`)
    
    course.value = response.data
    lessons.value = (response.data.lessons || []).map(l => ({
      ...l,
      videoUrl: l.videoUrl || l.video_url, // Normalize snake_case to camelCase
      order: l.order || l.order_index // Normalize order if needed
    }))
    
    if (lessons.value.length > 0) {
      currentLesson.value = lessons.value[0]
      currentLessonIndex.value = 0
      await loadResources(lessons.value[0].id)
    }
    
    loading.value = false
  } catch (error) {
    console.error('Error loading course:', error)
    loading.value = false
  }
}

const loadProgress = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/courses/${route.params.id}/progress`)
    progress.value = response.data
  } catch (error) {
    console.error('Error loading progress:', error)
  }
}

const selectLesson = async (lesson) => {
  currentLesson.value = lesson
  currentLessonIndex.value = lessons.value.findIndex(l => l.id === lesson.id)
  await loadResources(lesson.id)
}

const previousLesson = async () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--
    currentLesson.value = lessons.value[currentLessonIndex.value]
    await loadResources(currentLesson.value.id)
  }
}

const nextLesson = async () => {
  if (currentLessonIndex.value < lessons.value.length - 1) {
    currentLessonIndex.value++
    currentLesson.value = lessons.value[currentLessonIndex.value]
    await loadResources(currentLesson.value.id)
  }
}

const markAsComplete = async () => {
  if (isCompleted.value) return
  
  try {
    const token = localStorage.getItem('token')
    await api.post(`/api/lessons/${currentLesson.value.id}/complete`, {})
    await loadProgress()
  } catch (error) {
    console.error('Error marking lesson as complete:', error)
  }
}

const isLessonCompleted = (lessonId) => {
  return progress.value.some(p => p.lessonId === lessonId && p.completed)
}

const goBack = () => {
  router.push('/dashboard')
}

const viewResource = (resource) => {
  const fileUrl = resource.file_url || resource.fileUrl
  
  // Check if it's a Base64 data URL
  if (fileUrl.startsWith('data:')) {
    // For Base64, open in new window
    const newWindow = window.open()
    if (newWindow) {
      const fileType = resource.file_type || resource.fileType || 'PDF'
      
      // For PDF, create an embed viewer
      if (fileUrl.startsWith('data:application/pdf')) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${resource.name}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; overflow: hidden; }
              iframe { width: 100vw; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${fileUrl}"></iframe>
          </body>
          </html>
        `)
      } else {
        // For other file types, show download option
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${resource.name}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .container {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 2rem;
                border-radius: 1rem;
                backdrop-filter: blur(10px);
                max-width: 500px;
                width: 100%;
              }
              h1 { margin: 0 0 1rem 0; font-size: 1.25rem; word-break: break-word; }
              p { margin: 0 0 2rem 0; opacity: 0.9; font-size: 0.9rem; }
              .btn {
                display: inline-block;
                padding: 0.75rem 2rem;
                background: white;
                color: #667eea;
                text-decoration: none;
                border-radius: 0.5rem;
                font-weight: 600;
                transition: transform 0.2s;
              }
              .btn:hover { transform: scale(1.05); }
              .icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 1.5rem;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">📄</div>
              <h1>${resource.name}</h1>
              <p>ไฟล์ประเภท: ${fileType}</p>
              <a href="${fileUrl}" download="${resource.name}" class="btn">ดาวน์โหลดไฟล์</a>
            </div>
          </body>
          </html>
        `)
      }
      newWindow.document.close()
    }
  } else {
    // For regular URLs, open directly
    window.open(fileUrl, '_blank')
  }
}

const downloadResource = (resource) => {
  const fileUrl = resource.file_url || resource.fileUrl
  const fileName = resource.name
  
  // Create a temporary link and trigger download
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const postComment = () => {
  if (!newComment.value.trim()) return
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  comments.value.unshift({
    id: Date.now(),
    author: user.name || 'ผู้ใช้',
    time: 'เมื่อสักครู่',
    content: newComment.value,
    likes: 0
  })
  
  newComment.value = ''
  
  // TODO: Save to API when comment endpoint is ready
  // await axios.post(`http://localhost:5000/api/lessons/${currentLesson.value.id}/comments`, ...)
}
</script>
