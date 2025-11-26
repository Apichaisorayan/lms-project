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
        <router-link to="/dashboard/courses" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-orange-600 text-white transition-all duration-200">
          <BookOpen :size="20" />
          <span class="font-medium">คอร์สเรียนทั้งหมด</span>
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
        <div class="px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft :size="20" />
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">จัดการบทเรียน</h1>
              <p class="text-sm text-gray-500 mt-1">{{ course?.title }}</p>
            </div>
          </div>
          <button @click="showCreateModal = true" class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
            <Plus :size="20" />
            <span>เพิ่มบทเรียน</span>
          </button>
        </div>
      </header>

      <main class="p-8">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Lessons List -->
        <div v-else class="space-y-4">
          <div
            v-for="(lesson) in lessons"
            :key="lesson.id"
            class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                {{ lesson.order }}
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-800 mb-2">{{ lesson.title }}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ lesson.content }}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <Clock :size="16" />
                    <span>{{ lesson.duration || 0 }} นาที</span>
                  </div>
                  <div v-if="lesson.videoUrl" class="flex items-center gap-1">
                    <Video :size="16" />
                    <span>มีวิดีโอ</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="manageQuizzes(lesson.id)" class="p-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200" title="จัดการแบบทดสอบ">
                  <ClipboardList :size="18" />
                </button>
                <button @click="manageResources(lesson)" class="p-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200" title="จัดการเอกสาร">
                  <FileText :size="18" />
                </button>
                <button @click="editLesson(lesson)" class="p-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200">
                  <Edit :size="18" />
                </button>
                <button @click="deleteLesson(lesson.id)" class="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="lessons.length === 0" class="text-center py-12">
            <BookOpen :size="64" class="mx-auto text-gray-300 mb-4" />
            <h3 class="text-xl font-semibold text-gray-600 mb-2">ยังไม่มีบทเรียน</h3>
            <p class="text-gray-500 mb-6">เริ่มสร้างบทเรียนแรกของคุณเลย</p>
            <button @click="showCreateModal = true" class="px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
              เพิ่มบทเรียน
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-800">{{ editingLesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่' }}</h2>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="saveLesson" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อบทเรียน</label>
            <input v-model="lessonForm.title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="เช่น Functions และ Scope" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>
            <textarea v-model="lessonForm.content" rows="6" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="อธิบายเนื้อหาบทเรียน..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">วิดีโอ</label>
            
            <!-- Video Preview -->
            <div v-if="lessonForm.videoUrl || videoPreview" class="mb-3">
              <video v-if="videoPreview || isLocalVideo(lessonForm.videoUrl)" :src="videoPreview || lessonForm.videoUrl" controls class="w-full h-64 rounded-lg border border-gray-300 bg-black"></video>
              <iframe v-else-if="lessonForm.videoUrl" :src="getEmbedUrl(lessonForm.videoUrl)" class="w-full h-64 rounded-lg border border-gray-300" frameborder="0" allowfullscreen></iframe>
            </div>

            <!-- Upload Options -->
            <div class="space-y-3">
              <!-- File Upload -->
              <div>
                <label class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload :size="20" class="text-gray-500" />
                  <span class="text-sm text-gray-600">{{ uploadingVideo ? 'กำลังอัปโหลด...' : 'อัปโหลดวิดีโอจากเครื่อง' }}</span>
                  <input type="file" accept="video/*" @change="handleVideoUpload" class="hidden" :disabled="uploadingVideo" />
                </label>
              </div>

              <!-- URL Input -->
              <div class="relative">
                <input v-model="lessonForm.videoUrl" type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="หรือใส่ URL วิดีโอ YouTube" @input="videoPreview = null" />
              </div>
            </div>

            <p class="text-xs text-gray-500 mt-2">รองรับไฟล์: MP4, AVI, MOV, WebM (ขนาดไม่เกิน 100MB) หรือ YouTube URL</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ลำดับที่</label>
              <input v-model.number="lessonForm.order" type="number" min="1" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ระยะเวลา (นาที)</label>
              <input v-model.number="lessonForm.duration" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" class="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200">
              ยกเลิก
            </button>
            <button type="submit" :disabled="saving" class="flex-1 py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50">
              {{ saving ? 'กำลังบันทึก...' : (editingLesson ? 'บันทึกการแก้ไข' : 'เพิ่มบทเรียน') }}
            </button>
          </div>
        </form>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from '../composables/useToast'
import { useConfirm } from '../composables/useConfirm'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  LogOut,
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
  ClipboardList
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
    const response = await axios.get(`http://localhost:8787/api/courses/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    course.value = response.data
  } catch (err) {
    console.error('Error loading course:', err)
  }
}

const loadLessons = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8787/api/courses/${route.params.id}/lessons`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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

    const response = await axios.post('http://localhost:8787/api/upload/video', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
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
      await axios.put(`http://localhost:8787/api/lessons/${editingLesson.value.id}`, lessonForm.value, config)
      toast.success('บันทึกสำเร็จ!', 'แก้ไขบทเรียนเรียบร้อยแล้ว')
    } else {
      await axios.post(`http://localhost:8787/api/courses/${route.params.id}/lessons`, lessonForm.value, config)
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
    await axios.delete(`http://localhost:8787/api/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
    const response = await axios.get(`http://localhost:8787/api/lessons/${lessonId}/resources`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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

    const uploadResponse = await axios.post('http://localhost:8787/api/upload/document', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    // Save resource to database
    await axios.post(`http://localhost:8787/api/lessons/${selectedLesson.value.id}/resources`, {
      name: uploadResponse.data.name,
      fileUrl: uploadResponse.data.url,
      fileType: uploadResponse.data.type,
      fileSize: uploadResponse.data.size
    }, {
      headers: { Authorization: `Bearer ${token}` }
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
    await axios.delete(`http://localhost:8787/api/resources/${resourceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
