import type { NextApiRequest, NextApiResponse } from 'next';
import { userNotifications } from './webhook';

const API_KEY = '21128ECB-A49A-489A-8FB7-7158E43931DE';
const API_BASE = 'https://api.neynar.com/v2/farcaster';

interface NotificationResult {
  fid: number;
  success: boolean;
  message: string;
  scoreChanged?: boolean;
  oldScore?: number;
  newScore?: number;
}

async function fetchUserScore(fid: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/user/bulk?fids=${fid}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch score for FID ${fid}:`, res.statusText);
      return null;
    }

    const data = await res.json();
    const users = data.result?.users || data.users || [];
    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    let score: number;
    
    if (user.experimental?.neynar_user_score !== undefined) {
      score = user.experimental.neynar_user_score;
      if (score > 0 && score <= 1) {
        score *= 100;
      }
    } else if (user.neynar_score !== undefined) {
      score = user.neynar_score;
      if (score > 0 && score <= 1) {
        score *= 100;
      }
    } else {
      const followerCount = user.follower_count || 0;
      const followingCount = user.following_count || 0;
      const verifications = user.verifications?.length || 0;
      score = Math.round(
        Math.min(60, 20 * Math.log10(followerCount + 1)) +
        Math.min(30, 10 * Math.log10(followingCount + 1)) +
        Math.min(10, 5 * verifications)
      );
    }

    return Math.round(Math.min(100, Math.max(0, score)));
  } catch (err) {
    console.error(`Error fetching score for FID ${fid}:`, err);
    return null;
  }
}

async function sendNotification(
  notificationUrl: string,
  notificationToken: string,
  fid: number,
  oldScore: number,
  newScore: number
): Promise<boolean> {
  try {
    const notificationId = `score_update_${fid}_${Date.now()}`;
    const scoreDiff = newScore - oldScore;
    const diffText = scoreDiff > 0 ? `+${scoreDiff}` : `${scoreDiff}`;

    const response = await fetch(notificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId,
        title: '积分更新 🎉',
        body: `您的积分已更新：${oldScore} → ${newScore} (${diffText})`,
        targetUrl: `https://farcaster-neynar-score-miniapp.vercel.app/?fid=${fid}`,
        tokens: [notificationToken],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send notification for FID ${fid}:`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Notification sent for FID ${fid}:`, result);
    return true;
  } catch (err) {
    console.error(`Error sending notification for FID ${fid}:`, err);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; results: NotificationResult[] }>
) {
  // Allow GET (for manual testing) and POST (for cron jobs)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, results: [] });
  }

  // Vercel Cron sends a specific header, but we'll allow manual calls too
  // For production, you should verify the Authorization header from Vercel Cron
  const isVercelCron = req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}` ||
                       req.headers['x-vercel-cron'] === '1';
  
  // Allow manual testing with token query param, or Vercel Cron
  const manualToken = req.query.token as string;
  const expectedToken = process.env.CRON_SECRET;
  
  if (!isVercelCron && manualToken !== expectedToken && expectedToken) {
    // In development, allow without token for testing
    if (process.env.NODE_ENV === 'production' && !manualToken) {
      return res.status(401).json({ success: false, results: [] });
    }
  }

  const results: NotificationResult[] = [];
  const fids = Object.keys(userNotifications).map(Number);

  console.log(`🔍 Checking score updates for ${fids.length} users...`);

  for (const fid of fids) {
    const userData = userNotifications[fid];
    
    if (!userData.enabled) {
      results.push({
        fid,
        success: true,
        message: 'Notifications disabled',
        scoreChanged: false,
      });
      continue;
    }

    try {
      const currentScore = await fetchUserScore(fid);
      
      if (currentScore === null) {
        results.push({
          fid,
          success: false,
          message: 'Failed to fetch score',
        });
        continue;
      }

      const lastScore = userData.lastScore || 0;
      const scoreChanged = currentScore !== lastScore;

      if (scoreChanged && lastScore > 0) {
        // Score has changed, send notification
        const notificationSent = await sendNotification(
          userData.notificationUrl,
          userData.notificationToken,
          fid,
          lastScore,
          currentScore
        );

        if (notificationSent) {
          // Update stored score
          userData.lastScore = currentScore;
          userData.lastChecked = new Date();
          
          results.push({
            fid,
            success: true,
            message: 'Notification sent',
            scoreChanged: true,
            oldScore: lastScore,
            newScore: currentScore,
          });
        } else {
          results.push({
            fid,
            success: false,
            message: 'Failed to send notification',
            scoreChanged: true,
            oldScore: lastScore,
            newScore: currentScore,
          });
        }
      } else {
        // Update stored score even if no change (for first-time check)
        if (lastScore === 0) {
          userData.lastScore = currentScore;
          userData.lastChecked = new Date();
        }
        
        results.push({
          fid,
          success: true,
          message: scoreChanged ? 'Score changed but notification not sent (first check)' : 'No score change',
          scoreChanged: scoreChanged && lastScore > 0,
          oldScore: lastScore,
          newScore: currentScore,
        });
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`Error processing FID ${fid}:`, err);
      results.push({
        fid,
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  console.log(`✅ Completed checking ${results.length} users`);
  
  return res.status(200).json({
    success: true,
    results,
  });
}
