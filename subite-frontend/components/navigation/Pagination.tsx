import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PaginationProps {
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
  isNextDisabled = false,
}) => {
  return (
    <View className="flex-row justify-center items-center px-6">
      <TouchableOpacity
        onPress={onPrev}
        disabled={currentIndex === 0}
        className={`w-12 h-12 rounded-full items-center justify-center ${
          currentIndex === 0 ? "opacity-50" : "opacity-100"
        } bg-primary`}
      >
        <Text className="text-white text-xl font-bold">{"<"}</Text>
      </TouchableOpacity>

      <View className="flex-row mx-6 items-center">
        {currentIndex > 0 && (
          <Text className="text-white/50 text-base font-medium mx-2">
            {currentIndex}
          </Text>
        )}
        <Text className="text-white text-xl font-bold mx-2">
          {currentIndex + 1}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={isNextDisabled || currentIndex > totalSlides - 1}
        className={`w-12 h-12 rounded-full items-center justify-center ${
          isNextDisabled || currentIndex > totalSlides - 1
            ? "opacity-50"
            : "opacity-100"
        } bg-primary`}
      >
        <Text className="text-white text-xl font-bold">{">"}</Text>
      </TouchableOpacity>
    </View>
  );
};
