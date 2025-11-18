// src/presentation/screens/asesor/ContratacionDetailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = AsesorStackScreenProps<'ContratacionDetail'>;

const ContratacionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contratacionId } = route.params;
  const { selectedContratacion, fetchContratacionById, updateContratacion } = useContratacionesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchContratacionById(contratacionId);
  }, [contratacionId]);

  const handleApprove = async () => {
    if (!user || !selectedContratacion) return;

    Alert.alert(
      'Aprobar Contratación',
      '¿Confirmar aprobación de esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            const result = await updateContratacion(contratacionId, user.id, { estado: 'aprobada' });
            if (result.success) {
              Alert.alert('Aprobada', 'Contratación aprobada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!user || !selectedContratacion) return;

    Alert.alert(
      'Rechazar Contratación',
      '¿Confirmar rechazo de esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            const result = await updateContratacion(contratacionId, user.id, { estado: 'rechazada' });
            if (result.success) {
              Alert.alert('Rechazada', 'Contratación rechazada.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            }
          },
        },
      ]
    );
  };

  if (!selectedContratacion) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="pt-4 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900 mt-4">
            Detalle de Contratación
          </Text>
        </View>

        {/* Estado */}
        <View
          className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: `${selectedContratacion.estadoColor}20` }}
        >
          <Text className="text-center text-xl font-bold" style={{ color: selectedContratacion.estadoColor }}>
            {selectedContratacion.estadoIcono} {selectedContratacion.estadoTexto}
          </Text>
        </View>

        {/* Cliente */}
        {selectedContratacion.usuario && (
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Cliente:</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xl font-bold">
                  {selectedContratacion.usuario.nombreMostrar[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-lg font-bold text-gray-900">
                  {selectedContratacion.usuario.nombreMostrar}
                </Text>
                <Text className="text-gray-600">{selectedContratacion.usuario.email}</Text>
                {selectedContratacion.usuario.telefono && (
                  <Text className="text-gray-600">{selectedContratacion.usuario.telefono}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Plan */}
        {selectedContratacion.plan && (
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Plan Contratado:</Text>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              {selectedContratacion.plan.nombre}
            </Text>
            <Text className="text-2xl font-bold text-primary-600">
              {selectedContratacion.plan.precioFormateado}/mes
            </Text>
            <View className="mt-3 space-y-1">
              <Text className="text-gray-600">📊 {selectedContratacion.plan.datosGb}</Text>
              <Text className="text-gray-600">📞 {selectedContratacion.plan.minutos}</Text>
            </View>
          </View>
        )}

        {/* Fechas */}
        <View className="bg-gray-50 p-4 rounded-xl mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Fechas:</Text>
          <Text className="text-gray-600 mb-1">
            Solicitado: {format(selectedContratacion.fechaContratacion, "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
          {selectedContratacion.fechaAprobacion && (
            <Text className="text-gray-600">
              {selectedContratacion.estaAprobada ? 'Aprobado' : 'Rechazado'}: {format(selectedContratacion.fechaAprobacion, "d 'de' MMMM, yyyy", { locale: es })}
            </Text>
          )}
        </View>

        {/* Notas */}
        {selectedContratacion.notas && (
          <View className="bg-blue-50 p-4 rounded-xl mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Notas:</Text>
            <Text className="text-gray-600">{selectedContratacion.notas}</Text>
          </View>
        )}

        {/* Acciones */}
        {selectedContratacion.estaPendiente && (
          <View className="space-y-3 mb-6">
            <Button
              title="✅ Aprobar Contratación"
              onPress={handleApprove}
              variant="primary"
              fullWidth
            />
            <Button
              title="❌ Rechazar Contratación"
              onPress={handleReject}
              variant="danger"
              fullWidth
            />
          </View>
        )}

        {!selectedContratacion.estaPendiente && (
          <Button
            title="💬 Ir al Chat"
            onPress={() => navigation.navigate('Chat', { contratacionId })}
            variant="primary"
            fullWidth
          />
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContratacionDetailScreen;