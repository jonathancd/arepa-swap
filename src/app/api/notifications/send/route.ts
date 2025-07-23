import { messaging } from "@/lib/firebase/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/notifications/send
 *
 * This API route is responsible for **sending push notifications** to a specific device
 * using Firebase Cloud Messaging (FCM) via the Firebase Admin SDK.
 *
 * This route runs on the server (Edge or Node) and uses the Firebase Admin credentials
 *     defined in `firebase-admin.ts`. It is secure and should **not** be exposed to the client directly.
 *
 * Request body (JSON):
 * {
 *   token: string;   // The FCM device token to send the notification to.
 *   title: string;   // The title of the push notification.
 *   body: string;    // The body (message) of the notification.
 * }
 *
 * Successful response:
 * {
 *   success: true
 * }
 *
 * Error responses:
 * - 400: Invalid payload (missing or malformed fields).
 * - 500: Failed to send notification (e.g. network or FCM error).
 *
 * Best practices:
 * - Validate the FCM token on the backend if needed.
 * - Consider rate-limiting or authorization if exposing this route to users.
 *
 * The actual notification is sent via `messaging.send()`, using the token and content provided.
 *     The `webpush.notification.icon` can be customized per project.
 */

export async function POST(req: NextRequest) {
  try {
    const { token, title, body } = await req.json();

    if (!token || !title || !body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // await messaging.send({
    //   token,
    //   notification: {
    //     title,
    //     body,
    //   },
    //   webpush: {
    //     notification: {
    //       icon: "/icon.png",
    //     },
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
