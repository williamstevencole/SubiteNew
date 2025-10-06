import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: any; // Icons8 icon source
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  error,
  className,
  inputClassName,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const getContainerClasses = () => {
    let classes = 'flex-row items-center bg-primary-background border rounded-lg px-3 py-3 ';

    if (error) {
      classes += 'border-status-error ';
    } else if (isFocused) {
      classes += 'border-primary ';
    } else {
      classes += 'border-border ';
    }

    if (!editable) {
      classes += 'opacity-50 ';
    }

    return classes;
  };

  const getIconTintColor = () => {
    return isFocused ? '#3B82F6' : '#64748B'; // primary : text-muted
  };

  return (
    <View className={`w-full ${className || ''}`}>
      {label && (
        <Text className="text-text text-sm font-medium mb-2">{label}</Text>
      )}

      <View className={getContainerClasses()}>
        {icon && (
          <Image
            source={icon}
            className="w-5 h-5 mr-3"
            style={{ tintColor: getIconTintColor() }}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#64748B" // text-muted
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 text-text text-base ${multiline ? 'min-h-20' : ''} ${inputClassName || ''}`}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            <Text className="text-text-muted text-xs">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-status-error text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};