import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconName, icons } from '@/constants/icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: IconName; // Icon name from constants/icons.ts (required)
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
    let classes = 'flex-row items-center bg-primary-background border rounded-lg px-4 py-3 ';

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

  const getIconColor = () => {
    return isFocused ? '#3B82F6' : '#64748B'; // primary : text-muted
  };

  return (
    <View className={`w-full ${className || ''}`}>
      {label && (
        <Text className="text-text text-sm font-medium mb-2">{label}</Text>
      )}

      <View className={getContainerClasses()}>
        <Ionicons
          name={icons[icon] as any}
          size={20}
          color={getIconColor()}
          style={{ flexShrink: 0 }}
        />

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
          style={{
            marginLeft: 12,
            marginRight: secureTextEntry && icon === 'lock' ? 12 : 0,
            minWidth: 0
          }}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {secureTextEntry && icon === 'lock' && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ flexShrink: 0 }}
          >
            <Ionicons
              name={showPassword ? icons.eyeOpen as any : icons.eyeClosed as any}
              size={20}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-status-error text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};