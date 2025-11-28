<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-4 sm:py-8 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <div class="max-w-4xl mx-auto px-3 sm:px-4 relative z-10">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block p-6 bg-white/20 backdrop-blur-lg rounded-3xl">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p class="text-white font-bold text-lg">กำลังโหลดแบบทดสอบ...</p>
        </div>
      </div>

      <!-- Quiz Header -->
      <div v-else-if="attempt && !submitted" class="mb-4 sm:mb-6 animate-fade-in">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border-2 border-white/50">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1 min-w-0 mr-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl sm:text-3xl">🎯</span>
                <h1 class="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 truncate">{{ attempt.quiz.title }}</h1>
              </div>
              <p v-if="attempt.quiz.description" class="text-gray-600 text-sm sm:text-base line-clamp-2">{{ attempt.quiz.description }}</p>
            </div>
            <button
              @click="handleCancel"
              class="flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all transform hover:scale-110 hover:rotate-90"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div class="bg-purple-50 px-3 py-2 rounded-xl flex items-center gap-2">
              <span class="text-lg">❓</span>
              <span class="text-xs sm:text-sm font-bold text-purple-700">{{ attempt.quiz.questions.length }} คำถาม</span>
            </div>
            <div class="bg-green-50 px-3 py-2 rounded-xl flex items-center gap-2">
              <span class="text-lg">✅</span>
              <span class="text-xs sm:text-sm font-bold text-green-700">ผ่าน {{ attempt.quiz.passing_score || attempt.quiz.passingScore }}%</span>
            </div>
            <div v-if="timeRemaining !== null" class="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl flex items-center gap-2" :class="timeRemaining < 60 ? 'bg-red-50' : 'bg-blue-50'">
              <span class="text-lg">⏱️</span>
              <span class="text-xs sm:text-sm font-black" :class="timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-blue-700'">
                {{ formatTime(timeRemaining) }}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="bg-gray-100 rounded-2xl p-3 sm:p-4">
            <div class="flex justify-between text-xs sm:text-sm font-bold text-gray-700 mb-2">
              <span>ความคืบหน้า 🚀</span>
              <span class="text-purple-600">{{ answeredCount }}/{{ attempt.quiz.questions.length }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
              <div
                class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                :style="{ width: `${(answeredCount / attempt.quiz.questions.length) * 100}%` }"
              >
                <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions -->
      <div v-if="attempt && !submitted">
        <QuizQuestion
          v-for="(question, index) in attempt.quiz.questions"
          :key="question.id"
          :question="question"
          :question-number="index + 1"
          v-model="answers[question.id]"
        />

        <div class="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-2 border-white/50">
          <button
            @click="handleCancel"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold transform hover:scale-105"
          >
            ❌ ยกเลิก
          </button>
          <button
            @click="handleSubmit"
            :disabled="submitting"
            class="group relative px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-xl font-black shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative z-10 flex items-center justify-center gap-2">
              <span v-if="submitting" class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ submitting ? 'กำลังส่ง...' : '🚀 ส่งคำตอบ' }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="submitted && result" class="animate-scale-in">
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-white/50 mb-6">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-6 animate-bounce"
                 :class="result.passed ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-pink-600'">
              <span class="text-5xl sm:text-7xl">{{ result.passed ? '🎉' : '💪' }}</span>
            </div>
            <h2 class="text-4xl sm:text-5xl font-black mb-4" :class="result.passed ? 'text-green-600' : 'text-red-600'">
              {{ result.passed ? 'ยินดีด้วย! ผ่าน!' : 'เกือบแล้ว!' }}
            </h2>
            <div class="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-1 rounded-3xl mb-4">
              <div class="bg-white px-8 py-4 rounded-3xl">
                <p class="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {{ result.score.toFixed(1) }}%
                </p>
              </div>
            </div>
            <p class="text-gray-600 text-lg font-medium">คะแนนผ่าน: {{ attempt.quiz.passing_score || attempt.quiz.passingScore }}%</p>
          </div>

        <div class="border-t pt-6">
          <h3 class="text-xl font-semibold mb-4">รายละเอียดคำตอบ</h3>
          <QuizQuestion
            v-for="(question, index) in attempt.quiz.questions"
            :key="question.id"
            :question="question"
            :question-number="index + 1"
            :model-value="getAnswerForQuestion(question.id)"
            :show-result="true"
            :result="getResultForQuestion(question.id)"
          />
        </div>

          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
            <button
              @click="$router.back()"
              class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold transform hover:scale-105"
            >
              ⬅️ กลับ
            </button>
            <button
              @click="retakeQuiz"
              class="group relative px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-xl font-black shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10">🔄 ทำอีกครั้ง</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import QuizQuestion from '../components/QuizQuestion.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const loading = ref(true);
const submitting = ref(false);
const submitted = ref(false);
const attempt = ref(null);
const answers = ref({});
const result = ref(null);
const timeRemaining = ref(null);
let timer = null;

const answeredCount = computed(() => {
  return Object.values(answers.value).filter(a => a !== null && a !== '').length;
});

onMounted(async () => {
  await startQuiz();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const startQuiz = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    
    // First, get quiz details
    const quizResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/quizzes/${route.params.quizId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!quizResponse.ok) throw new Error('ไม่สามารถโหลดแบบทดสอบได้');
    
    const quiz = await quizResponse.json();
    
    // Start attempt
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/quizzes/${route.params.quizId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('ไม่สามารถเริ่มแบบทดสอบได้');

    const attemptData = await response.json();
    attempt.value = {
      ...attemptData,
      quiz: quiz
    };
    
    // Initialize answers
    attempt.value.quiz.questions.forEach(q => {
      answers.value[q.id] = null;
    });

    // Start timer if time limit exists
    if (attempt.value.quiz.timeLimit) {
      timeRemaining.value = attempt.value.quiz.timeLimit * 60;
      timer = setInterval(() => {
        timeRemaining.value--;
        if (timeRemaining.value <= 0) {
          clearInterval(timer);
          handleSubmit(true);
        }
      }, 1000);
    }
  } catch (error) {
    toast.error(error.message);
    router.back();
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (autoSubmit = false) => {
  if (!autoSubmit) {
    const unanswered = attempt.value.quiz.questions.length - answeredCount.value;
    if (unanswered > 0) {
      const confirmed = await confirm.show(
        `คุณยังไม่ได้ตอบคำถาม ${unanswered} ข้อ คุณต้องการส่งคำตอบหรือไม่?`
      );
      if (!confirmed) return;
    }
  }

  try {
    submitting.value = true;
    if (timer) clearInterval(timer);

    // Map answers to backend format (snake_case)
    const answersArray = Object.entries(answers.value).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      answer: answer ? String(answer) : ''
    }));

    console.log('Submitting answers:', answersArray); // Debug log

    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/attempts/${attempt.value.id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers: answersArray })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Submit error:', errorData);
      throw new Error(errorData.error || 'ไม่สามารถส่งคำตอบได้');
    }

    const resultData = await response.json();
    console.log('Result:', resultData); // Debug log
    
    result.value = resultData;
    submitted.value = true;
    
    if (autoSubmit) {
      toast.warning('หมดเวลาทำแบบทดสอบ ระบบส่งคำตอบอัตโนมัติ');
    } else {
      toast.success('ส่งคำตอบเรียบร้อยแล้ว');
    }
  } catch (error) {
    console.error('Submit error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการส่งคำตอบ');
  } finally {
    submitting.value = false;
  }
};

const handleCancel = async () => {
  const confirmed = await confirm.show(
    'คุณต้องการยกเลิกการทำแบบทดสอบหรือไม่? คำตอบของคุณจะไม่ถูกบันทึก'
  );
  if (confirmed) {
    if (timer) clearInterval(timer);
    router.back();
  }
};

const retakeQuiz = () => {
  submitted.value = false;
  result.value = null;
  startQuiz();
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getAnswerForQuestion = (questionId) => {
  if (!result.value?.answers) return null;
  const answer = result.value.answers.find(a => (a.question_id || a.questionId) === questionId);
  return answer?.answer || null;
};

const getResultForQuestion = (questionId) => {
  if (!result.value?.answers) return null;
  return result.value.answers.find(a => (a.question_id || a.questionId) === questionId);
};
</script>
