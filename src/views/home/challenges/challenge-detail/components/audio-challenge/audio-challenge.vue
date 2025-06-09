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

    <!-- Complete Challenge Button -->
    <button
      v-if="audioUrl"
      @click="$emit('open-complete-challenge')"
      class="mt-4 px-4 py-2 rounded-lg bg-gradient text-white font-medium hover:opacity-90 transition-opacity"
    >
      Complete Challenge
    </button>
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
    const stream = await getAudioStream();
    setupMediaRecorder(stream);
    mediaRecorder?.start();
  } catch (error) {
    handleRecordingError(error);
  }
}

async function getAudioStream(): Promise<MediaStream> {
  return await navigator.mediaDevices.getUserMedia({ audio: true });
}

function setupMediaRecorder(stream: MediaStream): void {
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];
  isRecording.value = true;

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = () => handleRecordingStop(stream);
}

function handleDataAvailable(e: BlobEvent): void {
  if (e.data.size > 0) {
    audioChunks.push(e.data);
  }
}

function handleRecordingStop(stream: MediaStream): void {
  const audioBlob = createAudioBlob();
  audioUrl.value = URL.createObjectURL(audioBlob);
  cleanupStream(stream);
  logRecordingInfo(audioBlob);
  loadRecordingToWaveSurfer();
}

function createAudioBlob(): Blob {
  return new Blob(audioChunks, { type: 'audio/webm' });
}

function cleanupStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop());
}

function logRecordingInfo(audioBlob: Blob): void {
  console.debug('Recording stopped - audio chunks:', audioChunks.length);
  const recordingInfo = {
    size: calculateAudioSize(),
    duration: getRecordingDuration(),
    mimeType: audioBlob.type,
    sampleRate: getSampleRate(),
    url: audioUrl.value,
  };
  console.debug('Audio recording data:', recordingInfo);
}

function calculateAudioSize(): string {
  return `${audioChunks.reduce((total, chunk) => total + chunk.size, 0) / 1000} KB`;
}

function getRecordingDuration(): string {
  return formatTime(waveSurfer.value?.getDuration() || 0);
}

function getSampleRate(): string {
  return mediaRecorder?.audioBitsPerSecond
    ? `${Math.round(mediaRecorder.audioBitsPerSecond / 16)} Hz`
    : 'unknown';
}

function loadRecordingToWaveSurfer(): void {
  const checkWaveSurfer = () => {
    if (waveSurfer.value) {
      waveSurfer.value.on('ready', () => {
        console.debug('WaveSurfer ready with duration:', waveSurfer.value?.getDuration());
      });
      waveSurfer.value.load(audioUrl.value!);
    } else {
      console.debug('Waiting for WaveSurfer instance...');
      setTimeout(checkWaveSurfer, 100);
    }
  };
  checkWaveSurfer();
}

function handleRecordingError(error: unknown): void {
  console.error('Error accessing microphone:', error);
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
@import './audio-challenge.css';
</style>
