<template>
  <div class="enhanced-video-player">
    <!-- YouTube Player -->
    <div v-if="isYouTube" class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <iframe
        :src="youtubeEmbedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        class="w-full h-full"
        :title="title || 'Video Player'"
      ></iframe>
    </div>

    <!-- Direct Video Player (MP4, WebM, etc.) -->
    <div v-else-if="videoUrl" class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref="videoPlayer"
        :src="videoUrl"
        controls
        controlsList="nodownload"
        :poster="poster"
        class="w-full h-full"
        @loadedmetadata="onVideoLoaded"
        @timeupdate="onTimeUpdate"
        @ended="onVideoEnded"
      >
        <source :src="videoUrl" :type="videoType">
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Vimeo Player -->
    <div v-else-if="isVimeo" class="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <iframe
        :src="vimeoEmbedUrl"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        class="w-full h-full"
        :title="title || 'Video Player'"
      ></iframe>
    </div>

    <!-- No Video -->
    <div v-else class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">ยังไม่มีวิดีโอสำหรับบทเรียนนี้</p>
      </div>
    </div>

    <!-- Video Info -->
    <div v-if="showInfo && videoUrl" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-4">
          <div v-if="duration">
            <span class="text-gray-600 dark:text-gray-400">ระยะเวลา:</span>
            <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatTime(duration) }}</span>
          </div>
          <div v-if="currentTime > 0">
            <span class="text-gray-600 dark:text-gray-400">กำลังดู:</span>
            <span class="ml-1 font-medium text-gray-900 dark:text-white">{{ formatTime(currentTime) }}</span>
          </div>
        </div>
        <div v-if="isYouTube" class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </span>
        </div>
        <div v-else-if="isVimeo" class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
            Vimeo
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  videoUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  poster: {
    type: String,
    default: ''
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['video-loaded', 'time-update', 'video-ended']);

const videoPlayer = ref(null);
const duration = ref(0);
const currentTime = ref(0);

// Extract YouTube Video ID
const youtubeVideoId = computed(() => {
  if (!props.videoUrl) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = props.videoUrl.match(pattern);
    if (match) return match[1];
  }
  
  return null;
});

// Extract Vimeo Video ID
const vimeoVideoId = computed(() => {
  if (!props.videoUrl) return null;
  
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = props.videoUrl.match(pattern);
    if (match) return match[1];
  }
  
  return null;
});

// Check if YouTube
const isYouTube = computed(() => !!youtubeVideoId.value);

// Check if Vimeo
const isVimeo = computed(() => !!vimeoVideoId.value);

// YouTube Embed URL with autoplay support
const youtubeEmbedUrl = computed(() => {
  if (!youtubeVideoId.value) return '';
  const autoplayParam = props.autoplay ? '&autoplay=1' : '';
  return `https://www.youtube.com/embed/${youtubeVideoId.value}?rel=0${autoplayParam}`;
});

// Vimeo Embed URL
const vimeoEmbedUrl = computed(() => {
  if (!vimeoVideoId.value) return '';
  const autoplayParam = props.autoplay ? '&autoplay=1' : '';
  return `https://player.vimeo.com/video/${vimeoVideoId.value}?title=0&byline=0&portrait=0${autoplayParam}`;
});

// Detect video type
const videoType = computed(() => {
  if (!props.videoUrl) return '';
  const url = props.videoUrl.toLowerCase();
  
  if (url.endsWith('.mp4')) return 'video/mp4';
  if (url.endsWith('.webm')) return 'video/webm';
  if (url.endsWith('.ogg')) return 'video/ogg';
  
  return 'video/mp4'; // default
});

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Video event handlers
function onVideoLoaded(event) {
  duration.value = event.target.duration;
  emit('video-loaded', {
    duration: event.target.duration,
    videoWidth: event.target.videoWidth,
    videoHeight: event.target.videoHeight
  });
}

function onTimeUpdate(event) {
  currentTime.value = event.target.currentTime;
  emit('time-update', {
    currentTime: event.target.currentTime,
    duration: event.target.duration,
    progress: (event.target.currentTime / event.target.duration) * 100
  });
}

function onVideoEnded() {
  emit('video-ended');
}

// Reset when video URL changes
watch(() => props.videoUrl, () => {
  currentTime.value = 0;
  duration.value = 0;
});

// Expose video player controls
defineExpose({
  play: () => videoPlayer.value?.play(),
  pause: () => videoPlayer.value?.pause(),
  seek: (time) => {
    if (videoPlayer.value) videoPlayer.value.currentTime = time;
  }
});
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
