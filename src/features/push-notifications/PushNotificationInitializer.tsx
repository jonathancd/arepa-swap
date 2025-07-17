"use client";

import { useEffect } from "react";
import { registerFirebaseServiceWorker } from "@/lib/firebase/registerFirebaseSw";
import { requestNotificationPermission } from "@/lib/firebase/requestNotificationPermission";
import { listenToForegroundMessages } from "@/lib/firebase/listenToForegroundMessages";

/**
 * This client-only React component is responsible for initializing Firebase Cloud Messaging (FCM)
 * notifications in the browser. It should be mounted inside a layout or client component that is
 * guaranteed to be rendered on the client side (e.g. <ThemeProvider>, <body>, etc.).
 *
 * What it does:
 * 1. Registers the Firebase Service Worker, which is required for background notifications
 *    (when the app is closed or in a background tab).
 *
 * 2. Requests permission from the user to send browser notifications. If granted, it obtains
 *    a unique FCM token for the current browser instance using the VAPID key.
 *
 * 3. Stores the token locally (Currently using `localStorage`) so it can be used later (e.g. to send test
 *    notifications or associate it with a user on the backend).
 *
 * 4. Starts listening for messages while the app is open (foreground notifications).
 *    These messages are handled using the `onMessage()` API and displayed with the `Notification` API.
 *
 * Notes:
 * - This component should only run on the browser. It uses the `window`, `navigator` and `Notification` APIs.
 * - The Service Worker file must exist at `/public/firebase-messaging-sw.js` for background notifications to work.
 * - This setup only handles **web push notifications**, not native mobile.
 *
 * Security Reminder:
 * - The FCM token should not be exposed publicly if it's tied to a logged-in user. Send it securely to your backend if needed.
 */
export function PushNotificationInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    registerFirebaseServiceWorker();

    const initNotifications = async () => {
      const token = await requestNotificationPermission();

      if (token) {
        localStorage.setItem("fcmToken", token);
      }
    };

    initNotifications();

    listenToForegroundMessages();
  }, []);

  return null;
}
