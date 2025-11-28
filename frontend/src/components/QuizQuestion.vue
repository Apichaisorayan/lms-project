<template>
  <div class="group relative mb-4 sm:mb-6 animate-fade-in">
    <!-- Glow Effect -->
    <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
    
    <!-- Card Content -->
    <div class="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border-2 border-white/50">
      <div class="flex items-start mb-4 sm:mb-6">
        <div class="relative flex-shrink-0 mr-3 sm:mr-4">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-md opacity-50"></div>
          <span class="relative bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
            {{ questionNumber }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base sm:text-xl font-bold text-gray-800 mb-2 leading-relaxed">{{ question.question }}</h3>
          <div class="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full border border-purple-200">
            <span class="text-sm sm:text-base">⭐</span>
            <span class="text-xs sm:text-sm font-bold text-purple-700">{{ question.points }} คะแนน</span>
          </div>
        </div>
      </div>

      <div v-if="question.type === 'multiple_choice'" class="space-y-3 sm:space-y-4">
        <label
          v-for="(choice, index) in question.choices"
          :key="choice.id"
          class="group/choice relative flex items-start p-4 sm:p-5 border-3 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
          :class="getChoiceClass(choice.id)"
        >
          <div class="absolute inset-0 rounded-2xl opacity-0 group-hover/choice:opacity-100 transition-opacity duration-300"
               :class="modelValue === choice.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'"></div>
          <input
            type="radio"
            :name="`question-${question.id}`"
            :value="choice.id"
            :checked="modelValue === choice.id"
            @change="$emit('update:modelValue', choice.id)"
            :disabled="showResult"
            class="relative mt-1 mr-3 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
          />
          <span class="relative flex-1 text-sm sm:text-base font-medium text-gray-800 leading-relaxed">{{ choice.text }}</span>
          <span v-if="showResult && (choice.is_correct || choice.isCorrect)" class="relative text-green-600 ml-2 text-xl sm:text-2xl animate-bounce">✓</span>
        </label>
      </div>

      <div v-else-if="question.type === 'true_false'" class="space-y-3 sm:space-y-4">
        <label
          v-for="option in trueFalseOptions"
          :key="option.value"
          class="group/choice relative flex items-center p-4 sm:p-5 border-3 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
          :class="getChoiceClass(option.value)"
        >
          <div class="absolute inset-0 rounded-2xl opacity-0 group-hover/choice:opacity-100 transition-opacity duration-300"
               :class="modelValue === option.value ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'"></div>
          <input
            type="radio"
            :name="`question-${question.id}`"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="$emit('update:modelValue', option.value)"
            :disabled="showResult"
            class="relative mr-3 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
          />
          <span class="relative text-sm sm:text-base font-medium text-gray-800">{{ option.label }}</span>
        </label>
      </div>

      <div v-else-if="question.type === 'short_answer'">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :disabled="showResult"
          rows="4"
          class="w-full p-4 border-3 border-gray-300 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 text-sm sm:text-base font-medium resize-none"
          placeholder="💭 พิมพ์คำตอบของคุณที่นี่..."
        ></textarea>
      </div>

      <div v-if="showResult && result" class="mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl border-2" :class="(result.is_correct || result.isCorrect) ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ (result.is_correct || result.isCorrect) ? '🎉' : '💪' }}</span>
            <span v-if="result.is_correct || result.isCorrect" class="text-green-700 font-black text-sm sm:text-base">ถูกต้อง!</span>
            <span v-else class="text-red-700 font-black text-sm sm:text-base">ไม่ถูกต้อง</span>
          </div>
          <span class="text-xs sm:text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full">{{ result.points || 0 }}/{{ question.points }} คะแนน</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  modelValue: {
    type: [String, null],
    default: null
  },
  showResult: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    default: null
  }
});

defineEmits(['update:modelValue']);

const trueFalseOptions = [
  { value: 'true', label: 'ถูก' },
  { value: 'false', label: 'ผิด' }
];

const getChoiceClass = (choiceId) => {
  if (!props.showResult) {
    return props.modelValue === choiceId
      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-[1.02]'
      : 'border-gray-200 hover:border-purple-300 bg-white';
  }

  const correctChoice = props.question.choices?.find(c => c.is_correct || c.isCorrect);
  const isCorrect = correctChoice?.id === choiceId;
  const isSelected = props.modelValue === choiceId;

  if (isCorrect) {
    return 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg';
  }
  if (isSelected && !isCorrect) {
    return 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg';
  }
  return 'border-gray-200 bg-white';
};
</script>
