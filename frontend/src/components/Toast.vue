<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all"
          :class="getToastClass(toast.type)"
        >
          <!-- Accent Bar -->
          <div class="absolute left-0 top-0 h-full w-1" :class="getAccentClass(toast.type)"></div>
          
          <!-- Icon Container -->
          <div class="flex-shrink-0 relative">
            <!-- Loading -->
            <div v-if="toast.type === 'loading'" class="relative w-10 h-10 flex items-center justify-center">
              <div class="absolute inset-0">
                <svg class="w-full h-full animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" :class="getIconColorClass(toast.type)"></circle>
                  <path class="opacity-75" fill="currentColor" :class="getIconColorClass(toast.type)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <Upload :size="18" :class="getIconColorClass(toast.type)" class="relative z-10" />
            </div>
            
            <!-- Success -->
            <div v-else-if="toast.type === 'success'" class="w-10 h-10 rounded-full flex items-center justify-center animate-scale-in" :class="getIconBgClass(toast.type)">
              <CheckCircle :size="20" :class="getIconColorClass(toast.type)" />
            </div>
            
            <!-- Error -->
            <div v-else-if="toast.type === 'error'" class="w-10 h-10 rounded-full flex items-center justify-center animate-shake" :class="getIconBgClass(toast.type)">
              <AlertCircle :size="20" :class="getIconColorClass(toast.type)" />
            </div>
            
            <!-- Info -->
            <div v-else-if="toast.type === 'info'" class="w-10 h-10 rounded-full flex items-center justify-center" :class="getIconBgClass(toast.type)">
              <Info :size="20" :class="getIconColorClass(toast.type)" />
            </div>
            
            <!-- Warning -->
            <div v-else-if="toast.type === 'warning'" class="w-10 h-10 rounded-full flex items-center justify-center animate-pulse" :class="getIconBgClass(toast.type)">
              <AlertTriangle :size="20" :class="getIconColorClass(toast.type)" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold" :class="getTitleClass(toast.type)">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="mt-1 text-sm opacity-90" :class="getMessageClass(toast.type)">
              {{ toast.message }}
            </p>
            
            <!-- Progress Bar -->
            <div v-if="toast.type === 'loading' && toast.progress !== undefined" class="mt-2">
              <div class="h-1 w-full overflow-hidden rounded-full bg-black/10">
                <div 
                  class="h-full transition-all duration-300 ease-out"
                  :class="getProgressClass(toast.type)"
                  :style="{ width: `${toast.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Close Button -->
          <button
            v-if="toast.type !== 'loading'"
            @click="removeToast(toast.id)"
            class="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            :class="getCloseButtonClass(toast.type)"
          >
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Upload } from 'lucide-vue-next'

const toasts = ref([])

const getToastClass = (type) => {
  const classes = {
    success: 'bg-white border-green-200/50',
    error: 'bg-white border-red-200/50',
    info: 'bg-white border-blue-200/50',
    warning: 'bg-white border-yellow-200/50',
    loading: 'bg-white border-blue-200/50'
  }
  return classes[type] || classes.info
}

const getAccentClass = (type) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    loading: 'bg-blue-500'
  }
  return classes[type] || classes.info
}

const getIconBgClass = (type) => {
  const classes = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    loading: 'bg-blue-100'
  }
  return classes[type] || classes.info
}

const getIconColorClass = (type) => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    loading: 'text-blue-600'
  }
  return classes[type] || classes.info
}

const getTitleClass = (type) => {
  const classes = {
    success: 'text-green-900',
    error: 'text-red-900',
    info: 'text-blue-900',
    warning: 'text-yellow-900',
    loading: 'text-blue-900'
  }
  return classes[type] || classes.info
}

const getMessageClass = (type) => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    loading: 'text-blue-700'
  }
  return classes[type] || classes.info
}

const getProgressClass = (type) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    loading: 'bg-blue-500'
  }
  return classes[type] || classes.info
}

const getCloseButtonClass = (type) => {
  const classes = {
    success: 'text-green-500 hover:bg-green-100 focus:ring-green-400',
    error: 'text-red-500 hover:bg-red-100 focus:ring-red-400',
    info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-400',
    warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-400'
  }
  return classes[type] || classes.info
}

const addToast = (toast) => {
  const id = Date.now()
  toasts.value.push({ id, ...toast })
  
  // Auto remove after duration (except loading)
  if (toast.type !== 'loading') {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const updateToast = (id, updates) => {
  const toast = toasts.value.find(t => t.id === id)
  if (toast) {
    Object.assign(toast, updates)
    
    // If changed from loading to another type, auto remove after duration
    if (updates.type && updates.type !== 'loading') {
      setTimeout(() => {
        removeToast(id)
      }, updates.duration || 3000)
    }
  }
}

defineExpose({ addToast, removeToast, updateToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Smooth animations */
@keyframes slideInRight {
  from {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
}

.animate-slide-in {
  animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
