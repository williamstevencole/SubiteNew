import React from 'react';
import { View } from 'react-native';

interface SectionSeparatorProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDivider?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: 'my-4',
  md: 'my-6',
  lg: 'my-8',
  xl: 'my-12',
};

export const SectionSeparator: React.FC<SectionSeparatorProps> = ({
  size = 'md',
  showDivider = false,
  children,
  className,
}) => {
  return (
    <View className={`${sizeMap[size]} ${className || ''}`}>
      {showDivider && !children && (
        <View className="w-full h-px bg-border" />
      )}
      {children}
    </View>
  );
};
