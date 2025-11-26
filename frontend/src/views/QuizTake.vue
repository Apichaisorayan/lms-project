<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลด...</p>
      </div>

      <!-- Quiz Header -->
      <div v-else-if="attempt && !submitted" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ attempt.quiz.title }}</h1>
            <p v-if="attempt.quiz.description" class="text-gray-600">{{ attempt.quiz.description }}</p>
          </div>
          <button
            @click="handleCancel"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
          <span>{{ attempt.quiz.questions.length }} คำถาม</span>
          <span>คะแนนผ่าน: {{ attempt.quiz.passingScore }}%</span>
          <span v-if="timeRemaining !== null" class="font-semibold" :class="timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'">
            เวลาคงเหลือ: {{ formatTime(timeRemaining) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>ความคืบหน้า</span>
            <span>{{ answeredCount }}/{{ attempt.quiz.questions.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all"
              :style="{ width: `${(answeredCount / attempt.quiz.questions.length) * 100}%` }"
            ></div>
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

        <div class="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
          <button
            @click="handleCancel"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="handleSubmit"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'กำลังส่ง...' : 'ส่งคำตอบ' }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="submitted && result" class="bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
               :class="result.passed ? 'bg-green-100' : 'bg-red-100'">
            <svg v-if="result.passed" class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold mb-2" :class="result.passed ? 'text-green-600' : 'text-red-600'">
            {{ result.passed ? 'ผ่าน!' : 'ไม่ผ่าน' }}
          </h2>
          <p class="text-5xl font-bold text-gray-800 mb-2">{{ result.score.toFixed(1) }}%</p>
          <p class="text-gray-600">คะแนนผ่าน: {{ attempt.quiz.passingScore }}%</p>
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

        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="$router.back()"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            กลับ
          </button>
          <button
            @click="retakeQuiz"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ทำแบบทดสอบอีกครั้ง
          </button>
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
    const response = await fetch(`http://localhost:8787/api/quizzes/${route.params.quizId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('ไม่สามารถเริ่มแบบทดสอบได้');

    attempt.value = await response.json();
    
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

    const answersArray = Object.entries(answers.value).map(([questionId, answer]) => ({
      questionId,
      answer: answer || ''
    }));

    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8787/api/attempts/${attempt.value.id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers: answersArray })
    });

    if (!response.ok) throw new Error('ไม่สามารถส่งคำตอบได้');

    result.value = await response.json();
    submitted.value = true;
    
    if (autoSubmit) {
      toast.warning('หมดเวลาทำแบบทดสอบ ระบบส่งคำตอบอัตโนมัติ');
    } else {
      toast.success('ส่งคำตอบเรียบร้อยแล้ว');
    }
  } catch (error) {
    toast.error(error.message);
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
  const answer = result.value.answers.find(a => a.questionId === questionId);
  return answer?.answer || null;
};

const getResultForQuestion = (questionId) => {
  return result.value.answers.find(a => a.questionId === questionId);
};
</script>
