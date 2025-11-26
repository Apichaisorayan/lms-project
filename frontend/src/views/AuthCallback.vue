<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600">กำลังเข้าสู่ระบบ...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const token = route.query.token
  const error = route.query.error

  if (error) {
    alert('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    router.push('/login')
    return
  }

  if (token) {
    // Save token
    localStorage.setItem('token', token)
    
    // Fetch user data
    fetch('http://localhost:8787/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/dashboard')
      })
      .catch(() => {
        alert('เกิดข้อผิดพลาด')
        router.push('/login')
      })
  } else {
    router.push('/login')
  }
})
</script>
