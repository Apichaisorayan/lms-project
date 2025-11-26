<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ quiz.title }}</h3>
        <p v-if="quiz.description" class="text-gray-600 text-sm mb-3">{{ quiz.description }}</p>
      </div>
      <button
        v-if="canDelete"
        @click="$emit('delete', quiz.id)"
        class="text-red-500 hover:text-red-700 ml-4"
        title="ลบแบบทดสอบ"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div class="flex items-center text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ quiz._count?.questions || 0 }} คำถาม</span>
      </div>
      <div class="flex items-center text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>คะแนนผ่าน: {{ quiz.passingScore }}%</span>
      </div>
      <div v-if="quiz.timeLimit" class="flex items-center text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ quiz.timeLimit }} นาที</span>
      </div>
    </div>

    <div v-if="lastAttempt" class="bg-gray-50 rounded p-3 mb-4">
      <div class="text-sm text-gray-600 mb-1">ครั้งล่าสุด:</div>
      <div class="flex items-center justify-between">
        <span class="font-semibold" :class="lastAttempt.passed ? 'text-green-600' : 'text-red-600'">
          คะแนน: {{ lastAttempt.score?.toFixed(1) }}%
        </span>
        <span class="text-xs text-gray-500">
          {{ formatDate(lastAttempt.completedAt) }}
        </span>
      </div>
    </div>

    <button
      @click="$emit('start', quiz.id)"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      {{ lastAttempt ? 'ทำแบบทดสอบอีกครั้ง' : 'เริ่มทำแบบทดสอบ' }}
    </button>
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
