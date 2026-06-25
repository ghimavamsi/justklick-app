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

  // Student Login using Query Parameters
  studentLogin: async (phone: string, otp: string): Promise<any> => {
    const response = await apiClient.post<any>('/api/student-login', null, {
      params: {
        phone,
        otp
      }
    });
    return response;
  },

  // Send OTP for Registration
  sendRegisterOtp: async (phone: string, email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/register/send-otp', { phone, email });
    return response.data;
  },

  // Student Register using Query Parameters
  studentRegister: async (
    firstName: string, 
    lastName: string, 
    email: string, 
    phone: string, 
    otp: string
  ): Promise<any> => {
    const response = await apiClient.post<any>('/api/student-register', null, {
      params: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        otp
      }
    });
    return response;
  },

  // Google Login (JSON Body with id_token)
  googleLogin: async (idToken: string): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>('/api/google-auth', {
      id_token: idToken
    });
    return response.data;
  },

  // Verify OTP for Registration
  verifyRegisterOtp: async (phone: string, otp: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/register/verify-otp', { phone, otp });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (phone: string, email?: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/resend-otp', { phone, email });
    return response.data;
  },

  // Send Email Login OTP
  sendEmailLoginOtp: async (email: string): Promise<any> => {
    const response = await apiClient.post<any>('/api/send-email-login-otp', null, { params: { email } });
    return response.data;
  },

  // Logout Student
  studentLogout: async (refreshToken: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/student-logout', { refresh_token: refreshToken });
    return response.data;
  },

  // Get Dashboard Data
  getDashboard: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dashboard');
    return response.data;
  },

  // Submit Lead
  submitLead: async (data: any): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/api/submit-lead', data);
    return response.data;
  }
};
