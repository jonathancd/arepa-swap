import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";
import { FirebaseApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

/**
 * This module is responsible for initializing the Firebase client SDK
 * and providing an instance of Firebase Messaging (used for push notifications).
 *
 * Why this needs a conditional check:
 * Firebase's `getMessaging()` function relies on the browser's `window` and `navigator` objects.
 * These objects are not available in a server-side environment, such as when rendering pages
 * via Next.js (SSR or static generation).
 *
 * If you try to call `initializeApp()` or `getMessaging()` in Node.js or on the server,
 * you will get runtime errors like "navigator is not defined".
 *
 * Best Practice:
 * Always wrap client-only code in `if (typeof window !== "undefined")` to prevent SSR crashes.
 * This ensures the Firebase client app and messaging system only run in the browser.
 *
 * Exports:
 * - `firebaseApp`: initialized Firebase app instance (if on browser).
 * - `messaging`: initialized Firebase Messaging instance (or null if not on client).
 *
 * This file should only be imported from browser/client-side code.
 * If you're writing server-side logic (e.g., sending push notifications from an API route),
 * use the **Firebase Admin SDK** instead (see `firebase-admin.ts`).
 */
let messaging: Messaging | null = null;
let firebaseApp: FirebaseApp | null = null;

if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  firebaseApp = initializeApp(firebaseConfig);
  messaging = getMessaging(firebaseApp);
}

export { firebaseApp, messaging };
