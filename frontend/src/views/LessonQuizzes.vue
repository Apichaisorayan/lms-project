<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          @click="$router.back()"
          class="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          กลับ
        </button>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">แบบทดสอบ</h1>
        <p class="text-gray-600">{{ lesson?.title }}</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <!-- Quiz List -->
      <div v-else-if="quizzes.length > 0" class="grid gap-6 md:grid-cols-2">
        <QuizCard
          v-for="quiz in quizzes"
          :key="quiz.id"
          :quiz="quiz"
          :last-attempt="getLastAttempt(quiz.id)"
          @start="startQuiz"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีแบบทดสอบ</h3>
        <p class="text-gray-500">บทเรียนนี้ยังไม่มีแบบทดสอบ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import QuizCard from '../components/QuizCard.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const lesson = ref(null);
const quizzes = ref([]);
const attempts = ref({});

onMounted(async () => {
  await loadQuizzes();
  await loadAttempts();
});

const loadQuizzes = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8787/api/lessons/${route.params.lessonId}/quizzes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('ไม่สามารถโหลดแบบทดสอบได้');

    quizzes.value = await response.json();
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

const loadAttempts = async () => {
  try {
    const token = localStorage.getItem('token');
    
    for (const quiz of quizzes.value) {
      const response = await fetch(`http://localhost:8787/api/quizzes/${quiz.id}/attempts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const quizAttempts = await response.json();
        if (quizAttempts.length > 0) {
          attempts.value[quiz.id] = quizAttempts;
        }
      }
    }
  } catch (error) {
    console.error('Error loading attempts:', error);
  }
};

const getLastAttempt = (quizId) => {
  const quizAttempts = attempts.value[quizId];
  if (!quizAttempts || quizAttempts.length === 0) return null;
  return quizAttempts[0];
};

const startQuiz = (quizId) => {
  router.push({ name: 'QuizTake', params: { quizId } });
};
</script>
