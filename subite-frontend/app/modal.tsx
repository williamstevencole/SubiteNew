import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-text">Modal</Text>
      <View className="my-8 h-px w-4/5 bg-border"/>
      <Text className="text-sm text-text-muted">Edit Screen Info</Text>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
