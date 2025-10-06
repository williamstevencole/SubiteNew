import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-lg font-bold text-text">This screen doesn't exist.</Text>

        <Link href="/" className="mt-4">
          <Text className="text-sm text-primary">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
