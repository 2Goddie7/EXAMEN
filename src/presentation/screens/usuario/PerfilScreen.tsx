import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';

type Props = UsuarioTabScreenProps<'Perfil'>;

const PerfilScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: signOut, style: 'destructive' }
    ]);
  };

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900">Mi Perfil 👤</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white rounded-2xl p-6 mb-4">
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-primary-600 rounded-full items-center justify-center mb-3">
              <Text className="text-4xl text-white">{profile.nombreMostrar[0].toUpperCase()}</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{profile.nombreMostrar}</Text>
            <Text className="text-gray-600">{profile.email}</Text>
          </View>

          <View className="space-y-3">
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} className="bg-gray-50 p-4 rounded-xl flex-row justify-between items-center">
              <Text className="text-base font-semibold text-gray-900">✏️ Editar Perfil</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} className="bg-gray-50 p-4 rounded-xl flex-row justify-between items-center">
              <Text className="text-base font-semibold text-gray-900">🔑 Cambiar Contraseña</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Cerrar Sesión" onPress={handleLogout} variant="danger" fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerfilScreen;