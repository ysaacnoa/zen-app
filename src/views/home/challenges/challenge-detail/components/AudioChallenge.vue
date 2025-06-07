<template>
  <div class="audio-challenge flex flex-col items-center gap-4 p-4">
    <!-- Mic Button -->
    <div
      class="mic-circle w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all"
      :class="{ 'is-recording': isRecording }"
      @click="toggleRecording"
    >
      <MicIcon class="h-8 w-8" />
    </div>

    <!-- WaveSurfer Visualization -->
    <WaveSurferPlayer
      v-if="audioUrl"
      ref="waveformRef"
      class="w-full h-full"
      :options="waveSurferOptions"
      @timeupdate="timeUpdateHandler"
      @ready="readyHandler"
      @waveSurfer="readyWaveSurferHandler"
    />

    <!-- Controls -->
    <div v-if="audioUrl" class="flex gap-2">
      <button
        @click="waveSurfer?.playPause()"
        class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <PlayIcon v-if="!isPlaying" class="h-5 w-5" />
        <PauseIcon v-else class="h-5 w-5" />
      </button>
      <button
        @click="deleteRecording"
        class="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        <Trash2Icon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { MicIcon, PlayIcon, PauseIcon, Trash2Icon } from 'lucide-vue-next';
import type WaveSurfer from 'wavesurfer.js';
import { WaveSurferPlayer } from '@meersagor/wavesurfer-vue';

const waveformRef = ref<HTMLElement | null>(null);
const isRecording = ref(false);
const audioUrl = ref<string | null>(null);
const isPlaying = ref(false);
const currentTime = ref<string>('00:00');
const totalDuration = ref<string>('00:00');
const waveSurfer = ref<WaveSurfer | null>(null);
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

// WaveSurfer options
const waveSurferOptions = computed(() => ({
  height: 48,
  waveColor: '#66667D',
  progressColor: '#6A24FF',
  barGap: 2,
  barWidth: 2,
  barRadius: 4,
  cursorWidth: 0,
  url: audioUrl.value || undefined,
}));

const formatTime = (seconds: number): string =>
  [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const timeUpdateHandler = (time: number) => {
  currentTime.value = formatTime(time);
};

const readyHandler = (duration: number) => {
  totalDuration.value = formatTime(duration);
};

const readyWaveSurferHandler = (ws: WaveSurfer) => {
  console.debug('WaveSurfer instance created');
  waveSurfer.value = ws;
  ws.on('play', () => {
    isPlaying.value = true;
    console.debug('Playback started');
  });
  ws.on('pause', () => {
    isPlaying.value = false;
    console.debug('Playback paused');
  });
  ws.on('finish', () => {
    isPlaying.value = false;
    console.debug('Playback finished');
  });

  // Re-initialize if we have a recording URL
  if (audioUrl.value) {
    console.debug('Loading existing audio URL:', audioUrl.value);
    ws.load(audioUrl.value);
  }
};

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    isRecording.value = true;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      stream.getTracks().forEach((track) => track.stop());

      // Log audio data to console
      console.debug('Recording stopped - audio chunks:', audioChunks.length);

      const checkWaveSurfer = () => {
        if (waveSurfer.value) {
          waveSurfer.value.on('ready', () => {
            const duration = waveSurfer.value?.getDuration() || 0;
            console.debug('Audio recording data:', {
              size: audioChunks.reduce((total, chunk) => total + chunk.size, 0) / 1000 + ' KB',
              duration: formatTime(duration),
              mimeType: audioBlob.type,
              sampleRate: mediaRecorder?.audioBitsPerSecond
                ? Math.round(mediaRecorder.audioBitsPerSecond / 16) + ' Hz'
                : 'unknown',
              url: audioUrl.value,
            });
            console.debug('WaveSurfer ready with duration:', duration);
          });
          waveSurfer.value.load(audioUrl.value!);
        } else {
          console.debug('Waiting for WaveSurfer instance...');
          setTimeout(checkWaveSurfer, 100);
        }
      };

      checkWaveSurfer();
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    isRecording.value = false;
  }
}

function deleteRecording() {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
    audioUrl.value = null;
    if (waveSurfer.value) {
      waveSurfer.value.empty();
    }
  }
}

onBeforeUnmount(() => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
  }
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
  if (waveSurfer.value) {
    waveSurfer.value.destroy();
  }
});
</script>

<style scoped>
.mic-circle {
  background-color: #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mic-circle:hover {
  background-color: #e0e0e0;
}

.mic-circle.is-recording {
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--color-primary);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 77, 77, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
  }
}
</style>
