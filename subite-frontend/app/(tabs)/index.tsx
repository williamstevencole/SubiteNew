import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Input } from '@/components';

export default function TabOneScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="bg-primary-background p-5 rounded-xl mb-8 w-full max-w-xs border border-border">
        <Text className="text-lg font-bold text-text mb-5 text-center">Component Test</Text>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="mb-4"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-4"
        />

        <Button
          title="Sign In"
          onPress={() => console.log('Sign in pressed')}
          variant="primary"
          className="mb-3"
        />

        <Button
          title="Sign Up"
          onPress={() => console.log('Sign up pressed')}
          variant="outline"
        />
      </View>

      <Text className="text-xl font-bold text-text">Tab One</Text>
      <View className="my-8 h-px w-4/5 bg-border" />
      <Text className="text-sm text-text-muted">Edit Screen Info</Text>
    </View>
  );
}
