<template>
  <div class="min-h-screen flex">
    <!-- Left side - Login Form -->
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

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
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

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                v-model="rememberMe"
                class="w-4 h-4 rounded border-2 border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
              />
              <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                จดจำฉันไว้
              </span>
            </label>
            <router-link to="/forgot-password" class="text-sm text-primary hover:text-orange-600 font-medium transition-colors duration-200">
              ลืมรหัสผ่าน?
            </router-link>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full h-12 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-primary-foreground font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              <span>กำลังเข้าสู่ระบบ...</span>
            </div>
            <span v-else>เข้าสู่ระบบ</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-background text-muted-foreground">หรือเข้าสู่ระบบด้วย</span>
          </div>
        </div>

        <!-- Social Login -->
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

        <!-- Register link -->
        <p class="text-center mt-8 text-sm text-muted-foreground">
          ยังไม่มีบัญชี?
          <router-link to="/register" class="text-primary hover:text-orange-600 font-semibold transition-colors duration-200">
            สมัครสมาชิกฟรี
          </router-link>
        </p>
      </div>
    </div>

    <!-- Right side - Hero Image/Illustration -->
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

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 text-center">
          <div>
            <div class="text-3xl font-bold mb-1">10K+</div>
            <div class="text-sm text-primary-foreground/80">คอร์สเรียน</div>
          </div>
          <div>
            <div class="text-3xl font-bold mb-1">50K+</div>
            <div class="text-sm text-primary-foreground/80">นักเรียน</div>
          </div>
          <div>
            <div class="text-3xl font-bold mb-1">95%</div>
            <div class="text-sm text-primary-foreground/80">ความพึงพอใจ</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { api, OAUTH_URLS } from '@/config/api'

const router = useRouter()

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await api.post('/api/auth/login', {
      email: formData.value.email,
      password: formData.value.password
    })

    // Login successful
    console.log('Login successful:', response.data)
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    // Redirect to dashboard or home
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    isLoading.value = false
  }
}
</script>
