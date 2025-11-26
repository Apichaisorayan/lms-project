<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            บทที่ {{ lesson.order }}
          </span>
          <span v-if="lesson.duration" class="text-sm text-gray-500 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ lesson.duration }} นาที
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ lesson.title }}</h3>
        <p v-if="lesson.content" class="text-gray-600 text-sm line-clamp-2">
          {{ lesson.content }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 mt-4 pt-4 border-t">
      <!-- ปุ่มเรียน -->
      <button
        @click="$emit('learn', lesson.id)"
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        เรียน
      </button>

      <!-- ปุ่มแบบทดสอบ (สำหรับนักเรียน) -->
      <button
        v-if="showQuizButton && !isInstructor"
        @click="$emit('quiz', lesson.id)"
        class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        แบบทดสอบ
      </button>

      <!-- ปุ่มจัดการแบบทดสอบ (สำหรับผู้สอน) -->
      <button
        v-if="isInstructor"
        @click="$emit('manageQuiz', lesson.id)"
        class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        จัดการแบบทดสอบ
      </button>

      <!-- ปุ่มแก้ไข (สำหรับผู้สอน) -->
      <button
        v-if="canEdit"
        @click="$emit('edit', lesson.id)"
        class="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        title="แก้ไข"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>

      <!-- ปุ่มลบ (สำหรับผู้สอน) -->
      <button
        v-if="canDelete"
        @click="$emit('delete', lesson.id)"
        class="bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
        title="ลบ"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  lesson: {
    type: Object,
    required: true
  },
  showQuizButton: {
    type: Boolean,
    default: true
  },
  isInstructor: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  }
});

defineEmits(['learn', 'quiz', 'manageQuiz', 'edit', 'delete']);
</script>
