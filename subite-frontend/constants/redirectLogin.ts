import { LoginResponse, UserRole } from '@/types';
import { router } from 'expo-router';

export const redirectLogin = (user: LoginResponse['user']) => {
  switch (user.role) {
    case UserRole.DRIVER:
      router.push('/init-form/driver');
      break;
    case UserRole.MANAGER:
      router.push('/init-form/manager');
      break;
    case UserRole.PASSENGER:
      router.push('/init-form/passenger');
      break;
    default:
      // Fallback to home if role is unknown
      router.push('/(tabs)');
  }
};
