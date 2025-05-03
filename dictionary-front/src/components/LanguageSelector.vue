// LanguageSelector.vue
<template>
  <div class="language-selector">
    <div class="selector-container">
      <button 
        :class="['language-btn', sourceLanguage === 'adabiy' ? 'active' : '']"
        @click="setSourceLanguage('adabiy')">
        <div class="globe-icon"></div>
        <span class="language-name">Adabiy Uzbek</span>
      </button>
      
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-horizontal-icon lucide-move-horizontal">
          <path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/></svg> <!-- Unicode left-right arrow -->
      </div>
      
      <button 
        :class="['language-btn', sourceLanguage === 'parkent' ? 'active' : '']"
        @click="setSourceLanguage('parkent')">
        <div class="globe-icon"></div>
        <span class="language-name">Parkent</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sourceLanguage = ref('adabiy');
const targetLanguage = ref('parkent');

const setSourceLanguage = (lang) => {
  sourceLanguage.value = lang;
  targetLanguage.value = lang === 'adabiy' ? 'parkent' : 'adabiy';
};

// const swapLanguages = () => {
//   [sourceLanguage.value, targetLanguage.value] = 
//     [targetLanguage.value, sourceLanguage.value];
// };
</script>