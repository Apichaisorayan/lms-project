<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft :size="20" />
          <span>กลับ</span>
        </button>
        <h1 class="text-3xl font-bold text-gray-900">แก้ไขโปรไฟล์ผู้สอน</h1>
        <p class="text-gray-600 mt-2">กรอกข้อมูลของคุณเพื่อให้นักเรียนรู้จักคุณมากขึ้น</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="saveProfile" class="space-y-6">
        <!-- Profile Picture -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">รูปโปรไฟล์</h2>
          
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div class="relative">
              <div v-if="form.avatar_url" class="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
                <img :src="form.avatar_url" alt="Profile" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {{ userName?.charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 shadow-lg">
                <Camera :size="20" />
              </div>
            </div>
            
            <div class="flex-1 space-y-4">
              <!-- File Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">อัพโหลดรูปภาพ</label>
                <div class="flex gap-2">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    :disabled="uploading"
                    class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Upload v-if="!uploading" :size="16" />
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>{{ uploading ? 'กำลังอัพโหลด...' : 'เลือกไฟล์' }}</span>
                  </button>
                  <button
                    v-if="form.avatar_url"
                    type="button"
                    @click="form.avatar_url = ''"
                    class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    ลบรูป
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">รองรับไฟล์ JPG, PNG, GIF (ขนาดไม่เกิน 5MB)</p>
              </div>

              <!-- URL Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">หรือใส่ URL รูปภาพ</label>
                <input
                  v-model="form.avatar_url"
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
          
          <div class="space-y-4">
            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ประวัติส่วนตัว
              </label>
              <textarea
                v-model="form.bio"
                rows="4"
                placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์การสอน และสิ่งที่คุณหลงใหล..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.bio?.length || 0 }} ตัวอักษร</p>
            </div>

            <!-- Expertise -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ความเชี่ยวชาญ
              </label>
              <input
                v-model="form.expertise"
                type="text"
                placeholder="เช่น: Web Development, JavaScript, React, Node.js"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">แยกด้วยเครื่องหมายจุลภาค (,)</p>
            </div>

            <!-- Experience Years -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ประสบการณ์ (ปี)
              </label>
              <input
                v-model.number="form.experience_years"
                type="number"
                min="0"
                placeholder="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Education -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                การศึกษา
              </label>
              <input
                v-model="form.education"
                type="text"
                placeholder="เช่น: ปริญญาตรี วิศวกรรมคอมพิวเตอร์ จุฬาลงกรณ์มหาวิทยาลัย"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">ช่องทางติดต่อ</h2>
          
          <div class="space-y-4">
            <!-- Website -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe :size="16" />
                <span>เว็บไซต์</span>
              </label>
              <input
                v-model="form.website"
                type="url"
                placeholder="https://yourwebsite.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- LinkedIn -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Linkedin :size="16" />
                <span>LinkedIn</span>
              </label>
              <input
                v-model="form.linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Facebook -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Facebook :size="16" />
                <span>Facebook</span>
              </label>
              <input
                v-model="form.facebook"
                type="url"
                placeholder="https://facebook.com/yourprofile"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Twitter -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Twitter :size="16" />
                <span>Twitter</span>
              </label>
              <input
                v-model="form.twitter"
                type="url"
                placeholder="https://twitter.com/yourhandle"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-gradient-to-br from-primary/5 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-primary/20">
          <div class="flex items-center gap-2 mb-4">
            <Eye :size="20" class="text-primary" />
            <h2 class="text-xl font-bold text-gray-900">ตัวอย่างการแสดงผล</h2>
          </div>
          
          <div class="bg-white rounded-xl p-6">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div v-if="form.avatar_url" class="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                  <img :src="form.avatar_url" alt="Preview" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {{ userName?.charAt(0).toUpperCase() }}
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-1">{{ userName }}</h3>
                <div class="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <Briefcase :size="14" />
                    <span>{{ form.experience_years || 0 }} ปีประสบการณ์</span>
                  </div>
                </div>
                <p v-if="form.bio" class="text-gray-700 text-sm mb-3">{{ form.bio }}</p>
                <div v-if="form.expertise" class="flex flex-wrap gap-2">
                  <span
                    v-for="(skill, index) in form.expertise.split(',')"
                    :key="index"
                    class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    {{ skill.trim() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="$router.back()"
            class="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <div v-if="saving" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <Save v-else :size="20" />
            <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/config/api'
import {
  ArrowLeft,
  Camera,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Briefcase,
  Eye,
  Save,
  Upload
} from 'lucide-vue-next'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const userName = ref('')
const fileInput = ref(null)

const form = ref({
  bio: '',
  expertise: '',
  experience_years: 0,
  education: '',
  avatar_url: '',
  website: '',
  linkedin: '',
  facebook: '',
  twitter: ''
})

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  try {
    loading.value = true
    
    // Get user info
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      userName.value = user.name
    }
    
    // Get profile
    const response = await api.get('/api/instructor/profile')
    
    // Populate form
    if (response.data) {
      form.value = {
        bio: response.data.bio || '',
        expertise: response.data.expertise || '',
        experience_years: response.data.experience_years || 0,
        education: response.data.education || '',
        avatar_url: response.data.avatar_url || '',
        website: response.data.website || '',
        linkedin: response.data.linkedin || '',
        facebook: response.data.facebook || '',
        twitter: response.data.twitter || ''
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  } finally {
    loading.value = false
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ ไฟล์มีขนาดใหญ่เกิน 5MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('❌ กรุณาเลือกไฟล์รูปภาพเท่านั้น')
    return
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    form.value.avatar_url = response.data.url
    alert('✅ อัพโหลดรูปภาพสำเร็จ!')
  } catch (error) {
    console.error('Error uploading image:', error)
    alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการอัพโหลด')
  } finally {
    uploading.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const saveProfile = async () => {
  try {
    saving.value = true
    
    await api.post('/api/instructor/profile', form.value)
    
    alert('✅ บันทึกโปรไฟล์สำเร็จ!')
    router.push('/dashboard')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert(error.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}
</script>
