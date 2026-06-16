import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Live backend URL
export const API_BASE_URL = 'https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
