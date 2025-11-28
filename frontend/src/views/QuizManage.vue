<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-8 relative overflow-hidden">
    <!-- Animated Background Shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <!-- Header -->
      <div class="mb-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
              <div class="relative bg-white p-3 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <svg class="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm-4-4h2v2H8V4zm0 4h2v2H8V8zM6 4h2v2H6V4zm0 4h2v2H6V8zm0 12v-2h2v2H6zm2-4H6v-2h2v2zm0-4H6v-2h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">🎯 Quiz Creator</h1>
              <p class="text-white/90 text-sm sm:text-base mt-1 font-medium">สร้างแบบทดสอบสุดสนุก!</p>
            </div>
          </div>
          <button
            @click="showCreateForm = true"
            class="group relative bg-white text-purple-600 px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            <span class="relative z-10 group-hover:text-white transition-colors">สร้างแบบทดสอบ</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
        <p class="mt-4 text-orange-700">Loading...</p>
      </div>

      <!-- Quiz List -->
      <div v-else-if="quizzes.length > 0" class="grid gap-6">
        <QuizCard
          v-for="quiz in quizzes"
          :key="quiz.id"
          :quiz="quiz"
          :can-delete="true"
          @delete="handleDelete"
          @start="startQuiz"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="relative">
        <div class="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
        <div class="relative bg-white/95 rounded-3xl shadow-2xl p-12 sm:p-20 text-center transform hover:scale-105 transition-all duration-500">
          <div class="mb-8 animate-bounce">
            <div class="inline-block p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl">
              <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm-4-4h2v2H8V4zm0 4h2v2H8V8zM6 4h2v2H6V4zm0 4h2v2H6V8zm0 12v-2h2v2H6zm2-4H6v-2h2v2zm0-4H6v-2h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">ยังไม่มีแบบทดสอบ! 🎮</h3>
          <p class="text-gray-600 mb-8 text-lg sm:text-xl font-medium">มาสร้างแบบทดสอบแรกกันเถอะ!</p>
          <button
            @click="showCreateForm = true"
            class="group relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 inline-flex items-center gap-3"
          >
            <svg class="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            <span>สร้างแบบทดสอบแรก</span>
            <span class="text-2xl">🚀</span>
          </button>
        </div>
      </div>

      <!-- Create Quiz Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-orange-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform animate-scale-in">
          <div class="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 p-6 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm-4-4h2v2H8V4zm0 4h2v2H8V8zM6 4h2v2H6V4zm0 4h2v2H6V8zm0 12v-2h2v2H6zm2-4H6v-2h2v2zm0-4H6v-2h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-black text-white drop-shadow-lg">✨ สร้างแบบทดสอบใหม่</h2>
            </div>
            <button @click="closeCreateForm" class="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 transform hover:rotate-90">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto max-h-[calc(90vh-80px)]">

          <div class="p-6">
            <!-- Quiz Info -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                v-model="newQuiz.title"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Chapter 1 Quiz"
              />
            </div>

            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="newQuiz.description"
                rows="3"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe what this quiz covers..."
              ></textarea>
            </div>

            <!-- Quiz Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">ประเภทแบบทดสอบ</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                  :class="newQuiz.quizType === 'pre' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-300 hover:border-blue-300'"
                >
                  <input
                    type="radio"
                    v-model="newQuiz.quizType"
                    value="pre"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div class="ml-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">📝</span>
                      <span class="font-bold text-gray-800">Pre-test</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">ทดสอบก่อนเรียน</p>
                  </div>
                </label>
                
                <label 
                  class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                  :class="newQuiz.quizType === 'post' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-300 hover:border-green-300'"
                >
                  <input
                    type="radio"
                    v-model="newQuiz.quizType"
                    value="post"
                    class="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div class="ml-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">✅</span>
                      <span class="font-bold text-gray-800">Post-test</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">ทดสอบหลังเรียน</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">คะแนนผ่าน (%)</label>
                <input
                  v-model.number="newQuiz.passingScore"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เวลา (นาที)</label>
                <input
                  v-model.number="newQuiz.timeLimit"
                  type="number"
                  min="0"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ไม่จำกัด"
                />
              </div>
            </div>

            <!-- Questions -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Questions</h3>
                <button
                  @click="addQuestion"
                  class="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>

              <div v-for="(question, qIndex) in newQuiz.questions" :key="qIndex" class="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                <div class="flex justify-between items-start mb-3">
                  <span class="text-sm font-medium text-gray-600">Question {{ qIndex + 1 }}</span>
                  <button
                    @click="removeQuestion(qIndex)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="mb-3">
                  <input
                    v-model="question.question"
                    type="text"
                    class="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your question"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3">
                  <select
                    v-model="question.type"
                    class="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                  <input
                    v-model.number="question.points"
                    type="number"
                    min="1"
                    class="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Points"
                  />
                </div>

                <!-- Choices for multiple choice -->
                <div v-if="question.type === 'multiple_choice'" class="space-y-2 mt-3">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-semibold text-gray-700">ตัวเลือกคำตอบ</span>
                    <button
                      @click="addChoice(qIndex)"
                      class="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-lg text-sm font-semibold transition-all"
                    >
                      + เพิ่มตัวเลือก
                    </button>
                  </div>
                  <div
                    v-for="(choice, cIndex) in question.choices"
                    :key="cIndex"
                    class="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-all"
                  >
                    <input
                      type="radio"
                      :name="`correct-${qIndex}`"
                      :checked="choice.isCorrect"
                      @change="setCorrectChoice(qIndex, cIndex)"
                      class="w-5 h-5 text-orange-500 focus:ring-orange-500"
                    />
                    <input
                      v-model="choice.text"
                      type="text"
                      class="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="ตัวเลือก"
                    />
                    <button
                      @click="removeChoice(qIndex, cIndex)"
                      class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="ลบตัวเลือก"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">💡 เลือกวงกลมหน้าคำตอบที่ถูกต้อง</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white p-6 -mx-6 -mb-6 rounded-b-3xl">
              <button
                @click="closeCreateForm"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold transform hover:scale-105"
              >
                ยกเลิก
              </button>
              <button
                @click="handleCreate"
                :disabled="creating || !isValidQuiz"
                class="group relative px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-xl font-black shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <span v-if="creating" class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{{ creating ? 'กำลังสร้าง...' : 'สร้างแบบทดสอบ 🎯' }}</span>
                </span>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import QuizCard from '../components/QuizCard.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const loading = ref(true);
const creating = ref(false);
const showCreateForm = ref(false);
const lesson = ref(null);
const quizzes = ref([]);

const newQuiz = ref({
  title: '',
  description: '',
  passingScore: 70,
  timeLimit: null,
  quizType: 'post', // 'pre' or 'post'
  questions: []
});

const isValidQuiz = computed(() => {
  return newQuiz.value.title && newQuiz.value.questions.length > 0;
});

onMounted(async () => {
  await loadQuizzes();
});

const loadQuizzes = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/lessons/${route.params.lessonId}/quizzes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('ไม่สามารถโหลดแบบทดสอบได้');

    quizzes.value = await response.json();
  } catch (error) {
    console.error('Load quizzes error:', error);
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

const addQuestion = () => {
  newQuiz.value.questions.push({
    type: 'multiple_choice',
    question: '',
    points: 1,
    choices: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false }
    ]
  });
};

const removeQuestion = (index) => {
  newQuiz.value.questions.splice(index, 1);
};

const addChoice = (questionIndex) => {
  newQuiz.value.questions[questionIndex].choices.push({
    text: '',
    isCorrect: false
  });
};

const removeChoice = (questionIndex, choiceIndex) => {
  newQuiz.value.questions[questionIndex].choices.splice(choiceIndex, 1);
};

const setCorrectChoice = (questionIndex, choiceIndex) => {
  newQuiz.value.questions[questionIndex].choices.forEach((choice, index) => {
    choice.isCorrect = index === choiceIndex;
  });
};

const handleCreate = async () => {
  try {
    creating.value = true;
    
    // Validate questions
    if (newQuiz.value.questions.length === 0) {
      toast.error('กรุณาเพิ่มคำถามอย่างน้อย 1 ข้อ');
      creating.value = false;
      return;
    }

    // Validate each question has choices and correct answer
    for (let i = 0; i < newQuiz.value.questions.length; i++) {
      const q = newQuiz.value.questions[i];
      if (!q.question || q.question.trim() === '') {
        toast.error(`กรุณากรอกคำถามที่ ${i + 1}`);
        creating.value = false;
        return;
      }
      if (q.type === 'multiple_choice') {
        if (!q.choices || q.choices.length < 2) {
          toast.error(`คำถามที่ ${i + 1} ต้องมีตัวเลือกอย่างน้อย 2 ตัวเลือก`);
          creating.value = false;
          return;
        }
        const hasCorrect = q.choices.some(c => c.isCorrect || c.is_correct);
        if (!hasCorrect) {
          toast.error(`กรุณาเลือกคำตอบที่ถูกต้องสำหรับคำถามที่ ${i + 1}`);
          creating.value = false;
          return;
        }
      }
    }

    // Map camelCase to snake_case for backend
    const payload = {
      title: newQuiz.value.title,
      description: newQuiz.value.description,
      passing_score: newQuiz.value.passingScore,
      time_limit: newQuiz.value.timeLimit,
      quiz_type: newQuiz.value.quizType,
      questions: newQuiz.value.questions.map(q => ({
        question: q.question,
        type: q.type,
        points: q.points,
        order_index: q.order || 0,
        choices: q.choices ? q.choices.map(c => ({
          text: c.text,
          is_correct: c.isCorrect || c.is_correct || false,
          order_index: c.order || 0
        })) : []
      }))
    };

    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/lessons/${route.params.lessonId}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'ไม่สามารถสร้างแบบทดสอบได้');
    }

    toast.success('สร้างแบบทดสอบเรียบร้อยแล้ว');
    closeCreateForm();
    await loadQuizzes();
  } catch (error) {
    console.error('Create quiz error:', error);
    toast.error(error.message || 'เกิดข้อผิดพลาดในการสร้างแบบทดสอบ');
  } finally {
    creating.value = false;
  }
};

const startQuiz = (quizId) => {
  router.push({ name: 'QuizTake', params: { quizId } });
};

const handleDelete = async (quizId) => {
  const confirmed = await confirm.danger('ลบแบบทดสอบนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้');
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/quizzes/${quizId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('ไม่สามารถลบแบบทดสอบได้');

    toast.success('ลบแบบทดสอบเรียบร้อยแล้ว');
    await loadQuizzes();
  } catch (error) {
    console.error('Delete quiz error:', error);
    toast.error(error.message);
  }
};

const closeCreateForm = () => {
  showCreateForm.value = false;
  newQuiz.value = {
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: null,
    quizType: 'post',
    questions: []
  };
};
</script>
