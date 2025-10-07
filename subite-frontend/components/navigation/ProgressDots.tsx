import React from 'react';
import { View } from 'react-native';

interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep }) => {
  return (
    <View className="flex-row justify-center items-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 rounded-full ${
            index === currentStep
              ? 'bg-primary w-8'
              : index < currentStep
              ? 'bg-primary opacity-50'
              : 'bg-muted-text opacity-30'
          }`}
        />
      ))}
    </View>
  );
};
