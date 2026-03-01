// components/NotificationSwitch.tsx
import React, { useState, useEffect } from 'react';

const NotificationSwitch: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(Notification.permission === 'granted');

  useEffect(() => {
    // Verifica se já existe uma assinatura de notificação
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        if (subscription) {
          setIsSubscribed(true);
        }
      });
    });
  }, []);

  const handleToggle = async () => {
    if (isSubscribed) {
      // Lógica para cancelar a inscrição
      await unsubscribeUser();
    } else {
      // Lógica para solicitar permissão e inscrever
      await subscribeUser();
    }
  };

  const subscribeUser = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsPermissionGranted(true);
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BCWAWrP-ljGf0RBALek7_Ej56XwddqdKxQ15TAMPuTfs-Zn_S0doaW2L3dkAP4UhIoaIC0WGEId9BdSdlqsv0lw' // Substituir pela sua chave VAPID pública
        });
        console.log('Usuário inscrito:', subscription);
        // TODO: Enviar a inscrição para o seu servidor
        setIsSubscribed(true);
      } else {
        console.warn('Permissão para notificações negada.');
      }
    } catch (error) {
      console.error('Falha ao inscrever o usuário:', error);
    }
  };

  const unsubscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Inscrição cancelada.');
        // TODO: Enviar a informação de cancelamento para o seu servidor
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Falha ao cancelar a inscrição:', error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-700 dark:text-slate-300">Receber Notificações</span>
      <button
        onClick={handleToggle}
        disabled={!isPermissionGranted && Notification.permission !== 'default'}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 ${
          isSubscribed ? 'bg-lime-600' : 'bg-slate-400 dark:bg-slate-600'
        } ${
          !isPermissionGranted && Notification.permission !== 'default' ? 'cursor-not-allowed opacity-50' : ''
        }`}>
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
            isSubscribed ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationSwitch;
