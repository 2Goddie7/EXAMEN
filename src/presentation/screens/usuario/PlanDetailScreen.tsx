import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = UsuarioStackScreenProps<'PlanDetail'>;

const PlanDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById } = usePlanesStore();
  const { createContratacion } = useContratacionesStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  const handleContratar = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Inicia Sesión', 'Debes iniciar sesión para contratar un plan.');
      return;
    }

    setIsLoading(true);
    const result = await createContratacion(user.id, { planId });
    setIsLoading(false);

    if (result.success) {
      Alert.alert('¡Solicitud Enviada! ✅', 'Tu solicitud está pendiente de aprobación.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'No se pudo procesar la solicitud.');
    }
  };

  if (!selectedPlan) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="px-6 pt-4 pb-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        {selectedPlan.imagenUrl && (
          <Image source={{ uri: selectedPlan.imagenUrl }} className="w-full h-48" resizeMode="cover" />
        )}

        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">{selectedPlan.nombre}</Text>
          <Text className="text-4xl font-bold text-primary-600 mb-4">{selectedPlan.precioFormateado}/mes</Text>
          
          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <DetailRow icon="📊" label="Datos" value={selectedPlan.datosGb} />
            <DetailRow icon="📞" label="Minutos" value={selectedPlan.minutos} />
            <DetailRow icon="💬" label="SMS" value={selectedPlan.sms} />
            <DetailRow icon="📡" label="4G" value={selectedPlan.velocidad4g} />
            {selectedPlan.velocidad5g && <DetailRow icon="🚀" label="5G" value={selectedPlan.velocidad5g} />}
            <DetailRow icon="📱" label="Redes Sociales" value={selectedPlan.redesSociales} />
            <DetailRow icon="💚" label="WhatsApp" value={selectedPlan.whatsapp} />
            <DetailRow icon="🌍" label="Llamadas Int." value={selectedPlan.llamadasInternacionales} />
            <DetailRow icon="✈️" label="Roaming" value={selectedPlan.roaming} />
          </View>

          {isAuthenticated && (
            <Button
              title="Contratar Plan"
              onPress={handleContratar}
              loading={isLoading}
              disabled={isLoading}
              size="large"
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="flex-row items-center py-2 border-b border-gray-200">
    <Text className="text-2xl mr-3">{icon}</Text>
    <Text className="text-gray-600 flex-1">{label}</Text>
    <Text className="text-gray-900 font-semibold flex-2 text-right">{value}</Text>
  </View>
);

export default PlanDetailScreen;