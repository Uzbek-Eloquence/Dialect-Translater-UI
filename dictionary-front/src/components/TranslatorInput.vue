// TranslatorInput.vue
<template>
  <div class="translator-input">
    <input 
      placeholder="So'z kiriting..."
      v-model="inputText"
      class="text-input"
    />
    
    <div class="icon-wrapper1" onclick="handleSearchClick()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search">
        <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
    </div>
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