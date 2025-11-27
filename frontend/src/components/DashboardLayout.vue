<template>
  <div class="min-h-screen bg-gray-50 overflow-x-hidden">
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
          :class="isActive('/dashboard') ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="closeMobileMenu"
        >
          <LayoutDashboard :size="20" />
          <span class="font-medium">แดชบอร์ด</span>
        </router-link>

        <!-- Courses -->
        <router-link
          to="/dashboard/courses"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="isActive('/dashboard/courses') ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="closeMobileMenu"
        >
          <BookOpen :size="20" />
          <span class="font-medium">คอร์สเรียนทั้งหมด</span>
        </router-link>

        <!-- Browse Courses -->
        <router-link
          to="/courses"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="isActive('/courses') ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="closeMobileMenu"
        >
          <Search :size="20" />
          <span class="font-medium">ค้นหาคอร์ส</span>
        </router-link>

        <!-- Progress -->
        <router-link
          to="/dashboard/progress"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="isActive('/dashboard/progress') ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="closeMobileMenu"
        >
          <TrendingUp :size="20" />
          <span class="font-medium">ความก้าวหน้า</span>
        </router-link>

        <!-- Certificates -->
        <router-link
          to="/dashboard/certificates"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="isActive('/dashboard/certificates') ? 'bg-gradient-to-r from-primary to-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          @click="closeMobileMenu"
        >
          <Award :size="20" />
          <span class="font-medium">ใบประกาศนียบัตร</span>
        </router-link>
      </nav>

      <!-- Bottom Menu -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
        <!-- Instructor Profile (only for instructors) -->
        <router-link
          v-if="user?.role === 'INSTRUCTOR'"
          to="/instructor/profile"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full"
          @click="closeMobileMenu"
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

          <!-- Header Content Slot -->
          <slot name="header">
            <div class="flex-1 ml-4 lg:ml-0">
              <h1 class="text-lg lg:text-2xl font-bold text-gray-800">{{ title }}</h1>
              <p v-if="subtitle" class="text-xs lg:text-sm text-gray-500 mt-1 hidden sm:block">{{ subtitle }}</p>
            </div>
          </slot>

          <!-- Right Side -->
          <div class="flex items-center gap-2 lg:gap-4">
            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell :size="20" class="text-gray-600" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <!-- User Avatar -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-semibold text-sm lg:text-base">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Slot -->
      <main class="p-4 lg:p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Search,
  TrendingUp,
  Award,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
} from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

const user = computed(() => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
})

const isActive = (path) => {
  // Exact match for dashboard root
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  // For other paths, check if current path starts with it
  return route.path === path || route.path.startsWith(path + '/')
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
