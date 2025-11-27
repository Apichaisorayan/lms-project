<template>
  <DashboardLayout title="คอร์สเรียนทั้งหมด" subtitle="จัดการคอร์สเรียนของคุณ">
    <template #header>
      <div class="flex-1 ml-4 lg:ml-0 flex items-center justify-between">
        <div>
          <h1 class="text-lg lg:text-2xl font-bold text-gray-800">คอร์สเรียนทั้งหมด</h1>
          <p class="text-xs lg:text-sm text-gray-500 mt-1 hidden sm:block">จัดการคอร์สเรียนของคุณ</p>
        </div>
        <button @click="showCreateModal = true" class="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm lg:text-base">
          <Plus :size="18" />
          <span class="hidden sm:inline">สร้างคอร์สใหม่</span>
          <span class="sm:hidden">สร้าง</span>
        </button>
      </div>
    </template>
        <!-- Filters -->
        <div class="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div class="flex items-center gap-4">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
              <input v-model="searchQuery" type="text" placeholder="ค้นหาคอร์ส..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <select v-model="filterStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
              <option value="all">ทั้งหมด</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="draft">แบบร่าง</option>
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
              <div class="absolute top-3 right-3">
                <span v-if="course.published" class="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">เผยแพร่แล้ว</span>
                <span v-else class="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">แบบร่าง</span>
              </div>
            </div>

            <div class="p-5">
              <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{{ course.title }}</h3>
              <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ course.description }}</p>

              <div class="flex items-center justify-between text-sm mb-4">
                <div class="flex items-center gap-2 text-gray-600">
                  <BookOpen :size="16" />
                  <span>{{ course.lessons_count || 0 }} บทเรียน</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <Users :size="16" />
                  <span>{{ course.students_count || 0 }} คน</span>
                </div>
              </div>

              <div class="flex gap-2">
                <button @click="manageLessons(course.id)" class="flex-1 py-2 border border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm">
                  จัดการบทเรียน
                </button>
                <button @click="editCourse(course)" class="flex-1 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-200">
                  แก้ไข
                </button>
                <button @click="deleteCourse(course.id)" class="px-4 py-2 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredCourses.length === 0" class="text-center py-12">
          <BookOpen :size="64" class="mx-auto text-gray-300 mb-4" />
          <h3 class="text-xl font-semibold text-gray-600 mb-2">ยังไม่มีคอร์สเรียน</h3>
          <p class="text-gray-500 mb-6">เริ่มสร้างคอร์สแรกของคุณเลย</p>
          <button @click="showCreateModal = true" class="px-6 py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
            สร้างคอร์สใหม่
          </button>
        </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-800">{{ editingCourse ? 'แก้ไขคอร์ส' : 'สร้างคอร์สใหม่' }}</h2>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="saveCourse" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อคอร์ส</label>
            <input v-model="courseForm.title" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="เช่น Modern Web Development" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
            <textarea v-model="courseForm.description" rows="4" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="อธิบายเกี่ยวกับคอร์สนี้..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">รูปภาพคอร์ส</label>
            
            <!-- Image Preview -->
            <div v-if="courseForm.thumbnail || imagePreview" class="mb-3">
              <img :src="imagePreview || courseForm.thumbnail" alt="Preview" class="w-full h-48 object-cover rounded-lg border border-gray-300" />
            </div>

            <!-- Upload Options -->
            <div class="space-y-3">
              <!-- File Upload -->
              <div>
                <label class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload :size="20" class="text-gray-500" />
                  <span class="text-sm text-gray-600">{{ uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพจากเครื่อง' }}</span>
                  <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" :disabled="uploading" />
                </label>
              </div>

              <!-- URL Input -->
              <div class="relative">
                <input v-model="courseForm.thumbnail" type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="หรือใส่ URL รูปภาพ" @input="imagePreview = null" />
              </div>
            </div>

            <p class="text-xs text-gray-500 mt-2">รองรับไฟล์: JPG, PNG, GIF, WebP (ขนาดไม่เกิน 5MB)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ราคา (บาท)</label>
            <input v-model.number="courseForm.price" type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" placeholder="0" />
          </div>

          <div class="flex items-center gap-2">
            <input v-model="courseForm.published" type="checkbox" id="published" class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <label for="published" class="text-sm font-medium text-gray-700">เผยแพร่คอร์สทันที</label>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" class="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200">
              ยกเลิก
            </button>
            <button type="submit" :disabled="saving" class="flex-1 py-3 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50">
              {{ saving ? 'กำลังบันทึก...' : (editingCourse ? 'บันทึกการแก้ไข' : 'สร้างคอร์ส') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/config/api'
import DashboardLayout from '@/components/DashboardLayout.vue'
import {
  BookOpen,
  LogOut,
  Plus,
  Search,
  Trash2,
  X,
  Upload
} from 'lucide-vue-next'

const router = useRouter()
const courses = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const editingCourse = ref(null)
const saving = ref(false)
const error = ref('')
const searchQuery = ref('')
const filterStatus = ref('all')
const uploading = ref(false)
const imagePreview = ref(null)

const courseForm = ref({
  title: '',
  description: '',
  thumbnail: '',
  price: 0,
  published: false
})

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchQuery.value) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(course =>
      filterStatus.value === 'published' ? course.published : !course.published
    )
  }

  return filtered
})

onMounted(() => {
  loadCourses()
})

const loadCourses = async () => {
  try {
    const response = await api.get('/api/courses')
    courses.value = response.data
    loading.value = false
  } catch (err) {
    console.error('Error loading courses:', err)
    loading.value = false
  }
}

const editCourse = (course) => {
  editingCourse.value = course
  courseForm.value = {
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail || '',
    price: course.price,
    published: course.published
  }
  imagePreview.value = course.thumbnail
  showCreateModal.value = true
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'ขนาดไฟล์ต้องไม่เกิน 5MB'
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, GIF, WebP)'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    courseForm.value.thumbnail = response.data.url
    imagePreview.value = response.data.url
  } catch (err) {
    error.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ'
  } finally {
    uploading.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCourse.value = null
  courseForm.value = {
    title: '',
    description: '',
    thumbnail: '',
    price: 0,
    published: false
  }
  error.value = ''
  imagePreview.value = null
}

const saveCourse = async () => {
  saving.value = true
  error.value = ''

  try {
    if (editingCourse.value) {
      await api.put(`/api/courses/${editingCourse.value.id}`, courseForm.value)
    } else {
      await api.post('/api/courses', courseForm.value)
    }

    await loadCourses()
    closeModal()
  } catch (err) {
    if (err.response?.status === 403) {
      error.value = 'คุณไม่มีสิทธิ์สร้างคอร์ส กรุณาสมัครบัญชีประเภท "ผู้สอน" หรือติดต่อผู้ดูแลระบบ'
    } else {
      error.value = err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึก'
    }
  } finally {
    saving.value = false
  }
}

const deleteCourse = async (courseId) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบคอร์สนี้?')) return

  try {
    await api.delete(`/api/courses/${courseId}`)
    await loadCourses()
  } catch (err) {
    alert(err.response?.data?.error || 'เกิดข้อผิดพลาดในการลบ')
  }
}

const manageLessons = (courseId) => {
  router.push(`/courses/${courseId}/lessons`)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
