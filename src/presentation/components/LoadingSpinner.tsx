import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  size = 'large',
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size={size} color="#0057e6" />
      {message && (
        <Text className="text-gray-600 mt-4 text-base">
          {message}
        </Text>
      )}
    </View>
  );
};