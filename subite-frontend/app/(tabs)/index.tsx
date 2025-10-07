import { Button, Input } from '@/components/userinteraction';
import { useLogin } from '@/hooks/useLogin';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          Alert.alert('Success', `Welcome back, ${data.user.email}!`);
          // Redirection is handled in the useLogin hook
        },
        onError: (error) => {
          Alert.alert('Login Failed', error.message);
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Bus Image Header with Gradient */}
      <View className="relative w-full h-[280px]">
        <Image
          source={require('@/assets/images/bus.png')}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6"
      >
        <Text className="text-text text-xl font-semibold pt-10 mb-1">
          Inicia sesión
        </Text>
        <Text className="text-muted-text text-sm mb-6 pb-6">
          Conectate y seguí tu ruta sin complicaciones
        </Text>

        <View className="gap-6">
          <Input
            label="E-mail"
            icon="email"
            placeholder="Ingrese su e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={showErrors && !email.trim() ? 'Este campo es obligatorio' : undefined}
          />

          <Input
            label="Contraseña"
            icon="lock"
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            error={showErrors && !password.trim() ? 'Este campo es obligatorio' : undefined}
          />

          <View className="mt-2 mb-6">
            <Button
              title={loginMutation.isPending ? "Iniciando sesión..." : "Inicia Sesión"}
              onPress={handleLogin}
              variant="primary"
            />
          </View>

          <TouchableOpacity>
            <Text className="text-muted-text text-sm text-center">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-14 items-center">
          <Text className="text-muted-text text-base">
            Subite
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
