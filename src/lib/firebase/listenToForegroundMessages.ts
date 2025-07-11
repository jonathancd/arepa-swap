import { onMessage } from "firebase/messaging";
import { messaging } from "./initFirebaseClient";

/**
 * Sets up a listener to handle push notifications while the app is in the foreground.
 * This should be called from a client-side component only (e.g., inside a `useEffect`).
 *
 * When a message is received, it shows a native browser notification if permission has been granted.
 *
 * Requirements:
 * - The `Notification` API must be available (i.e., running in a browser).
 * - `Notification.permission` must be "granted".
 * - The Firebase `messaging` instance must be initialized on the client.
 */
export const listenToForegroundMessages = () => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("🔔 Foreground message received:", payload);

    const title = payload.notification?.title || "Nueva notificación";
    const options = {
      body: payload.notification?.body || "",
      icon: "/logo.png",
    };

    // Muestra una notificación tipo sistema
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  });
};
