import { apiClient } from './api';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export type { LoginCredentials, LoginResponse };

export const authService = {

  // POST /auth/login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    if (response.token) {
      apiClient.setToken(response.token);
    }

    return response;
  },

  logout: () => {
    apiClient.clearToken();
    // Clear any stored tokens (if using AsyncStorage)
  },
};
