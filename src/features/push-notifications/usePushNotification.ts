import { ChevronsLeft } from "lucide-react";

export function usePushNotification() {
  /**
   * Sends a push notification via FCM using the token stored in localStorage.
   * @param title Title of the notification
   * @param body Body content of the notification
   */
  const sendTestNotification = async (title: string, body: string) => {
    const token = localStorage.getItem("fcmToken");
    if (!token) {
      console.warn("No FCM token found in localStorage");
      return;
    }

    if (!title) {
      console.warn("No title for the notification");
      return;
    }

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title,
          body,
        }),
      });

      console.log("response", response);
      if (!response.ok) throw new Error("Request failed");

      console.log("Test notification sent");
    } catch (error) {
      console.error("Failed to send test notification:", error);
    }
  };

  return {
    sendTestNotification,
  };
}
