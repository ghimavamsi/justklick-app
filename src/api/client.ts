import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Live backend URL
export const API_BASE_URL = 'https://api.justklick.co.in';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
