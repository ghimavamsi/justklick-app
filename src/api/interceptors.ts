import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { useAuthStore } from '../store/auth-store';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      console.error(`[API RESPONSE ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url} => ${error.response?.status}`);
      console.error(`[API RESPONSE DATA]`, error.response?.data);
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return client(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          isRefreshing = false;
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        try {
          // Attempt to refresh token
          const response = await axios.post('https://api.justklick.co.in/api/token/refresh', {
            refresh_token: refreshToken
          }, {
            headers: { 'Content-Type': 'application/json' }
          });

          const data = response.data;
          
          if (data.success === false) {
             throw new Error(data.message || 'Refresh failed');
          }

          let newAccessToken = data.access || data.access_token || data?.data?.access;
          let newRefreshToken = data.refresh || data.refresh_token || data?.data?.refresh;

          if (newAccessToken) {
            useAuthStore.getState().updateTokens(newAccessToken, newRefreshToken);
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            
            // Retry the original request
            return client(originalRequest);
          } else {
            throw new Error('No access token returned from refresh');
          }
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // If already retried or not 401 but explicit unauthorized message
      if (error.response?.status === 401) {
        console.warn('Caught 401 Unauthorized.');
        
        const responseData = error.response?.data as any;
        const detail = responseData?.detail || responseData?.message;
        if (detail === 'Unauthorized' || detail === 'Authentication credentials were not provided.' || typeof detail === 'string' && detail.toLowerCase().includes('expire')) {
          console.warn('Session expired. Logging out user automatically.');
          useAuthStore.getState().logout();
        }
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
