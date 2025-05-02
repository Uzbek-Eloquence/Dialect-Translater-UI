// TranslatorInput.vue
<template>
  <div class="translator-input">
    <textarea 
      placeholder="So'z kiriting..."
      v-model="inputText"
      class="text-input"
    ></textarea>
    
    <button class="search-btn" @click="translate">
      <span class="search-icon">🔍</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputText = ref('');
// const emit = defineEmits(['translate']);

// const translate = () => {
//   emit('translate', inputText.value);
// };
</script>