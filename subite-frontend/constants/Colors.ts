const tintColorLight = '#3B82F6';
const tintColorDark = '#F8FAFC';

export const AppColors = {
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  secondary: '#8B5CF6',
  secondaryDark: '#6D28D9',
  primaryBackground: '#F8FAFC',
  primaryBackgroundDark: '#0F172A',
  secondaryBackground: '#F1F5F9',
  secondaryBackgroundDark: '#1E293B',
  text: '#0F172A',
  textDark: '#F8FAFC',
  mutedText: '#64748B',
  mutedTextDark: '#94A3B8',
  error: '#EF4444',
  errorDark: '#DC2626',
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  warningDark: '#D97706',
  border: '#E2E8F0',
  borderDark: '#475569',
};

export default {
  light: {
    text: AppColors.text,
    background: AppColors.primaryBackground,
    tint: tintColorLight,
    tabIconDefault: AppColors.mutedText,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppColors.textDark,
    background: AppColors.primaryBackgroundDark,
    tint: tintColorDark,
    tabIconDefault: AppColors.mutedTextDark,
    tabIconSelected: tintColorDark,
  },
};
