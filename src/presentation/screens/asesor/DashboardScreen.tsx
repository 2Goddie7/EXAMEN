import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { PlanCard } from '../../components/PlanCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

type Props = AsesorTabScreenProps<'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { planes, isLoading, searchQuery, fetchPlanes, searchPlanes, filterByPrice, clearFilters, deletePlan, subscribeToPlanes, unsubscribeFromPlanes } = usePlanesStore();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlanes();
    subscribeToPlanes();
    return () => unsubscribeFromPlanes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlanes();
    setRefreshing(false);
  };

  const handleDelete = (planId: string, planName: string) => {
    Alert.alert('Eliminar Plan', `¿Eliminar "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const result = await deletePlan(planId);
          if (result.success) {
            Alert.alert('Eliminado', 'Plan eliminado correctamente.');
          }
        },
      },
    ]);
  };

  if (isLoading && planes.length === 0) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Dashboard 📊</Text>
          <Text className="text-base text-gray-600">Gestiona tus planes</Text>
        </View>

        <View className="px-6 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={searchPlanes}
            placeholder="Buscar planes..."
            showFilter
            onFilter={() => setShowFilterModal(true)}
          />
        </View>

        <View className="px-6 pb-6">
          {planes.length === 0 ? (
            <EmptyState
              icon="📱"
              title="No hay planes"
              message="Crea tu primer plan móvil."
              actionLabel="Crear Plan"
              onAction={() => navigation.navigate('CreatePlan')}
            />
          ) : (
            planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPress={() => navigation.navigate('PlanDetail', { planId: plan.id })}
                showActions
                onEdit={() => navigation.navigate('EditPlan', { planId: plan.id })}
                onDelete={() => handleDelete(plan.id, plan.nombre)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePlan')}
        className="absolute bottom-6 right-6 bg-primary-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={filterByPrice}
        onClear={clearFilters}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;