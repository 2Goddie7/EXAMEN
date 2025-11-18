import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from './Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (minPrice: number, maxPrice: number) => void;
  onClear: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onClear,
}) => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const priceRanges = [
    { label: 'Hasta $20', min: 0, max: 20 },
    { label: '$20 - $35', min: 20, max: 35 },
    { label: '$35 - $50', min: 35, max: 50 },
    { label: 'Más de $50', min: 50, max: 1000 },
  ];

  const handleApply = () => {
    if (selectedRange) {
      const range = priceRanges.find(r => r.label === selectedRange);
      if (range) {
        onApply(range.min, range.max);
        onClose();
      }
    }
  };

  const handleClear = () => {
    setSelectedRange(null);
    onClear();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              Filtrar por Precio
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-2xl">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.label}
                onPress={() => setSelectedRange(range.label)}
                className={`p-4 rounded-xl mb-3 border-2 ${
                  selectedRange === range.label
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Text
                  className={`text-lg font-semibold ${
                    selectedRange === range.label
                      ? 'text-primary-600'
                      : 'text-gray-900'
                  }`}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="mt-6 space-y-3">
            <Button
              title="Aplicar Filtro"
              onPress={handleApply}
              disabled={!selectedRange}
              fullWidth
            />
            <Button
              title="Limpiar Filtros"
              onPress={handleClear}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};