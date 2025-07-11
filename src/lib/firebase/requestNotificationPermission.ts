import { messaging } from "./initFirebaseClient";
import { getToken } from "firebase/messaging";

/**
 * This function handles the entire flow required to request user permission
 * for browser notifications and to retrieve a Firebase Cloud Messaging (FCM) token.
 *
 * Firebase Cloud Messaging requires:
 *  - The user to explicitly grant browser notification permission (`Notification.requestPermission()`).
 *  - The client to generate a VAPID-authenticated token using `getToken()` from the Firebase Messaging SDK.
 *
 * Important considerations:
 *  - This function must run on the **client side only** because it relies on the `window` and `Notification` APIs,
 *    which are not available in server environments (such as during SSR or inside API routes).
 *  - The Firebase `messaging` instance must be properly initialized **only in the browser**,
 *    which is why it is guarded inside `initFirebaseClient.ts` with `typeof window !== "undefined"`.
 *  - VAPID (Voluntary Application Server Identification for Web Push) is a web standard that enables browsers
 *    to validate and authorize push notification requests. The `vapidKey` must match the one configured in Firebase Console.
 *
 * Usage:
 * This function should be called after the app has mounted and ideally after the user has interacted
 * with the page. Some browsers (like Safari) restrict `Notification.requestPermission()` unless it's user-initiated.
 *
 * - If everything succeeds, the function returns a valid FCM token string.
 * - If any step fails (e.g., permissions denied, environment not ready), it returns `null`.
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    // Ensure this runs only on the browser (never SSR)
    if (typeof window === "undefined") {
      console.warn("FCM token request skipped: not in browser environment.");
      return null;
    }

    // Ensure messaging is initialized and available
    if (!messaging) {
      console.warn("Firebase Messaging is not available.");
      return null;
    }

    // Ask the user to grant permission for notifications
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("🔕 Notification permission not granted.");
      return null;
    }

    // Request the FCM token with the VAPID key
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch (error) {
    console.error("🔥 Error getting FCM token:", error);
    return null;
  }
};
