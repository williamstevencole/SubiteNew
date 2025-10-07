import { useMutation } from '@tanstack/react-query';
import { authService, LoginCredentials, LoginResponse } from '@/services/auth';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data.user);
      // You can add additional logic here like:
      // - Store token in AsyncStorage
      // - Navigate to another screen
      // - Update global state
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
}
