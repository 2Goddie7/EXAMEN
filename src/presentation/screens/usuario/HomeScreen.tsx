import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { useAuthStore } from '../../store/authStore';
import { PlanCard } from '../../components/PlanCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

type Props = UsuarioTabScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { planes, isLoading, searchQuery, fetchPlanes, searchPlanes, filterByPrice, clearFilters, subscribeToPlanes, unsubscribeFromPlanes } = usePlanesStore();
  const { profile } = useAuthStore();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlanes();
    const channel = subscribeToPlanes();
    
    return () => {
      unsubscribeFromPlanes();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlanes();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    searchPlanes(query);
  };

  const handleFilter = (min: number, max: number) => {
    filterByPrice(min, max);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  if (isLoading && planes.length === 0) {
    return <LoadingSpinner message="Cargando planes..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Planes Tigo 📱
          </Text>
          <Text className="text-base text-gray-600">
            {profile ? `Hola, ${profile.nombreMostrar}` : 'Explora nuestros planes'}
          </Text>
        </View>

        {/* Search y Filter */}
        <View className="px-6 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar planes..."
            showFilter
            onFilter={() => setShowFilterModal(true)}
          />
        </View>

        {/* Planes */}
        <View className="px-6 pb-6">
          {planes.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No hay planes"
              message="No se encontraron planes con los filtros aplicados."
              actionLabel="Limpiar Filtros"
              onAction={handleClearFilters}
            />
          ) : (
            planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPress={() => navigation.navigate('PlanDetail', { planId: plan.id })}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilter}
        onClear={handleClearFilters}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;