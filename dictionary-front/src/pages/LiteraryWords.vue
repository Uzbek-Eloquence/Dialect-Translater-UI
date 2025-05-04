<template>
  <div class="page-container">
    <!-- Logo header -->
    <div class="header-container">
      <div class="logo-container">
        <span class="title-label">Lahja</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b5ef4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="audio-icon">
          <path d="M2 10v3"/>
          <path d="M6 6v11"/>
          <path d="M10 3v18"/>
          <path d="M14 8v7"/>
          <path d="M18 5v13"/>
          <path d="M22 10v3"/>
        </svg>
      </div>
      <div class="header-spacer"></div>
      <h1 class="page-title">O'zbek adabiy so'zlar</h1>
    </div>

    <div class="content-wrapper">
      <!-- Search input -->
      <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="So'z qidirish..."
            class="search-input"
            @input="debounceSearch"
        />
        <button class="search-button" @click="searchWords">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <!-- Words list - scrollable area -->
      <div class="scrollable-content">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>

        <div v-else-if="words.length === 0" class="empty-state">
          <p>Hech qanday so'z topilmadi.</p>
        </div>

        <div v-else class="words-list">
          <div
              v-for="word in words"
              :key="word.id"
              class="word-card"
          >
            <div class="word-header">
              <h3 class="word-title">{{ word.title }}</h3>
              <span v-if="word.partOfSpeechId" class="word-type">{{ getPartOfSpeech(word.partOfSpeechId) }}</span>
            </div>

            <div v-if="word.description" class="word-description-list">
              <div
                  v-for="(definition, index) in parseDescriptions(word.description)"
                  :key="index"
                  class="word-definition"
              >
                <span class="definition-number">{{ index + 1 }}.</span>
                <p class="definition-text">{{ definition }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination controls - fixed at bottom -->
    <div class="pagination-wrapper">
      <div class="pagination-container" v-if="totalPages > 0">
        <button
            class="pagination-button"
            :disabled="currentPage === 0"
            @click="changePage(currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div class="page-numbers">
          <button
              v-for="pageNum in displayedPageNumbers"
              :key="pageNum"
              :class="['page-number', { active: pageNum === currentPage + 1 }]"
              @click="changePage(pageNum - 1)"
          >
            {{ pageNum }}
          </button>
        </div>

        <button
            class="pagination-button"
            :disabled="currentPage === totalPages - 1"
            @click="changePage(currentPage + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { ApiService } from '../services/api';

export default {
  name: 'LiteraryWordsPage',

  setup() {
    const apiService = new ApiService();
    const words = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const totalCount = ref(0);
    const currentPage = ref(0);
    const pageSize = ref(21); // Default page size
    const searchQuery = ref('');
    const searchTimeout = ref(null);

    // Part of speech mapping
    const partsOfSpeech = {
      1: 'Ot',
      2: 'Sifat',
      3: 'Son',
      4: 'Olmosh',
      5: 'Fe\'l',
      6: 'Ravish',
      // Add more as needed
      99: 'Boshqa'
    };

    const getPartOfSpeech = (id) => {
      return partsOfSpeech[id] || 'Boshqa';
    };

    // Parse pipe-delimited descriptions
    const parseDescriptions = (description) => {
      if (!description) return [];

      // Split by pipe character
      return description.split('|')
          .map(item => {
            // Remove the number prefix (like "1. ") if it exists
            return item.replace(/^\d+\.\s*/, '').trim();
          })
          .filter(item => item.length > 0);
    };

    // Computed properties for pagination
    const totalPages = computed(() => {
      return Math.ceil(totalCount.value / pageSize.value);
    });

    const displayedPageNumbers = computed(() => {
      const numbers = [];
      let startPage = Math.max(currentPage.value - 2, 0);
      let endPage = Math.min(startPage + 4, totalPages.value - 1);

      // Adjust startPage if we're near the end
      if (endPage - startPage < 4) {
        startPage = Math.max(endPage - 4, 0);
      }

      for (let i = startPage; i <= endPage; i++) {
        numbers.push(i + 1);
      }

      return numbers;
    });

    // Function to fetch words
    const fetchWords = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await apiService.getLiteraryWords({
          pageNumber: currentPage.value,
          pageSize: pageSize.value,
          title: searchQuery.value || null,
          description: null
        });

        if (response.success) {
          words.value = response.payload.data;
          totalCount.value = response.payload.totalCount;
          // Update current page in case server adjusted it
          currentPage.value = response.payload.pageNumber;

          // Scroll to top
          const scrollArea = document.querySelector('.scrollable-content');
          if (scrollArea) {
            scrollArea.scrollTop = 0;
          }
        } else {
          error.value = response.error || 'Xatolik yuz berdi';
        }
      } catch (err) {
        error.value = err.message || 'So\'zlarni yuklashda xatolik yuz berdi';
      } finally {
        loading.value = false;
      }
    };

    // Page change handler
    const changePage = (newPage) => {
      if (newPage >= 0 && newPage < totalPages.value) {
        currentPage.value = newPage;
        fetchWords();
      }
    };

    // Search handler
    const searchWords = () => {
      currentPage.value = 0; // Reset to first page when searching
      fetchWords();
    };

    // Debounce search input
    const debounceSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }

      searchTimeout.value = setTimeout(() => {
        searchWords();
      }, 500);
    };

    // Load words on component mount
    onMounted(() => {
      fetchWords();
    });

    return {
      words,
      loading,
      error,
      currentPage,
      pageSize,
      totalPages,
      searchQuery,
      displayedPageNumbers,
      changePage,
      searchWords,
      debounceSearch,
      getPartOfSpeech,
      parseDescriptions
    };
  }
};
</script>

<style>
/* Fix for scrolling: Global styles to ensure proper layout */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  background-color: #fff;
}

/* Header with logo */
.header-container {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  z-index: 10;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 0;
}

.header-spacer {
  flex: 1;
}

.title-label {
  font-size: 1.3rem;
  font-weight: 600;
  color: #5b5ef4;
  margin-right: 0.5rem;
}

.audio-icon {
  margin-top: 3px;
}

.page-title {
  color: #5b5bf8;
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
  padding-right: 3rem; /* To balance the layout */
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-bottom: 70px; /* Space for pagination */
  height: calc(100vh - 70px); /* Adjust for header height */
  overflow: hidden;
}

.search-container {
  display: flex;
  margin-bottom: 1.5rem;
  position: relative;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #5b5bf8;
  box-shadow: 0 2px 8px rgba(91, 91, 248, 0.15);
  outline: none;
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #5b5bf8;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background: #4a4ae8;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(91, 91, 248, 0.2);
  border-radius: 50%;
  border-top-color: #5b5bf8;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.words-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.word-card {
  background-color: #f8f9fb;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.word-card:hover {
  box-shadow: 0 4px 12px rgba(91, 91, 248, 0.15);
  transform: translateY(-2px);
}

.word-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.75rem;
}

.word-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
}

.word-type {
  font-size: 0.8rem;
  background-color: #5b5bf8;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.word-description-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.word-definition {
  display: flex;
  align-items: flex-start;
}

.definition-number {
  font-weight: 600;
  color: #5b5bf8;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.definition-text {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

/* Fixed pagination at bottom */
.pagination-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  max-width: 1000px;
  margin: 0 auto;
}

.pagination-button {
  background-color: #f8f9fb;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5b5bf8;
  transition: all 0.2s ease;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #eef0f7;
}

.page-numbers {
  display: flex;
  margin: 0 0.5rem;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background-color: #f8f9fb;
  color: #333;
  margin: 0 0.25rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background-color: #eef0f7;
}

.page-number.active {
  background-color: #5b5bf8;
  color: white;
  border-color: #5b5bf8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    padding: 1rem;
    text-align: center;
  }

  .logo-container {
    margin-right: 0;
    margin-bottom: 0.75rem;
    justify-content: center;
  }

  .words-list {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    padding: 1rem;
    padding-bottom: 70px;
    height: calc(100vh - 120px); /* Adjust for taller header on mobile */
  }
}
</style>