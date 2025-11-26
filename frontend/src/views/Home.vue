<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="bg-gradient-to-br from-primary to-orange-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <GraduationCap :size="28" class="text-white" />
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              LearnHub
            </span>
          </router-link>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-6">
            <a href="#features" class="text-gray-600 hover:text-primary transition-colors">คุณสมบัติ</a>
            <a href="#courses" class="text-gray-600 hover:text-primary transition-colors">คอร์สเรียน</a>
            <a href="#pricing" class="text-gray-600 hover:text-primary transition-colors">ราคา</a>
            <a href="#about" class="text-gray-600 hover:text-primary transition-colors">เกี่ยวกับเรา</a>
            <router-link to="/login" class="text-gray-600 hover:text-primary transition-colors">
              เข้าสู่ระบบ
            </router-link>
            <router-link to="/register" class="px-6 py-2.5 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
              เริ่มต้นฟรี
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2">
            <Menu v-if="!mobileMenuOpen" :size="24" />
            <X v-else :size="24" />
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4 space-y-3">
          <a href="#features" class="block text-gray-600 hover:text-primary transition-colors">คุณสมบัติ</a>
          <a href="#courses" class="block text-gray-600 hover:text-primary transition-colors">คอร์สเรียน</a>
          <a href="#pricing" class="block text-gray-600 hover:text-primary transition-colors">ราคา</a>
          <a href="#about" class="block text-gray-600 hover:text-primary transition-colors">เกี่ยวกับเรา</a>
          <router-link to="/login" class="block text-gray-600 hover:text-primary transition-colors">
            เข้าสู่ระบบ
          </router-link>
          <router-link to="/register" class="block px-6 py-2.5 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg text-center">
            เริ่มต้นฟรี
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-6 animate-fade-in">
            <div class="inline-block px-4 py-2 bg-orange-100 text-primary rounded-full text-sm font-semibold">
              🎓 แพลตฟอร์มเรียนออนไลน์ยอดนิยม
            </div>
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              เรียนรู้สิ่งใหม่
              <span class="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                ทุกที่ ทุกเวลา
              </span>
            </h1>
            <p class="text-xl text-gray-600">
              เข้าถึงคอร์สเรียนคุณภาพสูงกว่า 10,000+ หลักสูตร จากผู้เชี่ยวชาญ 
              เรียนรู้ในสิ่งที่คุณสนใจ พัฒนาทักษะของคุณวันนี้
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/register" class="px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <span>เริ่มเรียนฟรี</span>
                <ArrowRight :size="20" />
              </router-link>
              <a href="#courses" class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-primary hover:text-primary transition-all duration-300">
                ดูคอร์สเรียน
              </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div class="text-3xl font-bold text-primary">10K+</div>
                <div class="text-sm text-gray-600">คอร์สเรียน</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-primary">50K+</div>
                <div class="text-sm text-gray-600">นักเรียน</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-primary">95%</div>
                <div class="text-sm text-gray-600">ความพึงพอใจ</div>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="relative animate-scale-in">
            <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
            <div class="relative bg-white rounded-3xl shadow-2xl p-8">
              <div class="aspect-square bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center">
                <GraduationCap :size="120" class="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">ทำไมต้องเลือก LearnHub?</h2>
          <p class="text-xl text-gray-600">แพลตฟอร์มที่ออกแบบมาเพื่อการเรียนรู้ที่มีประสิทธิภาพ</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen :size="32" class="text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">คอร์สหลากหลาย</h3>
            <p class="text-gray-600">เลือกเรียนจากคอร์สมากกว่า 10,000+ หลักสูตร ครอบคลุมทุกสาขาวิชา</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users :size="32" class="text-purple-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">ผู้เชี่ยวชาญ</h3>
            <p class="text-gray-600">เรียนจากผู้เชี่ยวชาญและครูผู้สอนที่มีประสบการณ์จริง</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award :size="32" class="text-green-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">ใบประกาศนียบัตร</h3>
            <p class="text-gray-600">รับใบประกาศนียบัตรเมื่อจบคอร์ส เพิ่มมูลค่าให้กับ Resume</p>
          </div>

          <!-- Feature 4 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock :size="32" class="text-orange-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">เรียนได้ทุกที่</h3>
            <p class="text-gray-600">เข้าถึงเนื้อหาได้ตลอด 24/7 เรียนในเวลาที่เหมาะกับคุณ</p>
          </div>

          <!-- Feature 5 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video :size="32" class="text-pink-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">วิดีโอคุณภาพสูง</h3>
            <p class="text-gray-600">เนื้อหาวิดีโอ HD พร้อมเอกสารประกอบและแบบทดสอบ</p>
          </div>

          <!-- Feature 6 -->
          <div class="p-8 rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
            <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle :size="32" class="text-indigo-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">ชุมชนผู้เรียน</h3>
            <p class="text-gray-600">แลกเปลี่ยนความรู้และประสบการณ์กับผู้เรียนคนอื่นๆ</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses Section -->
    <section id="courses" class="py-20 bg-gray-50">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">คอร์สยอดนิยม</h2>
          <p class="text-xl text-gray-600">เลือกเรียนจากคอร์สที่ได้รับความนิยมสูงสุด</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Course Card 1 -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code :size="64" class="text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">Programming</span>
                <span class="text-sm text-gray-500">⭐ 4.9</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Web Development Bootcamp</h3>
              <p class="text-gray-600 text-sm mb-4">เรียนรู้การสร้างเว็บไซต์ตั้งแต่พื้นฐานจนถึงขั้นสูง</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">ฟรี</span>
                <router-link to="/register" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">
                  เริ่มเรียน
                </router-link>
              </div>
            </div>
          </div>

          <!-- Course Card 2 -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div class="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <Palette :size="64" class="text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">Design</span>
                <span class="text-sm text-gray-500">⭐ 4.8</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">UI/UX Design Masterclass</h3>
              <p class="text-gray-600 text-sm mb-4">เรียนรู้การออกแบบ UI/UX แบบมืออาชีพ</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">ฟรี</span>
                <router-link to="/register" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">
                  เริ่มเรียน
                </router-link>
              </div>
            </div>
          </div>

          <!-- Course Card 3 -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
            <div class="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <TrendingUp :size="64" class="text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">Business</span>
                <span class="text-sm text-gray-500">⭐ 4.9</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Digital Marketing 2024</h3>
              <p class="text-gray-600 text-sm mb-4">เรียนรู้กลยุทธ์การตลาดดิจิทัลยุคใหม่</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">ฟรี</span>
                <router-link to="/register" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">
                  เริ่มเรียน
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link to="/browse" class="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300">
            <span>ดูคอร์สทั้งหมด</span>
            <ArrowRight :size="20" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-orange-600">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          พร้อมที่จะเริ่มต้นการเรียนรู้แล้วหรือยัง?
        </h2>
        <p class="text-xl text-white/90 mb-8">
          เข้าร่วมกับนักเรียนกว่า 50,000+ คน และเริ่มพัฒนาทักษะของคุณวันนี้
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/register" class="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            สมัครสมาชิกฟรี
          </router-link>
          <router-link to="/browse" class="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-300">
            เรียกดูคอร์ส
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="bg-gradient-to-br from-primary to-orange-600 p-2 rounded-xl">
                <GraduationCap :size="24" class="text-white" />
              </div>
              <span class="text-xl font-bold">LearnHub</span>
            </div>
            <p class="text-gray-400 text-sm">
              แพลตฟอร์มเรียนออนไลน์ที่ช่วยให้คุณเรียนรู้สิ่งใหม่ๆ และพัฒนาทักษะ
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-bold mb-4">เมนูด่วน</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">คุณสมบัติ</a></li>
              <li><a href="#courses" class="hover:text-white transition-colors">คอร์สเรียน</a></li>
              <li><router-link to="/browse" class="hover:text-white transition-colors">เรียกดูทั้งหมด</router-link></li>
              <li><router-link to="/register" class="hover:text-white transition-colors">สมัครสมาชิก</router-link></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="font-bold mb-4">ช่วยเหลือ</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">ศูนย์ช่วยเหลือ</a></li>
              <li><a href="#" class="hover:text-white transition-colors">คำถามที่พบบ่อย</a></li>
              <li><a href="#" class="hover:text-white transition-colors">ติดต่อเรา</a></li>
              <li><a href="#" class="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a></li>
            </ul>
          </div>

          <!-- Social -->
          <div>
            <h3 class="font-bold mb-4">ติดตามเรา</h3>
            <div class="flex gap-3">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span class="text-xl">f</span>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span class="text-xl">𝕏</span>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <span class="text-xl">in</span>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  Video, 
  MessageCircle,
  Code,
  Palette,
  TrendingUp
} from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.8s ease-out;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>
