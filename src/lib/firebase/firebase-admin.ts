import admin from "firebase-admin";
import serviceAccount from "./firebase-admin.json";

/**
 * This module initializes the Firebase Admin SDK using service account credentials.
 * It should ONLY be used in server-side code (e.g. API routes, background jobs).
 *
 * WARNING:
 * This file must NEVER be imported in any client-side code or exposed to the browser.
 * It contains sensitive credentials that can be used to impersonate your Firebase project.
 *
 * What is `firebase-admin.json`?
 * It's a private service account key downloaded from Firebase Console:
 * - Go to: Project Settings → Service accounts → Generate new private key
 * - Place it in your `/lib/firebase/` folder (never commit it to Git!)
 *
 * Why `!admin.apps.length`?
 * The Firebase Admin SDK throws an error if you call `initializeApp()` more than once.
 * We use this check to ensure the app is only initialized once, even during hot-reloads.
 *
 * Exports:
 * - `messaging`: a Firebase Admin Messaging instance, used to send push notifications
 *   to specific FCM tokens from the server.
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const messaging = admin.messaging();
