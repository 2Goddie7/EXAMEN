import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signIn(email.trim().toLowerCase(), password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert(
        'Error de Inicio de Sesión',
        result.error || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-8 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido 👋
          </Text>
          <Text className="text-base text-gray-600">
            Inicia sesión para continuar
          </Text>
        </View>

        {/* Form */}
        <View className="py-6">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={<Text className="text-xl">📧</Text>}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.password}
            icon={<Text className="text-xl">🔒</Text>}
            rightIcon={<Text className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            className="mb-6"
          >
            <Text className="text-primary-600 font-semibold text-right">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
        </View>

        {/* Footer */}
        <View className="py-8 items-center">
          <Text className="text-gray-600 text-base">
            ¿No tienes cuenta?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              className="text-primary-600 font-semibold"
            >
              Regístrate
            </Text>
          </Text>
        </View>

        {/* Demo Credentials */}
        <View className="mb-8 bg-blue-50 p-4 rounded-xl">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            🎯 Credenciales de prueba:
          </Text>
          <Text className="text-xs text-gray-600">
            Asesor: asesor@tigo.com.ec / Asesor123!
          </Text>
          <Text className="text-xs text-gray-600">
            Usuario: Regístrate para crear uno
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;