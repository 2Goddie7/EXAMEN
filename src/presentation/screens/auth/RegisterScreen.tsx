import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

type Props = AuthStackScreenProps<'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre es requerido';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signUp(email.trim().toLowerCase(), password, nombreCompleto.trim());
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        '¡Registro Exitoso! 🎉',
        'Tu cuenta ha sido creada correctamente.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error de Registro',
        result.error || 'No se pudo crear la cuenta. Intenta nuevamente.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pt-8 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta 🚀
          </Text>
          <Text className="text-base text-gray-600">
            Únete a Tigo Conecta hoy
          </Text>
        </View>

        <View className="py-6">
          <Input
            label="Nombre Completo"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
            placeholder="Juan Pérez"
            error={errors.nombreCompleto}
            icon={<Text className="text-xl">👤</Text>}
          />

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

          <Input
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            icon={<Text className="text-xl">🔒</Text>}
          />

          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
        </View>

        <View className="py-8 items-center">
          <Text className="text-gray-600 text-base">
            ¿Ya tienes cuenta?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              className="text-primary-600 font-semibold"
            >
              Inicia Sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;  