import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Contratacion } from '@domain/entities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContratacionCardProps {
  contratacion: Contratacion;
  onPress: () => void;
  showUser?: boolean;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ContratacionCard: React.FC<ContratacionCardProps> = ({
  contratacion,
  onPress,
  showUser = false,
  showActions = false,
  onApprove,
  onReject,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-md border border-gray-100"
      activeOpacity={0.7}
    >
      {/* Header con estado */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {contratacion.plan?.nombre || 'Plan'}
          </Text>
          {showUser && contratacion.usuario && (
            <Text className="text-sm text-gray-600">
              Cliente: {contratacion.usuario.nombreMostrar}
            </Text>
          )}
        </View>
        
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${contratacion.estadoColor}20` }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: contratacion.estadoColor }}
          >
            {contratacion.estadoIcono} {contratacion.estadoTexto}
          </Text>
        </View>
      </View>

      {/* Detalles del plan */}
      {contratacion.plan && (
        <View className="bg-gray-50 rounded-xl p-3 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Precio</Text>
            <Text className="text-primary-600 font-bold text-lg">
              {contratacion.plan.precioFormateado}/mes
            </Text>
          </View>
          
          <View className="flex-row items-center mb-1">
            <Text className="text-2xl mr-2">📊</Text>
            <Text className="text-gray-700 text-sm flex-1">
              {contratacion.plan.datosGb}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">📞</Text>
            <Text className="text-gray-700 text-sm flex-1">
              {contratacion.plan.minutos}
            </Text>
          </View>
        </View>
      )}

      {/* Fecha */}
      <View className="border-t border-gray-100 pt-3 mb-3">
        <Text className="text-xs text-gray-500">
          Solicitado: {format(contratacion.fechaContratacion, "d 'de' MMMM, yyyy", { locale: es })}
        </Text>
        {contratacion.fechaAprobacion && (
          <Text className="text-xs text-gray-500 mt-1">
            {contratacion.estaAprobada ? 'Aprobado' : 'Rechazado'}: {format(contratacion.fechaAprobacion, "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
        )}
      </View>

      {/* Notas */}
      {contratacion.notas && (
        <View className="bg-blue-50 rounded-lg p-3 mb-3">
          <Text className="text-xs text-gray-600 font-medium mb-1">
            Notas:
          </Text>
          <Text className="text-sm text-gray-700">
            {contratacion.notas}
          </Text>
        </View>
      )}

      {/* Acciones para asesores */}
      {showActions && contratacion.estaPendiente && (
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={onApprove}
            className="flex-1 bg-green-500 py-3 rounded-xl mr-2"
          >
            <Text className="text-white text-center font-semibold">
              ✅ Aprobar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onReject}
            className="flex-1 bg-red-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              ❌ Rechazar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón de chat */}
      {!contratacion.estaPendiente && (
        <TouchableOpacity
          onPress={onPress}
          className="bg-primary-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">
            💬 Ir al Chat
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};