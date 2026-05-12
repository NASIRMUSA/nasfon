import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../supabase';

export function usePushNotifications() {
  useEffect(() => {
    const initFirebasePush = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        // console.log("🚀 [Firebase Push] Starting initialization...");
        try {
          let permStatus = await PushNotifications.checkPermissions();

          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }

          if (permStatus.receive !== 'granted') {
            // console.log("❌ [Firebase Push] User denied permissions!");
            return;
          }

          // console.log("✅ [Firebase Push] Permission granted. Setting up listeners...");
          
          await PushNotifications.addListener('registration', async (token) => {
            console.log('🔥 [Firebase Push] Push registration success, token: ' + token.value);
            
            // Handle unique device ID for "New User" tracking
            let deviceId = localStorage.getItem('nasfon_device_id');
            if (!deviceId) {
              deviceId = `user_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
              localStorage.setItem('nasfon_device_id', deviceId);
              console.log("🆕 [Firebase Push] New User detected! Generated ID:", deviceId);
            }

            if (import.meta.env.VITE_SUPABASE_URL) {
              console.log("💾 [Firebase Push] Saving token to Supabase...");
              const { error } = await supabase.from('fcm_tokens').upsert({ 
                token: token.value, 
                device_id: deviceId,
                updated_at: new Date().toISOString() 
              }, { onConflict: 'token' });
              
              if (error) {
                console.error("❌ [Firebase Push] Error saving token to DB:", error);
              } else {
                console.log("✅ [Firebase Push] Token saved successfully.");
              }
            } else {
              console.warn("⚠️ [Firebase Push] VITE_SUPABASE_URL missing, token not saved.");
            }
          });

          await PushNotifications.addListener('registrationError', (error: any) => {
              console.error('❌ [Firebase Push] Error on registration: ' + JSON.stringify(error));
          });

          await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('🚀 [Firebase Push] Push received in foreground: ' + JSON.stringify(notification));
            // Show a simple alert or toast if the app is open
            alert(`New Notification:\n${notification.title}\n${notification.body}`);
          });

          await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('🚀 [Firebase Push] Push action performed: ' + JSON.stringify(notification));
          });

          // Register AFTER listeners are attached
          console.log("📡 [Firebase Push] Calling register()...");
          await PushNotifications.register();

        } catch (error) {
          console.error("❌ [Firebase Push] Initialization error:", error);
        }
      } else {
        console.log("ℹ️ [Firebase Push] Skipping init: App is running in Web Browser.");
      }
    };

    initFirebasePush();
  }, []);
}
