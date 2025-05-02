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
      
      <div class="swap-btn">
        <button @click="swapLanguages">
          <span class="swap-icon">⟷</span>
        </button>
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

const swapLanguages = () => {
  [sourceLanguage.value, targetLanguage.value] = 
    [targetLanguage.value, sourceLanguage.value];
};
</script>