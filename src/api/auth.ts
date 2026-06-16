import apiClient from './client';

export interface AuthTokenResponse {
  success: boolean;
  access: string;
  refresh: string;
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  // Send OTP for Login
  sendLoginOtp: async (phone: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/login/send-otp', { phone });
    return response.data;
  },

  // Verify OTP for Login (JSON Body)
  studentLogin: async (phone: string, otp: string): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>('/api/login/verify-otp', { phone, otp });
    return response.data;
  },

  // Send OTP for Registration (reusing login/send-otp)
  sendRegisterOtp: async (phone: string, email: string): Promise<MessageResponse> => {
    // Reusing the same endpoint since it takes only { phone }
    const response = await apiClient.post<MessageResponse>('/api/login/send-otp', { phone });
    return response.data;
  },

  // Student Register using Query Parameters
  studentRegister: async (
    firstName: string, 
    lastName: string, 
    email: string, 
    phone: string, 
    otp: string
  ): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>('/api/student-register', null, {
      params: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        otp
      }
    });
    return response.data;
  },

  // Google Login (JSON Body with id_token)
  googleLogin: async (idToken: string): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>('/api/google-auth', {
      id_token: idToken
    });
    return response.data;
  }
};
