import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { ChatBubble } from '../../components/ChatBubble';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = UsuarioStackScreenProps<'Chat'>;

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contratacionId } = route.params;
  const { messages, isTyping, fetchMessages, sendMessage, markAsRead, updateTypingStatus, clearTypingStatus, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { user, profile } = useAuthStore();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chatMessages = messages[contratacionId] || [];
  const isOtherUserTyping = isTyping[contratacionId] || false;

  useEffect(() => {
    if (!user || !profile) return;

    fetchMessages(contratacionId);
    subscribeToMessages(contratacionId, user.id, profile.nombreMostrar);
    markAsRead(contratacionId, user.id);

    return () => {
      if (user) clearTypingStatus(contratacionId, user.id);
      unsubscribeFromMessages(contratacionId);
    };
  }, [contratacionId, user]);

  const handleSend = async () => {
    if (!message.trim() || !user || !profile) return;

    const messageText = message.trim();
    setMessage('');

    await sendMessage(user.id, { contratacionId, mensaje: messageText }, profile.nombreMostrar);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    if (!user) return;

    updateTypingStatus(contratacionId, user.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (user) updateTypingStatus(contratacionId, user.id, false);
    }, 1000);
  };

  if (!user) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold">Chat con Asesor</Text>
          {isOtherUserTyping && (
            <Text className="text-sm text-green-600">escribiendo...</Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 py-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} mensaje={msg} isMine={msg.remitenteId === user.id} />
          ))}
        </ScrollView>

        <View className="px-6 py-4 border-t border-gray-200 flex-row items-center">
          <TextInput
            value={message}
            onChangeText={handleTextChange}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-2"
          />
          <TouchableOpacity onPress={handleSend} className="bg-primary-600 w-12 h-12 rounded-full items-center justify-center">
            <Text className="text-white text-xl">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;