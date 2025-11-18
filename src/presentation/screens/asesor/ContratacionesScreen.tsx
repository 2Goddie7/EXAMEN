import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { ContratacionCard } from '../../components/ContratacionCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = AsesorTabScreenProps<'Contrataciones'>;

const ContratacionesScreen: React.FC<Props> = ({ navigation }) => {
  const { contratacionesPendientes, isLoading, fetchContratacionesPendientes, updateContratacion, subscribeToContrataciones, unsubscribeFromContrataciones } = useContratacionesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchContratacionesPendientes();
    subscribeToContrataciones();
    return () => unsubscribeFromContrataciones();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContratacionesPendientes();
    setRefreshing(false);
  };

  const handleApprove = async (id: string, planName: string) => {
    if (!user) return;
    Alert.alert('Aprobar', `¿Aprobar contratación de "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprobar',
        onPress: async () => {
          const result = await updateContratacion(id, user.id, { estado: 'aprobada' });
          if (result.success) {
            Alert.alert('Aprobada', 'Contratación aprobada correctamente.');
          }
        },
      },
    ]);
  };

  const handleReject = async (id: string, planName: string) => {
    if (!user) return;
    Alert.alert('Rechazar', `¿Rechazar contratación de "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rechazar',
        style: 'destructive',
        onPress: async () => {
          const result = await updateContratacion(id, user.id, { estado: 'rechazada' });
          if (result.success) {
            Alert.alert('Rechazada', 'Contratación rechazada.');
          }
        },
      },
    ]);
  };

  if (isLoading && contratacionesPendientes.length === 0) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900">Solicitudes 📋</Text>
        <Text className="text-base text-gray-600">{contratacionesPendientes.length} pendientes</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {contratacionesPendientes.length === 0 ? (
          <EmptyState icon="✅" title="Todo al día" message="No hay solicitudes pendientes." />
        ) : (
          contratacionesPendientes.map((contratacion) => (
            <ContratacionCard
              key={contratacion.id}
              contratacion={contratacion}
              onPress={() => navigation.navigate('ContratacionDetail', { contratacionId: contratacion.id })}
              showUser
              showActions
              onApprove={() => handleApprove(contratacion.id, contratacion.plan?.nombre || 'Plan')}
              onReject={() => handleReject(contratacion.id, contratacion.plan?.nombre || 'Plan')}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContratacionesScreen;