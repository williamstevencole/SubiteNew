import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className,
}) => {
  const isDisabled = disabled || loading;

  const getButtonClasses = () => {
    let classes = 'flex-row items-center justify-center rounded-lg ';

    // Size variants
    switch (size) {
      case 'small':
        classes += 'px-3 py-2 ';
        break;
      case 'medium':
        classes += 'px-4 py-3 ';
        break;
      case 'large':
        classes += 'px-6 py-4 ';
        break;
    }
    
    switch (variant) {
      case 'primary':
        classes += 'bg-primary ';
        break;
      case 'secondary':
        classes += 'bg-secondary ';
        break;
      case 'outline':
        classes += 'bg-transparent border-2 border-primary ';
        break;
      case 'ghost':
        classes += 'bg-transparent ';
        break;
    }

    // Disabled state
    if (isDisabled) {
      classes += 'opacity-50 ';
    }

    return classes + (className || '');
  };

  const getTextClasses = () => {
    let classes = 'font-semibold ';

    // Size-based text
    switch (size) {
      case 'small':
        classes += 'text-sm ';
        break;
      case 'medium':
        classes += 'text-base ';
        break;
      case 'large':
        classes += 'text-lg ';
        break;
    }

    // Color based on variant
    switch (variant) {
      case 'primary':
      case 'secondary':
        classes += 'text-white ';
        break;
      case 'outline':
      case 'ghost':
        classes += 'text-primary ';
        break;
    }

    return classes;
  };

  const getSpinnerColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return '#3B82F6'; // primary color
      default:
        return 'white';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={getButtonClasses()}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor()}
          className="mr-2"
        />
      )}
      <Text className={getTextClasses()}>{title}</Text>
    </TouchableOpacity>
  );
};
