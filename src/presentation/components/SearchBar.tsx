import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  showFilter?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onFilter,
  showFilter = false,
}) => {
  return (
    <View className="flex-row items-center mb-4">
      <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200 mr-2">
        <Text className="text-xl mr-3">🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-900 text-base"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Text className="text-gray-400 text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showFilter && onFilter && (
        <TouchableOpacity
          onPress={onFilter}
          className="bg-primary-600 p-3 rounded-xl"
        >
          <Text className="text-white text-xl">⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};