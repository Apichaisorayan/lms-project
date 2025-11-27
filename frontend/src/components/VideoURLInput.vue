<template>
  <div class="video-url-input">
    <div class="space-y-3 sm:space-y-4">
      <!-- Unified Input Field -->
      <div>
        <label class="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1.5 sm:mb-2">
          ลิงก์วิดีโอ
        </label>
        <div class="relative group">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none z-10">
            <LinkIcon :size="20" />
          </div>
          <input
            type="url"
            v-model="inputValue"
            @input="handleInput"
            @paste="handlePaste"
            inputmode="url"
            placeholder="วางลิงก์ YouTube ที่นี่..."
            class="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none placeholder:text-gray-400 text-gray-700 text-base"
          />
          <!-- Clear Button -->
          <button 
            v-if="inputValue"
            @click="clearUrl"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all active:scale-95 z-10"
            aria-label="ล้างข้อมูล"
          >
            <X :size="18" />
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1.5">รองรับ: YouTube, ลิงก์วิดีโอโดยตรง (MP4, WebM)</p>
      </div>

      <!-- Preview Section -->
      <div v-if="videoId || directUrl" class="relative rounded-xl overflow-hidden bg-black shadow-lg border border-gray-200 group">
        <div class="aspect-video w-full">
          <!-- YouTube Preview -->
          <iframe
            v-if="videoId"
            :src="`https://www.youtube.com/embed/${videoId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full"
          ></iframe>
          
          <!-- Direct Video Preview -->
          <video 
            v-else-if="directUrl" 
            :src="directUrl" 
            controls 
            playsinline
            class="w-full h-full"
          ></video>
        </div>

        <!-- Status Badge -->
        <div class="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-2 border border-white/10 shadow-sm">
          <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" :class="videoId ? 'bg-red-500' : 'bg-green-500'"></div>
          {{ videoId ? 'YouTube' : 'Direct Video' }}
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="flex items-start sm:items-center gap-3 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 animate-fade-in">
        <AlertCircle :size="18" class="flex-shrink-0 mt-0.5 sm:mt-0" />
        <span class="leading-tight">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Link as LinkIcon, X, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');
const videoId = ref('');
const directUrl = ref('');
const error = ref('');

// Initialize
if (props.modelValue) {
  inputValue.value = props.modelValue;
  processUrl(props.modelValue);
}

// Extract YouTube Video ID
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function processUrl(url) {
  videoId.value = '';
  directUrl.value = '';
  error.value = '';

  if (!url) return;

  const ytId = extractYouTubeId(url);
  if (ytId) {
    videoId.value = ytId;
  } else {
    // Basic URL validation
    try {
      new URL(url);
      directUrl.value = url;
    } catch (e) {
      // If not a valid URL and not a YouTube ID, show error only if it looks like they tried to type a URL
      if (url.length > 5) {
        // error.value = 'รูปแบบลิงก์ไม่ถูกต้อง';
      }
    }
  }
}

function handleInput() {
  const url = inputValue.value.trim();
  processUrl(url);
  
  // If it's a YouTube ID/URL, standardize it for storage
  if (videoId.value) {
    emit('update:modelValue', `https://www.youtube.com/watch?v=${videoId.value}`);
  } else {
    emit('update:modelValue', url);
  }
}

function handlePaste(event) {
  // Let the default paste happen, then process
  setTimeout(() => {
    handleInput();
  }, 10);
}

function clearUrl() {
  inputValue.value = '';
  videoId.value = '';
  directUrl.value = '';
  error.value = '';
  emit('update:modelValue', '');
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue;
    processUrl(newValue);
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
