import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage (for MVP - in production, use Vercel KV, database, etc.)
// Note: This will reset on serverless function cold starts
// For production, use Vercel KV (Redis) or a database like PostgreSQL
// Format: { [fid]: { notificationToken: string, notificationUrl: string, lastScore: number, lastChecked: Date } }
const userNotifications: Record<number, {
  notificationToken: string;
  notificationUrl: string;
  lastScore: number;
  lastChecked: Date;
  enabled: boolean;
}> = {};

interface WebhookEvent {
  type: 'miniapp_added' | 'miniapp_removed' | 'notifications_enabled' | 'notifications_disabled';
  fid: number;
  notificationDetails?: {
    url: string;
    token: string;
  };
  timestamp: number;
  // Note: In production, verify the signature using the user's app key
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const event: WebhookEvent = req.body;

    if (!event.type || !event.fid) {
      return res.status(400).json({ success: false, message: 'Invalid event data' });
    }

    console.log(`📬 Received webhook event: ${event.type} for FID: ${event.fid}`);

    switch (event.type) {
      case 'miniapp_added':
        if (event.notificationDetails) {
          userNotifications[event.fid] = {
            notificationToken: event.notificationDetails.token,
            notificationUrl: event.notificationDetails.url,
            lastScore: 0,
            lastChecked: new Date(),
            enabled: false, // Notifications need to be explicitly enabled
          };
          console.log(`✅ User ${event.fid} added Mini App, token saved`);
        }
        break;

      case 'miniapp_removed':
        delete userNotifications[event.fid];
        console.log(`🗑️ User ${event.fid} removed Mini App, token deleted`);
        break;

      case 'notifications_enabled':
        if (event.notificationDetails && userNotifications[event.fid]) {
          userNotifications[event.fid].notificationToken = event.notificationDetails.token;
          userNotifications[event.fid].notificationUrl = event.notificationDetails.url;
          userNotifications[event.fid].enabled = true;
          console.log(`🔔 Notifications enabled for user ${event.fid}`);
        }
        break;

      case 'notifications_disabled':
        if (userNotifications[event.fid]) {
          userNotifications[event.fid].enabled = false;
          console.log(`🔕 Notifications disabled for user ${event.fid}`);
        }
        break;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Internal server error'
    });
  }
}

// Export userNotifications for use in other API routes
export { userNotifications };
