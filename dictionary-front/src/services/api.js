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

// Literary Words Service
export const literaryWordsService = {
    // Get literary words with pagination
    getLiteraryWords(params) {
        return apiClient.post('/api/LiteraryWord', {
            pageNumber: params.pageNumber || 0,
            pageSize: 20,
            title: params.title || null,
            partOfSpeechId: 0, // Default value, can be modified if needed
            status: 0, // Default value, can be modified if needed
            description: params.description || null
        }).then(response => {
            return {
                success: true,
                payload: response.data.payload
            };
        }).catch(error => {
            return {
                success: false,
                error: error.message || 'Failed to fetch literary words'
            };
        });
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

// API Service class that combines all services
export class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Translation methods
    translateWord(word, fromType, toType) {
        return translationService.translate(word, fromType, toType);
    }

    // Dialect methods
    getDialects() {
        return dialectService.getDialects();
    }

    // Literary Word methods - Using the POST endpoint for both search and pagination
    getLiteraryWords(params) {
        return literaryWordsService.getLiteraryWords(params);
    }
}

export default {
    WordType,
    translationService,
    dialectService,
    literaryWordsService,
    ApiService
};