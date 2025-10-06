import { View, Text } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-xl font-bold text-text">Tab Two</Text>
      <View className="my-8 h-px w-4/5 bg-border" />
      <Text className="text-sm text-text-muted">Edit Screen Info</Text>
    </View>
  );
}
