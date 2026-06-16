import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/auth-store';

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = useAuthStore.getState().accessToken;
      
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized globally
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }

      // HOTFIX: Backend incorrectly throws a 500 Server Error on expired tokens
      const responseData = typeof error.response?.data === 'string' ? error.response.data : JSON.stringify(error.response?.data || '');
      if (error.response?.status === 500 && responseData.includes('ExpiredSignatureError')) {
        console.warn('Caught ExpiredSignatureError hidden in 500 response. Logging out...');
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }
  );
}
