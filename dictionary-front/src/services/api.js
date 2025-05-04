// services/api.js
import axios from 'axios';

// Base URL for your API
const API_BASE_URL = 'http://localhost:5109';

// Create an axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

// WordType enum from API
export const WordType = {
    PARKENT: 0,
    PISKENT: 1,
    LITERARY: 2,
    TOSHKENT: 3
};

// Translation Service
export const translationService = {
    // Translate word between Literary and Dialect
    translate(word, fromType, toType) {
        // Validate that we're not trying to translate directly between dialects
        if (fromType !== WordType.LITERARY && toType !== WordType.LITERARY) {
            console.error('Direct translation between dialects is not supported');
            return Promise.reject(new Error('Direct translation between dialects is not supported. Please translate via Literary Uzbek.'));
        }

        return apiClient.post('/api/DialectalWord/translate', {
            word,
            from: fromType,
            to: toType
        });
    }
};

// Dialect Service
export const dialectService = {
    // Get all dialects
    getDialects() {
        return apiClient.get('/api/Dialect');
    }
};

// Error handler for API requests
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default {
    WordType,
    translationService,
    dialectService
};