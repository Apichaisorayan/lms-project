<template>
  <div class="group relative">
    <!-- Glow Effect -->
    <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity duration-500"></div>
    
    <!-- Card Content -->
    <div class="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🎯</span>
            <h3 class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{{ quiz.title }}</h3>
          </div>
          <p v-if="quiz.description" class="text-gray-600 text-sm mb-3 line-clamp-2">{{ quiz.description }}</p>
        </div>
        <button
          v-if="canDelete"
          @click="$emit('delete', quiz.id)"
          class="text-red-500 hover:text-white hover:bg-red-500 ml-4 p-2 rounded-xl transition-all duration-200 transform hover:scale-110 hover:rotate-12"
          title="ลบแบบทดสอบ"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-xl">
          <span class="text-lg">❓</span>
          <span class="text-sm font-bold text-purple-700">{{ quiz._count?.questions || quiz.questions?.length || 0 }} คำถาม</span>
        </div>
        <div class="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
          <span class="text-lg">✅</span>
          <span class="text-sm font-bold text-green-700">ผ่าน {{ quiz.passing_score || quiz.passingScore }}%</span>
        </div>
        <div v-if="quiz.time_limit || quiz.timeLimit" class="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl col-span-2">
          <span class="text-lg">⏱️</span>
          <span class="text-sm font-bold text-orange-700">{{ quiz.time_limit || quiz.timeLimit }} นาที</span>
        </div>
      </div>

      <div v-if="lastAttempt" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border-2 border-purple-100">
        <div class="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
          <span>🏆</span>
          <span>ครั้งล่าสุด:</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-black text-lg" :class="lastAttempt.passed ? 'text-green-600' : 'text-red-600'">
            {{ lastAttempt.passed ? '🎉' : '💪' }} {{ lastAttempt.score?.toFixed(1) }}%
          </span>
          <span class="text-xs text-gray-500 font-medium">
            {{ formatDate(lastAttempt.completedAt || lastAttempt.completed_at) }}
          </span>
        </div>
      </div>

      <button
        @click="$emit('start', quiz.id)"
        class="group relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-3 px-6 rounded-xl font-black shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="relative z-10 flex items-center justify-center gap-2">
          <span>{{ lastAttempt ? '🔄 ทำอีกครั้ง' : '🎮 ทดลองทำแบบทดสอบ' }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  quiz: {
    type: Object,
    required: true
  },
  lastAttempt: {
    type: Object,
    default: null
  },
  canDelete: {
    type: Boolean,
    default: false
  }
});

defineEmits(['start', 'delete']);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
