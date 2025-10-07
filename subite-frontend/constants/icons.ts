import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export const icons = {
  // Authentication & User
  user: 'person',
  email: 'mail',
  lock: 'lock-closed',
  lockOpen: 'lock-open',

  // Navigation
  home: 'home',
  search: 'search',
  settings: 'settings',
  back: 'arrow-back',

  // Actions
  edit: 'pencil',
  delete: 'trash',
  add: 'add',
  close: 'close',

  // Content
  image: 'image',
  camera: 'camera',
  gallery: 'images',

  // Status
  check: 'checkmark',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',

  // Password visibility
  eyeOpen: 'eye',
  eyeClosed: 'eye-off',
} as const;

export type IconName = keyof typeof icons;
export type IoniconsName = ComponentProps<typeof Ionicons>['name'];
