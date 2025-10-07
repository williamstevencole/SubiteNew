import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  xs: 'my-1',  // 4px
  sm: 'my-2',  // 8px
  md: 'my-3',  // 12px
  lg: 'my-4',  // 16px
  xl: 'my-6',  // 24px
};

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  children,
  className,
}) => {
  return (
    <View className={`${sizeMap[size]} ${className || ''}`}>
      {children}
    </View>
  );
};
