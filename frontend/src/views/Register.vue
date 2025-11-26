<template>
  <div class="min-h-screen flex">
    <!-- Left side - Hero Image/Illustration -->
    <div class="hidden lg:flex flex-1 bg-gradient-to-br from-orange-600 via-orange-500 to-primary p-12 items-center justify-center relative overflow-hidden">
      <!-- Animated background shapes -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style="animation-delay: 1.5s"></div>
      </div>

      <div class="relative z-10 text-primary-foreground max-w-md animate-scale-in">
        <div class="mb-8">
          <div class="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <GraduationCap :size="64" />
          </div>
          <h2 class="text-4xl font-bold mb-4">เริ่มต้นการเรียนรู้ที่จะเปลี่ยนชีวิตคุณ</h2>
          <p class="text-lg text-primary-foreground/90">
            เข้าถึงคอร์สเรียนมากกว่า 10,000+ หลักสูตร จากผู้เชี่ยวชาญ เรียนรู้ในสิ่งที่คุณสนใจ ในเวลาที่คุณต้องการ
          </p>
        </div>

        <!-- Features -->
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <div class="bg-white/20 rounded-lg p-2 mt-1">
              <Check :size="20" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">เข้าถึงคอร์สไม่จำกัด</h3>
              <p class="text-sm text-primary-foreground/80">เรียนได้ทุกที่ ทุกเวลา ไม่มีข้อจำกัด</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="bg-white/20 rounded-lg p-2 mt-1">
              <Check :size="20" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">ใบประกาศรับรอง</h3>
              <p class="text-sm text-primary-foreground/80">รับใบประกาศเมื่อจบคอร์สสำเร็จ</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="bg-white/20 rounded-lg p-2 mt-1">
              <Check :size="20" />
            </div>
            <div>
              <h3 class="font-semibold mb-1">เรียนด้วยความเร็วของคุณ</h3>
              <p class="text-sm text-primary-foreground/80">เนื้อหาตลอดชีพ เรียนได้ตามจังหวะ</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Register Form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-background">
      <div class="w-full max-w-md animate-fade-in">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 mb-8 group">
          <div class="bg-gradient-to-br from-primary to-orange-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <GraduationCap :size="24" class="text-primary-foreground" />
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            LearnHub
          </span>
        </router-link>

        <!-- Welcome Text -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">ยินดีต้อนรับกลับสู่ระบบ</h1>
          <p class="text-muted-foreground">เข้าสู่ระบบเพื่อเริ่มต้นการเรียนรู้ของคุณ</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Name Field -->
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium">ชื่อ-นามสกุล</label>
            <div class="relative group">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <input
                id="name"
                type="text"
                placeholder="สมชาย ใจดี"
                v-model="formData.name"
                class="w-full pl-10 h-12 border-2 rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">อีเมล</label>
            <div class="relative group">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                v-model="formData.email"
                class="w-full pl-10 h-12 border-2 rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">รหัสผ่าน</label>
            <div class="relative group">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="formData.password"
                class="w-full pl-10 pr-10 h-12 border-2 rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <EyeOff v-if="showPassword" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-medium">ยืนยันรหัสผ่าน</label>
            <div class="relative group">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="formData.confirmPassword"
                class="w-full pl-10 pr-10 h-12 border-2 rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <EyeOff v-if="showConfirmPassword" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Role Selection -->
          <div class="space-y-2">
            <label class="text-sm font-medium">ประเภทบัญชี</label>
            <div class="grid grid-cols-3 gap-3">
              <label class="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
                :class="formData.role === 'STUDENT' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'">
                <input type="radio" v-model="formData.role" value="STUDENT" class="sr-only" />
                <div class="text-center">
                  <User :size="24" class="mx-auto mb-2" :class="formData.role === 'STUDENT' ? 'text-primary' : 'text-gray-500'" />
                  <span class="text-sm font-medium" :class="formData.role === 'STUDENT' ? 'text-primary' : 'text-gray-700'">นักเรียน</span>
                </div>
              </label>
              <label class="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
                :class="formData.role === 'INSTRUCTOR' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'">
                <input type="radio" v-model="formData.role" value="INSTRUCTOR" class="sr-only" />
                <div class="text-center">
                  <GraduationCap :size="24" class="mx-auto mb-2" :class="formData.role === 'INSTRUCTOR' ? 'text-primary' : 'text-gray-500'" />
                  <span class="text-sm font-medium" :class="formData.role === 'INSTRUCTOR' ? 'text-primary' : 'text-gray-700'">ผู้สอน</span>
                </div>
              </label>
              <label class="relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
                :class="formData.role === 'ADMIN' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'">
                <input type="radio" v-model="formData.role" value="ADMIN" class="sr-only" />
                <div class="text-center">
                  <Shield :size="24" class="mx-auto mb-2" :class="formData.role === 'ADMIN' ? 'text-primary' : 'text-gray-500'" />
                  <span class="text-sm font-medium" :class="formData.role === 'ADMIN' ? 'text-primary' : 'text-gray-700'">ผู้ดูแล</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <label class="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              v-model="acceptTerms"
              class="w-4 h-4 rounded border-2 border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 mt-1"
              required
            />
            <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              ฉันยอมรับ
              <router-link to="/terms" class="text-primary hover:text-orange-600 font-medium">เงื่อนไขการใช้งาน</router-link>
              และ
              <router-link to="/privacy" class="text-primary hover:text-orange-600 font-medium">นโยบายความเป็นส่วนตัว</router-link>
            </span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full h-12 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              <span>กำลังสร้างบัญชี...</span>
            </div>
            <span v-else>สร้างบัญชี</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-background text-muted-foreground">หรือสมัครด้วย</span>
          </div>
        </div>

        <!-- Social Register -->
        <div class="grid grid-cols-2 gap-3">
          <a
            :href="OAUTH_URLS.google"
            class="h-12 border-2 rounded-lg hover:border-primary hover:bg-accent transition-all duration-200 bg-transparent flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </a>
          <a
            :href="OAUTH_URLS.facebook"
            class="h-12 border-2 rounded-lg hover:border-primary hover:bg-accent transition-all duration-200 bg-transparent flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </a>
        </div>

        <!-- Login link -->
        <p class="text-center mt-8 text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว?
          <router-link to="/login" class="text-primary hover:text-orange-600 font-semibold transition-colors duration-200">
            เข้าสู่ระบบ
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, OAUTH_URLS } from '@/config/api'
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, Check, Shield } from 'lucide-vue-next'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'STUDENT'
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''

  // Validate passwords match
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  // Validate password length
  if (formData.value.password.length < 6) {
    errorMessage.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  isLoading.value = true

  try {
    const response = await api.post('/api/auth/register', {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      role: formData.value.role
    })

    // Registration successful
    console.log('Registration successful:', response.data)
    
    // Redirect to login page
    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี'
  } finally {
    isLoading.value = false
  }
}
</script>
