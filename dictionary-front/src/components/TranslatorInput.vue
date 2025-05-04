<template>
  <div class="translator-input-container">
    <div class="translator-input">
      <input
          placeholder="So'z kiriting..."
          v-model="inputText"
          class="text-input"
          @keyup.enter="handleSearch"
          :disabled="isLoading"
      />

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
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});

const inputText = ref('');
const emit = defineEmits(['translate']);

// Handle search button click
const handleSearch = () => {
  if (inputText.value.trim() && !props.isLoading) {
    emit('translate', inputText.value);
  }
};
</script>

<style scoped>
.translator-input-container {
  width: 100%;
  padding: 0 1rem;
}

.translator-input {
  margin: 1.5rem auto;
  max-width: 1000px;
  display: flex;
  align-items: stretch;
  border-radius: 8px;
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

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  background-color: #4a90e2;
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
  background-color: #a0c3f0;
  cursor: not-allowed;
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
  to { transform: rotate(360deg); }
}
</style>