import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Placeholder URL since there is no backend API yet
export const API_BASE_URL = 'https://mockapi.example.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
