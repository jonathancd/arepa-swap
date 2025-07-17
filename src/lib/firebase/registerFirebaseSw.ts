/**
 * Registers the Service Worker required by Firebase to handle
 * background push notifications.
 *
 * This should be executed on the client side and assumes the presence
 * of a `/firebase-messaging-sw.js` file in the public root (`/public`).
 */
export function registerFirebaseServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        // console.log("✅ Service Worker registered successfully:", registration);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  }
}
