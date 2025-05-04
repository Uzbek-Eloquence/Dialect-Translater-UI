<template>
  <div class="language-selector">
    <div class="language-container">
      <!-- Source language dropdown -->
      <div class="language-dropdown">
        <button
            class="dropdown-button"
            @click="toggleSourceDropdown"
            :class="{ 'active': isSourceDropdownOpen }"
        >
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </span>
          {{ getLanguageName(currentSourceType) }}
        </button>
        <div class="dropdown-menu" v-if="isSourceDropdownOpen">
          <div
              v-for="lang in allLanguages"
              :key="lang.value"
              @click="selectSourceLanguage(lang.value)"
              class="dropdown-item"
          >
            {{ lang.label }}
          </div>
        </div>
      </div>

      <!-- Swap button -->
      <button class="swap-button" @click="swapLanguages">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-7"></path>
          <path d="M5 19h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5"></path>
          <path d="M12 12H3"></path>
          <path d="m8 8-4 4 4 4"></path>
        </svg>
      </button>

      <!-- Target language dropdown -->
      <div class="language-dropdown">
        <button
            class="dropdown-button"
            @click="toggleTargetDropdown"
            :class="{ 'active': isTargetDropdownOpen }"
        >
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </span>
          {{ getLanguageName(currentTargetType) }}
        </button>
        <div class="dropdown-menu" v-if="isTargetDropdownOpen">
          <div
              v-for="lang in allLanguages"
              :key="lang.value"
              @click="selectTargetLanguage(lang.value)"
              class="dropdown-item"
          >
            {{ lang.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { WordType } from '../services/api';

export default {
  name: 'LanguageSelector',
  props: {
    sourceType: {
      type: Number,
      default: WordType.LITERARY
    },
    targetType: {
      type: Number,
      default: WordType.PARKENT
    }
  },
  emits: ['update:sourceType', 'update:targetType'],

  setup(props, { emit }) {
    // Current language selections
    const currentSourceType = ref(props.sourceType);
    const currentTargetType = ref(props.targetType);

    // Dropdown state
    const isSourceDropdownOpen = ref(false);
    const isTargetDropdownOpen = ref(false);

    // All language options
    const allLanguages = [
      { value: WordType.LITERARY, label: 'Adabiy Uzbek' },
      { value: WordType.PARKENT, label: 'Parkent' },
      { value: WordType.PISKENT, label: 'Piskent' },
      { value: WordType.TOSHKENT, label: 'Toshkent' }
    ];

    // Get language name
    const getLanguageName = (type) => {
      const lang = allLanguages.find(l => l.value === type);
      return lang ? lang.label : 'Unknown';
    };

    // Watch for prop changes
    watch(() => props.sourceType, (newVal) => {
      currentSourceType.value = newVal;
    });

    watch(() => props.targetType, (newVal) => {
      currentTargetType.value = newVal;
    });

    // Toggle dropdowns
    const toggleSourceDropdown = () => {
      isSourceDropdownOpen.value = !isSourceDropdownOpen.value;
      if (isSourceDropdownOpen.value) {
        isTargetDropdownOpen.value = false;
      }
    };

    const toggleTargetDropdown = () => {
      isTargetDropdownOpen.value = !isTargetDropdownOpen.value;
      if (isTargetDropdownOpen.value) {
        isSourceDropdownOpen.value = false;
      }
    };

    // Close dropdowns when clicking outside
    const closeDropdowns = (event) => {
      const isClickInside = event.target.closest('.language-dropdown');
      if (!isClickInside) {
        isSourceDropdownOpen.value = false;
        isTargetDropdownOpen.value = false;
      }
    };

    // Select source language
    const selectSourceLanguage = (value) => {
      currentSourceType.value = value;
      isSourceDropdownOpen.value = false;
      validateLanguagePair('source');
      updateParent();
    };

    // Select target language
    const selectTargetLanguage = (value) => {
      currentTargetType.value = value;
      isTargetDropdownOpen.value = false;
      validateLanguagePair('target');
      updateParent();
    };

    // Validate language pair to ensure one side is Literary
    const validateLanguagePair = (changedSide) => {
      const isSourceLiterary = currentSourceType.value === WordType.LITERARY;
      const isTargetLiterary = currentTargetType.value === WordType.LITERARY;

      // If neither is Literary, change the opposite side to Literary
      if (!isSourceLiterary && !isTargetLiterary) {
        if (changedSide === 'source') {
          currentTargetType.value = WordType.LITERARY;
        } else {
          currentSourceType.value = WordType.LITERARY;
        }
      }

      // If both are Literary, change the opposite side to a dialect
      if (isSourceLiterary && isTargetLiterary) {
        if (changedSide === 'source') {
          currentTargetType.value = WordType.PARKENT;
        } else {
          currentSourceType.value = WordType.PARKENT;
        }
      }
    };

    // Update parent component
    const updateParent = () => {
      emit('update:sourceType', currentSourceType.value);
      emit('update:targetType', currentTargetType.value);
    };

    // Swap languages
    const swapLanguages = () => {
      const temp = currentSourceType.value;
      currentSourceType.value = currentTargetType.value;
      currentTargetType.value = temp;
      updateParent();
    };

    // Add/remove event listeners
    onMounted(() => {
      document.addEventListener('click', closeDropdowns);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdowns);
    });

    return {
      currentSourceType,
      currentTargetType,
      isSourceDropdownOpen,
      isTargetDropdownOpen,
      allLanguages,
      getLanguageName,
      toggleSourceDropdown,
      toggleTargetDropdown,
      selectSourceLanguage,
      selectTargetLanguage,
      swapLanguages,
      WordType
    };
  }
};
</script>

<style scoped>
.language-selector {
  margin: 0.5rem 0;
  width: 100%;
}

.language-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 768px;
  margin: 0 auto;
  background-color: #f8f9fb;
  border-radius: 28px;
  padding: 0.25rem;
}

.language-dropdown {
  position: relative;
  flex: 1;
}

.dropdown-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  border-radius: 24px;
  color: #7176B8;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
}

.dropdown-button:hover {
  background-color: rgba(91, 91, 248, 0.1);
}

.dropdown-button.active {
  background-color: #ffffff;
  color: #7176B8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7176B8;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  z-index: 100;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-item {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #5b5bf8;
  border: none;
  border-radius: 50%;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 8px rgba(91, 91, 248, 0.3);
}

.swap-button:hover {
  background-color: #4a4aE8;
}

/* Responsive styles */
@media (max-width: 768px) {
  .language-container {
    flex-direction: column;
    gap: 0.5rem;
    border-radius: 12px;
    padding: 0.5rem;
  }

  .swap-button {
    transform: rotate(90deg);
    margin: 0.5rem 0;
  }
}
</style>