import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/auth-store';

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = useAuthStore.getState().accessToken;
      
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      // console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    },
    (error: AxiosError) => {
      console.error('[API REQUEST ERROR]', error.message);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // console.log(`[API RESPONSE SUCCESS] ${response.config?.method?.toUpperCase()} ${response.config?.url} => ${response.status}`);
      return response;
    },
    (error: AxiosError) => {
      console.error(`[API RESPONSE ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} => ${error.response?.status}`);
      console.error(`[API RESPONSE DATA]`, error.response?.data);
      
      // Handle 401 Unauthorized globally
      if (error.response?.status === 401) {
        console.warn('Caught 401 Unauthorized.');
        // TEMPORARILY DISABLED: useAuthStore.getState().logout(); 
        // We are disabling auto-logout so the user doesn't get kicked out if a single buggy endpoint returns 401.
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
