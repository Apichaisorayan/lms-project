<template>
  <div class="min-h-screen bg-orange-50 py-8">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <svg class="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm-4-4h2v2H8V4zm0 4h2v2H8V8zM6 4h2v2H6V4zm0 4h2v2H6V8zm0 12v-2h2v2H6zm2-4H6v-2h2v2zm0-4H6v-2h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z"/>
              </svg>
              <div>
                <h1 class="text-3xl font-bold text-orange-900">LMS Quiz Creator</h1>
                <p class="text-orange-600 text-sm mt-1">Create and manage your learning quizzes</p>
              </div>
            </div>
          </div>
          <button
            @click="showCreateForm = true"
            class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Quiz
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
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-orange-100 p-20 text-center">
        <div class="mb-8">
          <svg class="w-32 h-32 text-orange-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 2h2v2h-2V4zm0 4h2v2h-2V8zm-4-4h2v2H8V4zm0 4h2v2H8V8zM6 4h2v2H6V4zm0 4h2v2H6V8zm0 12v-2h2v2H6zm2-4H6v-2h2v2zm0-4H6v-2h2v2zm10 8h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V6h8v2z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-orange-900 mb-3">No quizzes yet</h3>
        <p class="text-orange-600 mb-8 text-lg">Get started by creating your first quiz</p>
        <button
          @click="showCreateForm = true"
          class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold shadow-md inline-flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Quiz
        </button>
      </div>

      <!-- Create Quiz Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-white border-b border-orange-100 p-6 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-orange-900">Create New Quiz</h2>
            <button @click="closeCreateForm" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                <input
                  v-model.number="newQuiz.passingScore"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  v-model.number="newQuiz.timeLimit"
                  type="number"
                  min="0"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="No limit"
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
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                @click="closeCreateForm"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                @click="handleCreate"
                :disabled="creating || !isValidQuiz"
                class="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
              >
                {{ creating ? 'Creating...' : 'Create Quiz' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import QuizCard from '../components/QuizCard.vue';

const route = useRoute();
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
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8787/api/lessons/${route.params.lessonId}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newQuiz.value)
    });

    if (!response.ok) throw new Error('ไม่สามารถสร้างแบบทดสอบได้');

    toast.success('สร้างแบบทดสอบเรียบร้อยแล้ว');
    closeCreateForm();
    await loadQuizzes();
  } catch (error) {
    toast.error(error.message);
  } finally {
    creating.value = false;
  }
};

const handleDelete = async (quizId) => {
  const confirmed = await confirm.show('คุณต้องการลบแบบทดสอบนี้หรือไม่?');
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8787/api/quizzes/${quizId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('ไม่สามารถลบแบบทดสอบได้');

    toast.success('ลบแบบทดสอบเรียบร้อยแล้ว');
    await loadQuizzes();
  } catch (error) {
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
    questions: []
  };
};
</script>
