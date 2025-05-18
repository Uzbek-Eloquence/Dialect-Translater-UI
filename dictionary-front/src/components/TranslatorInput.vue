<template>
  <div class="translator-input-container">
    <div class="translator-input">
      <input
          placeholder="So'z kiriting..."
          v-model="inputText"
          class="text-input"
          @keyup.enter="handleSearch"
          :disabled="isLoading || isRecording"
      />

      <button
          class="voice-button"
          @click="toggleRecording"
          :disabled="isLoading"
          :class="{ 'recording': isRecording }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      </button>

      <button
          class="search-button"
          @click="handleSearch"
          :disabled="isLoading || !inputText.trim()"
      >
        <div v-if="isLoading" class="search-spinner"></div>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search">
          <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onUnmounted } from 'vue';
import {ApiService, WordType} from '../services/api';

const apiService = new ApiService();
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  sourceType: {
    type: Number,
    default: WordType.LITERARY
  },
  targetType: {
    type: Number,
    default: WordType.PARKENT
  }
});

const inputText = ref('');
const emit = defineEmits(['translate', 'processing', 'voiceResult', 'error']);
const isRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);

// Audio context for WAV conversion
const audioContext = ref(null);

// Handle search button click
const handleSearch = () => {
  if (inputText.value.trim() && !props.isLoading) {
    emit('translate', inputText.value);
  }
};

// Function to convert webm to wav
const webmToWav = async (webmBlob) => {
  try {
    // Create an array buffer from the blob
    const arrayBuffer = await webmBlob.arrayBuffer();

    // Create audio context
    const context = new (window.AudioContext || window.webkitAudioContext)();

    // Decode the audio data
    const audioBuffer = await context.decodeAudioData(arrayBuffer);

    // Create WAV file
    const wavBuffer = createWAVFile(audioBuffer);

    // Create a new blob with WAV format
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error converting WebM to WAV:', error);
    // If conversion fails, return the original blob
    return webmBlob;
  }
};

// Function to create WAV file from audio buffer
const createWAVFile = (audioBuffer) => {
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChannels * 2; // 16-bit samples
  const sampleRate = audioBuffer.sampleRate;

  // Create buffer for WAV
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true); // File size
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, numOfChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numOfChannels * 2, true); // ByteRate
  view.setUint16(32, numOfChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true); // Subchunk2Size

  // Write audio data
  let offset = 44;

  // Get channel data and interleave
  const channelData = [];
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  // Write the samples
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      // Convert float audio data to 16-bit PCM
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const pcmValue = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, pcmValue, true);
      offset += 2;
    }
  }

  return buffer;
};

// Helper function to write strings to DataView
const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// Initialize media recorder
const initRecorder = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100 // Higher sample rate for better quality
      }
    });

    // Try with audio/webm mime type (most compatible for audio)
    let mimeType = 'audio/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = ''; // Use default
    }

    // Create the MediaRecorder
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: mimeType,
      audioBitsPerSecond: 128000 // Higher bit rate for better quality
    });

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      try {
        // Create a blob from the audio chunks
        const webmBlob = new Blob(audioChunks.value, { type: mediaRecorder.value.mimeType });

        // Debug log - check the original size and type
        console.log('Original audio blob:', webmBlob.size, 'bytes,', webmBlob.type);

        // Convert WebM to WAV for better compatibility with .NET backend
        const wavBlob = await webmToWav(webmBlob);

        // Debug log - check the converted size and type
        console.log('Converted WAV blob:', wavBlob.size, 'bytes,', wavBlob.type);

        // Send the WAV audio to the API
        await sendAudioToAPI(wavBlob,props);

        // Reset chunks for next recording
        audioChunks.value = [];
      } catch (error) {
        console.error('Error processing audio:', error);
        emit('error', 'Audio qayta ishlashda xatolik');
      }
    };

    return true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    emit('error', 'Mikrofonni ulash imkoni bo\'lmadi. Iltimos ruxsat bering.');
    return false;
  }
};

// Toggle recording state
const toggleRecording = async () => {
  try {
    if (isRecording.value) {
      // Stop recording
      if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value.stop();
      }
      isRecording.value = false;
    } else {
      // Initialize recorder if needed
      if (!mediaRecorder.value) {
        const initialized = await initRecorder();
        if (!initialized) return;
      }

      // Start recording - collect data
      audioChunks.value = [];
      mediaRecorder.value.start(100); // Collect chunks every 100ms
      isRecording.value = true;
    }
  } catch (error) {
    console.error('Error toggling recording:', error);
    emit('error', 'Ovoz yozib olishda xatolik');
    isRecording.value = false;
  }
};

// Send audio to API using the API service
const sendAudioToAPI = async (audioBlob,props) => {
  try {
    console.log(props);
    // Show processing message
    emit('processing', 'Audio uzatilmoqda...');

    // Debug: Check what we're sending
    console.log('Sending audio file:', audioBlob.type, audioBlob.size, 'bytes');

    // Send the blob directly - let the API service handle FormData creation
    const response = await apiService.translateFromAudio(audioBlob,props);

    // Handle the API response
    if (response.data && response.data.success && response.data.payload) {
      inputText.value = response.data.payload.translatedWord || '';

      if (inputText.value.trim()) {
        emit('translate', {
          translatedWord: inputText.value,
          partOfSpeech: response.data.payload.partOfSpeech || ''
        });

      } else {
        emit('error', 'Ovoz aniqlanmadi. Iltimos, qayta urinib ko\'ring');
      }
    } else {
      console.error('API error:', response.data?.error || 'Unknown error');
      emit('error', response.data?.error?.message || 'Tarjima qilishda xatolik');
    }
  } catch (error) {
    console.error('Error sending audio to API:', error);
    emit('error', 'Xatolik yuz berdi');
  }
};

// Clean up resources when component is unmounted
onUnmounted(() => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    try {
      mediaRecorder.value.stop();
    } catch (e) {
      console.error('Error stopping recorder:', e);
    }
  }

  if (mediaRecorder.value && mediaRecorder.value.stream) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }

  // Close audio context if it exists
  if (audioContext.value) {
    try {
      audioContext.value.close();
    } catch (e) {
      console.error('Error closing audio context:', e);
    }
  }
});
</script>

<style scoped>
.translator-input-container {
  width: 100%;
}

.translator-input {
  margin: 1.8rem 1.8rem 0.2rem 1.8rem;
  max-width: 1000px;
  display: flex;
  align-items: stretch;
  border-radius: 1.8rem;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background-color: white;
}

.text-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
}

.voice-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background-color: white;
  border: none;
  border-left: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #5b5ef4;
}

.voice-button:hover {
  background-color: #f5f5f5;
}

.voice-button.recording {
  background-color: #ff4a4a;
  color: white;
  animation: pulse 1.5s infinite;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  background-color: #5b5ef4;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0;
  margin: 0;
}

.search-button:hover {
  background-color: #3a80d2;
}

.search-button:disabled {
  background-color: #5b5ef4;
  cursor: not-allowed;
  border-radius: 1.8rem;
}

.search-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>