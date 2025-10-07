import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, Input} from '@/components/userinteraction';
import { Spacer, SectionSeparator } from '@/components/separators';
import { useLogin } from '@/hooks/useLogin';

export default function TabOneScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          Alert.alert('Success', `Welcome back, ${data.user.email}!`);
          setEmail('');
          setPassword('');
        },
        onError: (error) => {
          Alert.alert('Login Failed', error.message);
        },
      }
    );
  };

  return (
    <ScrollView className="flex-1"
    contentContainerClassName="items-center justify-center py-8">
      <View className="bg-primary-background p-20 rounded-xl mb-8 w-full max-w-lg border border-border">
        <Text className="text-2xl font-bold text-text mb-5 text-center">Component Test</Text>

        {/* Primera sección */}
        <Input
          label="Email"
          icon="email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Spacer size="sm" />

        <Input
          label="Password"
          icon="lock"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Spacer size="md" />

        <Button
          title={loginMutation.isPending ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          variant="primary"
        />

        {/* Separador de sección */}
        <SectionSeparator size="lg" showDivider />

        {/* Segunda sección */}
        <Text className="text-xl font-bold text-text mb-4 text-center">Second Section</Text>

        <Input
          label="Email 2"
          icon="email"
          placeholder="Enter another email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Spacer size="sm" />

        <Input
          label="Password 2"
          icon="lock"
          placeholder="Enter another password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Spacer size="md" />

        <Button
          title="Sign Up"
          onPress={() => console.log('Sign up pressed')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}
