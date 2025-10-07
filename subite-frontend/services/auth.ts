import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    role: string;
  };
}

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
