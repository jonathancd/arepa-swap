// Example of a Firebase service worker for background push notifications.
// Replace the placeholders with your own Firebase config and rename this file to `firebase-messaging-sw.js`.
// This file should be ignored in version control once configured locally.

/**
 * Firebase Messaging Service Worker
 *
 * This Service Worker handles **background push notifications** using Firebase Cloud Messaging (FCM).
 * It runs independently from the main React or Next.js application, and it is **required**
 * in order to receive notifications when:
 * - the browser is in the background,
 * - the tab is inactive,
 * - or the application is fully closed.
 *
 * This file must be located in the `/public` directory of the Next.js app.
 *     (It will be served at `/firebase-messaging-sw.js`)
 *
 * What this file does:
 * 1. Imports the Firebase "compat" libraries because Service Workers do not support ES modules.
 *    - `firebase-app-compat.js`: initializes Firebase.
 *    - `firebase-messaging-compat.js`: provides background messaging support.
 *
 * 2. Initializes Firebase using the same config as the client.
 *    These values are **public** and safe to expose in the Service Worker.
 *
 * 3. Sets up a listener (`onBackgroundMessage`) that is triggered when a push notification is
 *    received while the app is not active.
 *
 * 4. Displays a native browser notification using `self.registration.showNotification()`.
 *
 * Security:
 * - This file does not handle any user-specific logic or sensitive data.
 * - It should not contain any private API keys or credentials.
 *
 * Required by:
 * - `registerFirebaseServiceWorker()` from your client app.
 * - Firebase's internal FCM infrastructure.
 */

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT",
  storageBucket: "YOUR_FIREBASE_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
