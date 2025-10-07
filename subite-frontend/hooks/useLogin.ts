import { redirectLogin } from '@/constants/redirectLogin';
import { authService, LoginCredentials, LoginResponse } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data.user);
      // Store token in AsyncStorage if needed
      // Update global state if needed

      // Redirect based on user role
      redirectLogin(data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
}
