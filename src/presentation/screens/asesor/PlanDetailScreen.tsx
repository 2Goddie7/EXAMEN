// src/presentation/screens/asesor/PlanDetailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = AsesorStackScreenProps<'PlanDetail'>;

const PlanDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById, deletePlan } = usePlanesStore();

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  const handleDelete = () => {
    if (!selectedPlan) return;
    
    Alert.alert(
      'Eliminar Plan',
      `¿Estás seguro de eliminar "${selectedPlan.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePlan(planId);
            if (result.success) {
              Alert.alert('Eliminado', 'Plan eliminado correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
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
          <Image 
            source={{ uri: selectedPlan.imagenUrl }} 
            className="w-full h-48" 
            resizeMode="cover" 
          />
        )}

        <View className="px-6 py-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                {selectedPlan.nombre}
              </Text>
              <Text className="text-gray-600 text-base">
                {selectedPlan.segmento}
              </Text>
            </View>
            <Text className="text-4xl font-bold text-primary-600">
              {selectedPlan.precioFormateado}/mes
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-xl mb-6">
            <DetailRow icon="📊" label="Datos" value={selectedPlan.datosGb} />
            <DetailRow icon="📞" label="Minutos" value={selectedPlan.minutos} />
            <DetailRow icon="💬" label="SMS" value={selectedPlan.sms} />
            <DetailRow icon="📡" label="4G" value={selectedPlan.velocidad4g} />
            {selectedPlan.velocidad5g && (
              <DetailRow icon="🚀" label="5G" value={selectedPlan.velocidad5g} />
            )}
            <DetailRow icon="📱" label="Redes Sociales" value={selectedPlan.redesSociales} />
            <DetailRow icon="💚" label="WhatsApp" value={selectedPlan.whatsapp} />
            <DetailRow icon="🌎" label="Llamadas Int." value={selectedPlan.llamadasInternacionales} />
            <DetailRow icon="✈️" label="Roaming" value={selectedPlan.roaming} />
          </View>

          <View className="bg-blue-50 p-4 rounded-xl mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Público Objetivo:
            </Text>
            <Text className="text-gray-600">{selectedPlan.publicoObjetivo}</Text>
          </View>

          <View className="space-y-3">
            <Button
              title="✏️ Editar Plan"
              onPress={() => navigation.navigate('EditPlan', { planId })}
              variant="primary"
              fullWidth
            />
            <Button
              title="🗑️ Eliminar Plan"
              onPress={handleDelete}
              variant="danger"
              fullWidth
            />
          </View>
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