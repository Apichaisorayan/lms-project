<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="flex items-start mb-4">
      <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
        {{ questionNumber }}
      </span>
      <div class="flex-1">
        <h3 class="text-lg font-medium text-gray-800 mb-1">{{ question.question }}</h3>
        <span class="text-sm text-gray-500">{{ question.points }} คะแนน</span>
      </div>
    </div>

    <div v-if="question.type === 'multiple_choice'" class="space-y-3 ml-11">
      <label
        v-for="choice in question.choices"
        :key="choice.id"
        class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="getChoiceClass(choice.id)"
      >
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="choice.id"
          :checked="modelValue === choice.id"
          @change="$emit('update:modelValue', choice.id)"
          :disabled="showResult"
          class="mt-1 mr-3 w-4 h-4 text-blue-600"
        />
        <span class="flex-1 text-gray-700">{{ choice.text }}</span>
        <span v-if="showResult && choice.isCorrect" class="text-green-600 ml-2">✓</span>
      </label>
    </div>

    <div v-else-if="question.type === 'true_false'" class="space-y-3 ml-11">
      <label
        v-for="option in trueFalseOptions"
        :key="option.value"
        class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
        :class="getChoiceClass(option.value)"
      >
        <input
          type="radio"
          :name="`question-${question.id}`"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          :disabled="showResult"
          class="mr-3 w-4 h-4 text-blue-600"
        />
        <span class="text-gray-700">{{ option.label }}</span>
      </label>
    </div>

    <div v-else-if="question.type === 'short_answer'" class="ml-11">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="showResult"
        rows="4"
        class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        placeholder="พิมพ์คำตอบของคุณที่นี่..."
      ></textarea>
    </div>

    <div v-if="showResult && result" class="mt-4 ml-11 p-4 rounded-lg" :class="result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
      <div class="flex items-center">
        <span v-if="result.isCorrect" class="text-green-600 font-semibold">✓ ถูกต้อง</span>
        <span v-else class="text-red-600 font-semibold">✗ ไม่ถูกต้อง</span>
        <span class="ml-auto text-sm">{{ result.points }}/{{ question.points }} คะแนน</span>
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
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-300 hover:border-blue-300';
  }

  const correctChoice = props.question.choices?.find(c => c.isCorrect);
  const isCorrect = correctChoice?.id === choiceId;
  const isSelected = props.modelValue === choiceId;

  if (isCorrect) {
    return 'border-green-500 bg-green-50';
  }
  if (isSelected && !isCorrect) {
    return 'border-red-500 bg-red-50';
  }
  return 'border-gray-300';
};
</script>
