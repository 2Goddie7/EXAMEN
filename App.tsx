import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { NotificationsService } from './src/data/services/NotificationsService';
import './global.css';

export default function App() {
  useEffect(() => {
    // Registrar notificaciones push
    const notificationService = NotificationsService.getInstance();
    notificationService.registerForPushNotifications();

    // Listener para notificaciones recibidas
    const receivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    // Listener para cuando el usuario toca una notificación
    const responseSubscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        // Aquí puedes navegar a la pantalla correspondiente según el tipo
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}