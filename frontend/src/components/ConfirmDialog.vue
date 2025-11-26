<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Dialog -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
          <!-- Icon -->
          <div class="flex justify-center pt-6 pb-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="getIconBgClass()">
              <AlertTriangle v-if="type === 'warning'" :size="32" :class="getIconColorClass()" />
              <AlertCircle v-else-if="type === 'danger'" :size="32" :class="getIconColorClass()" />
              <Info v-else-if="type === 'info'" :size="32" :class="getIconColorClass()" />
              <HelpCircle v-else :size="32" :class="getIconColorClass()" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="px-6 pb-6 text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ message }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 px-6 pb-6">
            <button
              @click="handleCancel"
              class="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="getConfirmButtonClass()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { AlertTriangle, AlertCircle, Info, HelpCircle } from 'lucide-vue-next'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const type = ref('warning') // warning, danger, info, question
const confirmText = ref('ตกลง')
const cancelText = ref('ยกเลิก')
const resolvePromise = ref(null)

const getIconBgClass = () => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
    question: 'bg-gray-100'
  }
  return classes[type.value] || classes.warning
}

const getIconColorClass = () => {
  const classes = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    question: 'text-gray-600'
  }
  return classes[type.value] || classes.warning
}

const getConfirmButtonClass = () => {
  const classes = {
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-400',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400',
    question: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-500'
  }
  return classes[type.value] || classes.warning
}

const show = (options) => {
  title.value = options.title || 'ยืนยันการดำเนินการ'
  message.value = options.message || 'คุณแน่ใจหรือไม่?'
  type.value = options.type || 'warning'
  confirmText.value = options.confirmText || 'ตกลง'
  cancelText.value = options.cancelText || 'ยกเลิก'
  isOpen.value = true
  
  return new Promise((resolve) => {
    resolvePromise.value = resolve
  })
}

const handleConfirm = () => {
  isOpen.value = false
  if (resolvePromise.value) {
    resolvePromise.value(true)
  }
}

const handleCancel = () => {
  isOpen.value = false
  if (resolvePromise.value) {
    resolvePromise.value(false)
  }
}

defineExpose({ show })
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-leave-active .animate-scale-in {
  animation: scaleOut 0.15s ease-in;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
