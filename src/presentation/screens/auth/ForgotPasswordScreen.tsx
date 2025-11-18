import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

type Props = AuthStackScreenProps<'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuthStore();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setError('');
    setIsLoading(true);
    const result = await resetPassword(email.trim().toLowerCase());
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Email Enviado ✅',
        'Revisa tu correo para restablecer tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Error', result.error || 'No se pudo enviar el email.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="pt-8 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            ¿Olvidaste tu contraseña? 🔑
          </Text>
          <Text className="text-base text-gray-600">
            Te enviaremos un email para restablecerla
          </Text>
        </View>

        <View className="py-6">
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            icon={<Text className="text-xl">📧</Text>}
          />

          <Button
            title="Enviar Email"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;