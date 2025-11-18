import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { usePlanesStore } from '../../store/planesStore';

type Props = AuthStackScreenProps<'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { fetchPlanes } = usePlanesStore();

  useEffect(() => {
    // Cargar planes para usuarios invitados
    fetchPlanes();
  }, []);

  return (
    <LinearGradient
      colors={['#0057e6', '#003180']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-1 justify-center items-center">
          {/* Logo y Título */}
          <View className="items-center mb-12">
            <Text className="text-7xl mb-4">📱</Text>
            <Text className="text-white text-4xl font-bold mb-2">
              Tigo Conecta
            </Text>
            <Text className="text-white/80 text-lg text-center">
              Tu conexión perfecta empieza aquí
            </Text>
          </View>

          {/* Características */}
          <View className="w-full mb-12">
            <View className="flex-row items-center mb-4">
              <Text className="text-3xl mr-3">✨</Text>
              <Text className="text-white text-base flex-1">
                Planes móviles a tu medida
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Text className="text-3xl mr-3">💬</Text>
              <Text className="text-white text-base flex-1">
                Chat en tiempo real con asesores
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">🚀</Text>
              <Text className="text-white text-base flex-1">
                Gestión rápida y segura
              </Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View className="pb-8">
          <Button
            title="Ver Planes"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            size="large"
            fullWidth
          />
          <View className="h-3" />
          <Button
            title="Iniciar Sesión"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="large"
            fullWidth
          />
          <View className="mt-4">
            <Text className="text-white/60 text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Text
                onPress={() => navigation.navigate('Register')}
                className="text-white font-semibold"
              >
                Regístrate aquí
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WelcomeScreen;