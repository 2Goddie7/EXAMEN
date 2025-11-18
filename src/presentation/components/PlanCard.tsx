import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlanMovil } from '@domain/entities';

interface PlanCardProps {
  plan: PlanMovil;
  onPress: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onPress,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const getGradientColors = (): [string, string] => {
    if (plan.esBasico) {
      return ['#4caf50', '#2e7d32'];
    } else if (plan.esPremium) {
      return ['#ff6f00', '#e65100'];
    }
    return ['#2196f3', '#1565c0'];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mb-4 rounded-2xl overflow-hidden shadow-lg"
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-white text-xl font-bold mb-1">
              {plan.nombre}
            </Text>
            <Text className="text-white/80 text-sm">
              {plan.segmento}
            </Text>
          </View>
          
          <View className="bg-white/20 px-3 py-2 rounded-xl">
            <Text className="text-white text-2xl font-bold">
              {plan.precioFormateado}
            </Text>
            <Text className="text-white/80 text-xs text-center">
              /mes
            </Text>
          </View>
        </View>

        {plan.imagenUrl && (
          <Image
            source={{ uri: plan.imagenUrl }}
            className="w-full h-32 rounded-xl mb-3"
            resizeMode="cover"
          />
        )}

        <View className="space-y-2">
          <View className="flex-row items-center">
            <Text className="text-white text-2xl mr-2">📊</Text>
            <Text className="text-white font-medium flex-1">
              {plan.datosGb}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-white text-2xl mr-2">📞</Text>
            <Text className="text-white font-medium flex-1">
              {plan.minutos}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-white text-2xl mr-2">💬</Text>
            <Text className="text-white font-medium flex-1">
              SMS: {plan.sms}
            </Text>
          </View>
        </View>

        {showActions && (
          <View className="flex-row mt-4 space-x-2">
            <TouchableOpacity
              onPress={onEdit}
              className="flex-1 bg-white/20 py-2 rounded-lg mr-2"
            >
              <Text className="text-white text-center font-semibold">
                ✏️ Editar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onDelete}
              className="flex-1 bg-red-500/30 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                🗑️ Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};