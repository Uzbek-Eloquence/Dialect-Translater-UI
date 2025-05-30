<template>
  <div class="app-container">
    <div v-if="$route.path === '/'" class="translator-container">
      <div class="translator-main">
        <div class="logo-container">
          <span class="title-label">Lahja</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5b5ef4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-icon">
            <path d="M2 10v3"/>
            <path d="M6 6v11"/>
            <path d="M10 3v18"/>
            <path d="M14 8v7"/>
            <path d="M18 5v13"/>
            <path d="M22 10v3"/>
          </svg>
        </div>
        <div class="translator-header">
          <h1>O'zbek shevalar tarjimoni</h1>
        </div>

        <LanguageSelector
            :sourceType="sourceType"
            :targetType="targetType"
            @update:sourceType="updateSourceType"
            @update:targetType="updateTargetType"
        />
        <TranslatorInput
            :source-type="sourceType"
            :target-type="targetType"
            @translate="handleTranslation"
            :isLoading="isLoading" />
        <div class="translator-content">
          <div class="translator-content-item">
            <div v-if="isLoading" class="loading-indicator">
              <div class="spinner"></div>
              <p>Tarjima qilinmoqda...</p>
            </div>
            <div v-else-if="translationResult" class="translation-result">
              <p class="translated-word">{{ translationResult.translatedWord }}</p>
              <p v-if="translationResult.partOfSpeech" class="part-of-speech">{{ translationResult.partOfSpeech }}</p>
              <p v-if="translationResult.partOfSpeech" class="part-of-speech">{{ translationResult.description }}</p>
            </div>
            <div v-else-if="error" class="translation-error">
              {{ error }}
            </div>
            <div v-else class="translation-placeholder">
              So'zlarni kiriting va tarjima qilish tugmasini bosing
            </div>
          </div>
          <!-- <NavigationBar /> -->
        </div>
      </div>

      <FeatureCards />
    </div>

    <!-- This router-view will show components based on current route -->
    <router-view v-if="$route.path !== '/'" />
  </div>
</template>

<script>
import { ref } from 'vue';
import LanguageSelector from './components/LanguageSelector.vue';
import TranslatorInput from './components/TranslatorInput.vue';
import FeatureCards from './components/FeatureCards.vue';
// import NavigationBar from './components/NavigationBar.vue';
import { WordType, translationService } from './services/api';

export default {
  name: 'App',
  components: {
    LanguageSelector,
    TranslatorInput,
    FeatureCards,
    // NavigationBar
  },
  setup() {
    // State variables
    const sourceType = ref(WordType.LITERARY); // Default: Adabiy Uzbek
    const targetType = ref(WordType.PARKENT);  // Default: Parkent
    const translationResult = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    // Update source type
    const updateSourceType = (type) => {
      sourceType.value = type;
      // Clear previous results when changing languages
      translationResult.value = null;
      error.value = null;
    };

    // Update target type
    const updateTargetType = (type) => {
      targetType.value = type;
      // Clear previous results when changing languages
      translationResult.value = null;
      error.value = null;
    };

    // Get dialect name for display
    const getDialectName = (type) => {
      switch (type) {
        case WordType.PARKENT:
          return 'Parkent';
        case WordType.PISKENT:
          return 'Piskent';
        case WordType.TOSHKENT:
          return 'Toshkent';
        case WordType.LITERARY:
          return 'Adabiy Uzbek';
        default:
          return 'Unknown';
      }
    };

    // Handle translation
    const handleTranslation = async (input) => {
      // If input is a string, trim and validate
      if (typeof input === 'string') {
        const text = input.trim();
        if (!text) return;

        isLoading.value = true;
        translationResult.value = null;
        error.value = null;

        try {
          if (
              (sourceType.value === WordType.LITERARY && targetType.value === WordType.LITERARY) ||
              (sourceType.value !== WordType.LITERARY && targetType.value !== WordType.LITERARY)
          ) {
            throw new Error('Translation must be between Literary Uzbek and a dialect');
          }

          console.log(`Translating from ${getDialectName(sourceType.value)} to ${getDialectName(targetType.value)}: "${text}"`);

          const response = await translationService.translate(
              text,
              sourceType.value,
              targetType.value
          );

          if (response.data && response.data.success && response.data.payload) {
            translationResult.value = response.data.payload;
          } else if (response.data && response.data.error) {
            error.value = response.data.error.message || 'Unknown error occurred';
          } else {
            error.value = 'Tarjima natijasi olinmadi';
          }
        } catch (err) {
          error.value = err.message || 'Tarjima qilishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.';
        } finally {
          isLoading.value = false;
        }
      }
      // If input is an object, just set the translation result directly
      else if (typeof input === 'object' && input !== null) {
        // You can add validation here if needed
        translationResult.value = {
          translatedWord: input.translatedWord || '',
          partOfSpeech: input.partOfSpeech || ''
        };
        isLoading.value = false;
        error.value = null;
      }
    };


    return {
      sourceType,
      targetType,
      translationResult,
      isLoading,
      error,
      updateSourceType,
      updateTargetType,
      getDialectName,
      handleTranslation
    };
  }
};
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.translator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Arial', sans-serif;
}

.translator-main {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Changed from center to flex-start */
  margin-bottom: 1rem;
  padding-left: 1rem; /* Added left padding */
}

.title-label {
  font-size: 1.8rem;
  font-weight: 600;
  color: #5b5ef4;
  /* margin-right: 0.5rem; */
}

.audio-icon {
  margin-top: 5px;
}

.translator-header h1 {
  color: #5b5bf8;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.8rem;
  position: relative;
}

.translator-header h1::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6rem;
  height: 3px;
  background-color: #5b5bf8;
  border-radius: 2px;
}

.translator-content {
  padding: 1rem 2rem;
}

.translator-content-item {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.translation-result {
  width: 100%;
  text-align: center;
}

.translated-word {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.part-of-speech {
  font-size: 0.9rem;
  color: #777;
  font-style: italic;
}

.translation-placeholder {
  color: #999;
  font-style: italic;
  text-align: center;
}

.translation-error {
  color: #e53935;
  text-align: center;
  padding: 1rem;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>