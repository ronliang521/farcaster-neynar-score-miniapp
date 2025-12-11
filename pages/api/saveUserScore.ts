import type { NextApiRequest, NextApiResponse } from 'next';
import { userNotifications } from './webhook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { fid, score } = req.body;

    if (!fid || score === undefined || score === null) {
      return res.status(400).json({ success: false, message: 'FID and score are required' });
    }

    // If user has notifications enabled, initialize or update their score
    // This is called when user queries their score, so we have a baseline
    if (userNotifications[fid]) {
      // Only update if this is the first time (lastScore is 0) or if score changed
      if (userNotifications[fid].lastScore === 0) {
        userNotifications[fid].lastScore = score;
        userNotifications[fid].lastChecked = new Date();
        console.log(`📊 Initialized score for FID ${fid}: ${score}`);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving user score:', err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Internal server error'
    });
  }
}
