<template>
  <DashboardLayout>
    <template #header>
      <div class="flex-1 ml-4 lg:ml-0 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          <button @click="goBack" class="p-2 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl transition-all duration-200 flex-shrink-0 group">
            <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div class="min-w-0">
            <h1 class="text-lg lg:text-2xl font-bold text-gray-800 truncate flex items-center gap-2">
              <span class="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">จัดการบทเรียน</span>
            </h1>
            <p class="text-xs lg:text-sm text-gray-500 mt-1 truncate flex items-center gap-1">
              <BookOpen :size="14" class="text-orange-500" />
              {{ course?.title }}
            </p>
          </div>
        </div>
        <button @click="showCreateModal = true" class="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm lg:text-base flex-shrink-0 transform hover:-translate-y-0.5">
          <Plus :size="20" />
          <span class="hidden sm:inline">เพิ่มบทเรียน</span>
          <span class="sm:hidden">เพิ่ม</span>
        </button>
      </div>
    </template>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 animate-pulse">กำลังโหลดบทเรียน...</p>
    </div>

    <!-- Lessons List -->
    <div v-else class="space-y-6 max-w-5xl mx-auto">
      <!-- Stats Overview (Optional) -->
      <div v-if="lessons.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div class="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <BookOpen :size="20" />
          </div>
          <div>
            <div class="text-xs text-gray-500">บทเรียนทั้งหมด</div>
            <div class="font-bold text-gray-800">{{ lessons.length }} บท</div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-3">
          <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Clock :size="20" />
          </div>
          <div>
            <div class="text-xs text-gray-500">เวลารวม</div>
            <div class="font-bold text-gray-800">{{ totalDuration }} นาที</div>
          </div>
        </div>
      </div>

      <div
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="group bg-white rounded-2xl p-1 border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
          <!-- Order Badge -->
          <div class="flex-shrink-0 relative">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              {{ index + 1 }}
            </div>
            <div class="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md" v-if="lesson.videoUrl">
              <div class="bg-green-100 text-green-600 p-1 rounded-full">
                <Video :size="12" />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                {{ lesson.title }}
              </h3>
              <span v-if="!lesson.published" class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full border border-gray-200">แบบร่าง</span>
            </div>
            
            <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {{ lesson.content }}
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-400 pt-1">
              <div class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <Clock :size="14" />
                <span>{{ lesson.duration || 0 }} นาที</span>
              </div>
              <div class="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <FileText :size="14" />
                <span>{{ lesson.resources_count || 0 }} เอกสาร</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 justify-end">
            <!-- Quiz Button -->
            <div class="relative group/tooltip">
              <button 
                @click="manageQuizzes(lesson.id)" 
                class="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
              >
                <ClipboardList :size="20" stroke-width="2" />
              </button>
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                แบบทดสอบ
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </div>
            
            <!-- Resources Button -->
            <div class="relative group/tooltip">
              <button 
                @click="manageResources(lesson)" 
                class="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
              >
                <FileText :size="20" stroke-width="2" />
              </button>
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                เอกสาร
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </div>
            
            <div class="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>
            
            <!-- Edit Button -->
            <div class="relative group/tooltip">
              <button 
                @click="editLesson(lesson)" 
                class="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-200 transition-all duration-300"
              >
                <Edit :size="20" stroke-width="2" />
              </button>
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                แก้ไข
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </div>
            
            <!-- Delete Button -->
            <div class="relative group/tooltip">
              <button 
                @click="deleteLesson(lesson.id)" 
                class="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all duration-300"
              >
                <Trash2 :size="20" stroke-width="2" />
              </button>
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                ลบ
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="lessons.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-100">
        <div class="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <BookOpen :size="40" class="text-orange-500" />
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">ยังไม่มีบทเรียน</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">เริ่มสร้างบทเรียนแรกของคุณเพื่อแบ่งปันความรู้ให้กับผู้เรียนได้เลย</p>
        <button 
          @click="showCreateModal = true" 
          class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
        >
          <Plus :size="20" />
          สร้างบทเรียนแรก
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <component :is="editingLesson ? Edit : Plus" :size="20" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{ editingLesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่' }}</h2>
              <p class="text-xs text-gray-500">กรอกข้อมูลบทเรียนด้านล่าง</p>
            </div>
          </div>
          <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X :size="20" />
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form @submit.prevent="saveLesson" class="space-y-6">
            
            <!-- Title -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                ชื่อบทเรียน <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="lessonForm.title" 
                type="text" 
                required 
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-gray-400" 
                placeholder="เช่น EP.1 แนะนำการใช้งานเบื้องต้น" 
              />
            </div>

            <!-- Content -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                รายละเอียดเนื้อหา <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="lessonForm.content" 
                rows="5" 
                required 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-gray-400 resize-none" 
                placeholder="อธิบายรายละเอียดของบทเรียนนี้..."
              ></textarea>
            </div>

            <!-- Video Input -->
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <VideoURLInput v-model="lessonForm.videoUrl" />
            </div>

            <!-- Meta Info Grid -->
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">ลำดับที่</label>
                <div class="relative">
                  <input 
                    v-model.number="lessonForm.order" 
                    type="number" 
                    min="1" 
                    required 
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ListOrdered :size="18" />
                  </div>
                </div>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700">ระยะเวลา (นาที)</label>
                <div class="relative">
                  <input 
                    v-model.number="lessonForm.duration" 
                    type="number" 
                    min="0" 
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Clock :size="18" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertCircle :size="20" class="flex-shrink-0" />
              <p class="text-sm">{{ error }}</p>
            </div>

          </form>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button 
            type="button" 
            @click="closeModal" 
            class="flex-1 px-6 py-2.5 text-gray-700 font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            ยกเลิก
          </button>
          <button 
            @click="saveLesson" 
            :disabled="saving" 
            class="flex-1 px-6 py-2.5 text-white font-medium bg-gradient-to-r from-primary to-orange-600 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div v-if="saving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{{ saving ? 'กำลังบันทึก...' : (editingLesson ? 'บันทึกการแก้ไข' : 'ยืนยันการเพิ่ม') }}</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Resources Modal -->
    <div v-if="showResourcesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-800">เอกสารประกอบ: {{ selectedLesson?.title }}</h2>
          <button @click="closeResourcesModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Upload Section -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label class="flex flex-col items-center justify-center cursor-pointer">
              <Upload :size="48" class="text-gray-400 mb-2" />
              <span class="text-sm text-gray-600 mb-1">{{ uploadingDoc ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัปโหลดเอกสาร' }}</span>
              <span class="text-xs text-gray-500">รองรับ: PDF, DOC, PPT, XLS, ZIP (ไม่เกิน 50MB)</span>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar" @change="handleDocumentUpload" class="hidden" :disabled="uploadingDoc" />
            </label>
          </div>

          <!-- Resources List -->
          <div v-if="resources.length > 0" class="space-y-3">
            <h3 class="font-semibold text-gray-800">เอกสารทั้งหมด</h3>
            <div v-for="resource in resources" :key="resource.id" class="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText :size="20" class="text-primary" />
                </div>
                <div>
                  <div class="font-medium text-gray-800">{{ resource.name }}</div>
                  <div class="text-sm text-gray-500">{{ resource.fileType }} • {{ resource.fileSize }}</div>
                </div>
              </div>
              <div class="flex gap-2">
                <a :href="resource.fileUrl" target="_blank" class="p-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200" title="เปิดดู">
                  <Eye :size="18" />
                </a>
                <a :href="resource.fileUrl" download class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors" title="ดาวน์โหลด">
                  <Download :size="18" />
                </a>
                <button @click="deleteResource(resource.id)" class="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200" title="ลบ">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <FileText :size="48" class="mx-auto text-gray-300 mb-2" />
            <p>ยังไม่มีเอกสารประกอบ</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/config/api'
import { useToast } from '../composables/useToast'
import { useConfirm } from '../composables/useConfirm'
import DashboardLayout from '@/components/DashboardLayout.vue'
import VideoURLInput from '@/components/VideoURLInput.vue'
import {
  ArrowLeft,
  Plus,
  Clock,
  Video,
  Edit,
  Trash2,
  X,
  Upload,
  FileText,
  Download,
  Eye,
  ClipboardList,
  ListOrdered,
  AlertCircle
} from 'lucide-vue-next'

const toast = useToast()
const confirm = useConfirm()

const route = useRoute()
const router = useRouter()

const course = ref(null)
const lessons = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const editingLesson = ref(null)
const saving = ref(false)
const error = ref('')
const uploadingVideo = ref(false)
const videoPreview = ref(null)
const showResourcesModal = ref(false)
const selectedLesson = ref(null)
const resources = ref([])
const uploadingDoc = ref(false)

const lessonForm = ref({
  title: '',
  content: '',
  videoUrl: '',
  order: 1,
  duration: 0
})

onMounted(() => {
  loadCourse()
  loadLessons()
})

const loadCourse = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/courses/${route.params.id}`)
    course.value = response.data
  } catch (err) {
    console.error('Error loading course:', err)
  }
}

const loadLessons = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/courses/${route.params.id}/lessons`)
    lessons.value = response.data
    loading.value = false
  } catch (err) {
    console.error('Error loading lessons:', err)
    loading.value = false
  }
}

const handleVideoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size
  if (file.size > 100 * 1024 * 1024) {
    toast.error('ขนาดไฟล์เกินกำหนด', 'ขนาดไฟล์ต้องไม่เกิน 100MB')
    return
  }

  // Validate file type
  const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/x-matroska', 'video/webm']
  if (!allowedTypes.includes(file.type)) {
    toast.error('ไฟล์ไม่ถูกต้อง', 'รองรับเฉพาะไฟล์วิดีโอ (MP4, AVI, MOV, WebM)')
    return
  }

  uploadingVideo.value = true
  error.value = ''
  const loadingToastId = toast.loading('กำลังอัปโหลดวิดีโอ', `กำลังอัปโหลด "${file.name}"...`)

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('video', file)

    const response = await api.post('/api/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    lessonForm.value.videoUrl = response.data.url
    videoPreview.value = response.data.url
    
    // Update loading toast to success
    toast.updateToast(loadingToastId, {
      type: 'success',
      title: 'อัปโหลดวิดีโอสำเร็จ!',
      message: 'วิดีโอพร้อมใช้งานแล้ว'
    })
  } catch (err) {
    error.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดวิดีโอ'
    
    // Update loading toast to error
    toast.updateToast(loadingToastId, {
      type: 'error',
      title: 'อัปโหลดไม่สำเร็จ',
      message: error.value
    })
  } finally {
    uploadingVideo.value = false
  }
}

const isLocalVideo = (url) => {
  if (!url) return false
  return url.includes('/uploads/') && !url.includes('youtube')
}

const getEmbedUrl = (url) => {
  if (!url) return ''
  
  // Convert YouTube URL to embed format
  if (url.includes('youtube.com/watch')) {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  return url
}

const editLesson = (lesson) => {
  editingLesson.value = lesson
  lessonForm.value = {
    title: lesson.title,
    content: lesson.content,
    videoUrl: lesson.videoUrl || '',
    order: lesson.order,
    duration: lesson.duration || 0
  }
  videoPreview.value = lesson.videoUrl
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingLesson.value = null
  lessonForm.value = {
    title: '',
    content: '',
    videoUrl: '',
    order: lessons.value.length + 1,
    duration: 0
  }
  error.value = ''
  videoPreview.value = null
}

const saveLesson = async () => {
  saving.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    if (editingLesson.value) {
      await api.put(`/api/lessons/${editingLesson.value.id}`, lessonForm.value)
      toast.success('บันทึกสำเร็จ!', 'แก้ไขบทเรียนเรียบร้อยแล้ว')
    } else {
      await api.post(`/api/courses/${route.params.id}/lessons`, lessonForm.value)
      toast.success('เพิ่มบทเรียนสำเร็จ!', 'สร้างบทเรียนใหม่เรียบร้อยแล้ว')
    }

    await loadLessons()
    closeModal()
  } catch (err) {
    error.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึก'
    toast.error('บันทึกไม่สำเร็จ', error.value)
  } finally {
    saving.value = false
  }
}

const deleteLesson = async (lessonId) => {
  const confirmed = await confirm.danger(
    'ลบบทเรียนนี้?',
    'การดำเนินการนี้ไม่สามารถย้อนกลับได้ บทเรียนและเอกสารทั้งหมดจะถูกลบถาวร'
  )
  
  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')
    await api.delete(`/api/lessons/${lessonId}`)
    await loadLessons()
    toast.success('ลบสำเร็จ', 'ลบบทเรียนเรียบร้อยแล้ว')
  } catch (err) {
    toast.error('ลบไม่สำเร็จ', err.response?.data?.error || 'เกิดข้อผิดพลาดในการลบ')
  }
}

const goBack = () => {
  router.push('/dashboard/courses')
}

const manageResources = async (lesson) => {
  selectedLesson.value = lesson
  showResourcesModal.value = true
  await loadResources(lesson.id)
}

const closeResourcesModal = () => {
  showResourcesModal.value = false
  selectedLesson.value = null
  resources.value = []
}

const loadResources = async (lessonId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/lessons/${lessonId}/resources`)
    resources.value = response.data
  } catch (err) {
    console.error('Error loading resources:', err)
  }
}

const handleDocumentUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 50 * 1024 * 1024) {
    toast.error('ขนาดไฟล์เกินกำหนด', 'ขนาดไฟล์ต้องไม่เกิน 50MB')
    return
  }

  uploadingDoc.value = true
  const loadingToastId = toast.loading('กำลังอัปโหลดเอกสาร', `กำลังอัปโหลด "${file.name}"...`)

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('document', file)

    const uploadResponse = await api.post('/api/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Save resource to database
    await api.post(`/api/lessons/${selectedLesson.value.id}/resources`, {
      name: uploadResponse.data.name,
      fileUrl: uploadResponse.data.url,
      fileType: uploadResponse.data.type,
      fileSize: uploadResponse.data.size
    })

    await loadResources(selectedLesson.value.id)
    event.target.value = ''
    
    // Update loading toast to success
    toast.updateToast(loadingToastId, {
      type: 'success',
      title: 'อัปโหลดสำเร็จ!',
      message: `เพิ่มเอกสาร "${uploadResponse.data.name}" แล้ว`
    })
  } catch (err) {
    // Update loading toast to error
    toast.updateToast(loadingToastId, {
      type: 'error',
      title: 'อัปโหลดไม่สำเร็จ',
      message: err.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลด'
    })
  } finally {
    uploadingDoc.value = false
  }
}

const deleteResource = async (resourceId) => {
  const confirmed = await confirm.danger(
    'ลบเอกสารนี้?',
    'เอกสารจะถูกลบถาวรและไม่สามารถกู้คืนได้'
  )
  
  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')
    await api.delete(`/api/resources/${resourceId}`)
    await loadResources(selectedLesson.value.id)
    toast.success('ลบสำเร็จ', 'ลบเอกสารเรียบร้อยแล้ว')
  } catch (err) {
    toast.error('ลบไม่สำเร็จ', err.response?.data?.error || 'เกิดข้อผิดพลาดในการลบ')
  }
}

const manageQuizzes = (lessonId) => {
  router.push({ name: 'QuizManage', params: { lessonId } })
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
