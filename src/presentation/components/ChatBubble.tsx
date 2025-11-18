import React from 'react';
import { View, Text } from 'react-native';
import { MensajeChat } from '@domain/entities';

interface ChatBubbleProps {
  mensaje: MensajeChat;
  isMine: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ mensaje, isMine }) => {
  return (
    <View
      className={`mb-3 flex-row ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isMine
            ? 'bg-primary-600 rounded-br-sm'
            : 'bg-gray-200 rounded-bl-sm'
        }`}
      >
        {!isMine && mensaje.remitente && (
          <Text className="text-xs text-gray-600 font-semibold mb-1">
            {mensaje.remitente.nombreMostrar}
          </Text>
        )}
        
        <Text className={`text-base ${isMine ? 'text-white' : 'text-gray-900'}`}>
          {mensaje.mensaje}
        </Text>
        
        <View className="flex-row items-center justify-end mt-1">
          <Text
            className={`text-xs ${
              isMine ? 'text-white/70' : 'text-gray-500'
            }`}
          >
            {mensaje.horaFormateada}
          </Text>
          
          {isMine && (
            <Text className="text-xs text-white/70 ml-1">
              {mensaje.leido ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};