import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { ContratacionCard } from '../../components/ContratacionCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = UsuarioTabScreenProps<'MisContrataciones'>;

const MisContratacionesScreen: React.FC<Props> = ({ navigation }) => {
  const { contrataciones, isLoading, fetchUserContrataciones, subscribeToUserContrataciones, unsubscribeFromContrataciones } = useContratacionesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user) {
      fetchUserContrataciones(user.id);
      subscribeToUserContrataciones(user.id);
    }
    return () => unsubscribeFromContrataciones();
  }, [user]);

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchUserContrataciones(user.id);
    setRefreshing(false);
  };

  if (isLoading && contrataciones.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900">Mis Planes 📋</Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {contrataciones.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No hay contrataciones"
            message="Aún no has contratado ningún plan."
            actionLabel="Ver Planes"
            onAction={() => navigation.navigate('Home')}
          />
        ) : (
          contrataciones.map((contratacion) => (
            <ContratacionCard
              key={contratacion.id}
              contratacion={contratacion}
              onPress={() => !contratacion.estaPendiente && navigation.navigate('Chat', { contratacionId: contratacion.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MisContratacionesScreen;