import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = '21128ECB-A49A-489A-8FB7-7158E43931DE';
const API_BASE = 'https://api.neynar.com/v2/farcaster';

interface Follower {
  fid: string;
  username: string;
}

interface UserData {
  score: number;
  followers: Follower[];
  username: string;
  fid: number;
  avatarUrl: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
}

async function fetchUserByUsername(username: string) {
  const res = await fetch(`${API_BASE}/user/by_username?username=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  });

  return res;
}

async function fetchUserBulk(fids: number) {
  const res = await fetch(`${API_BASE}/user/bulk?fids=${fids}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  });

  return res;
}

async function fetchFollowers(fid: number): Promise<Follower[]> {
  const followers: Follower[] = [];
  try {
    // Increase limit to get more followers for better @ mention selection
    const res = await fetch(`${API_BASE}/user/followers?fid=${fid}&limit=50`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const users = data.result?.users || data.users || [];
      users.forEach((user: any) => {
        // Only add users with valid usernames
        if (user.username) {
          followers.push({
            fid: user.fid?.toString() || '',
            username: user.username
          });
        }
      });
      console.log(`✅ Fetched ${followers.length} followers for FID ${fid}`);
    } else {
      console.warn(`⚠️ Failed to fetch followers for FID ${fid}: ${res.statusText}`);
    }
  } catch (err) {
    console.error('Error fetching followers:', err);
  }
  return followers;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fid } = req.query;

  if (!fid || typeof fid !== 'string') {
    return res.status(400).json({ error: 'FID or username is required' });
  }

  const fidNum = parseInt(fid, 10);
  const isNumericFid = !isNaN(fidNum) && fidNum.toString() === fid.trim();

  try {
    let userRes;
    let userData;
    let user;

    if (isNumericFid) {
      userRes = await fetchUserBulk(fidNum);
      if (!userRes.ok) {
        const errorText = await userRes.text();
        console.error('Neynar API error:', errorText);
        return res.status(userRes.status).json({
          error: `Failed to fetch user data: ${userRes.statusText}`
        });
      }

      userData = await userRes.json();
      const users = userData.result?.users || userData.users || [];
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      user = users[0];
    } else {
      const username = fid.trim();
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

      userRes = await fetchUserByUsername(cleanUsername);
      if (!userRes.ok) {
        const errorText = await userRes.text();
        console.error('Neynar API error:', errorText);
        return res.status(userRes.status).json({
          error: `Failed to fetch user data: ${userRes.statusText}`
        });
      }

      userData = await userRes.json();
      user = userData.result?.user || userData.user;

      if (!user || !user.fid) {
        return res.status(404).json({ error: 'User not found' });
      }

      const bulkRes = await fetchUserBulk(user.fid);
      if (bulkRes.ok) {
        const bulkData = await bulkRes.json();
        const users = bulkData.result?.users || bulkData.users || [];
        if (users.length > 0) {
          user = users[0];
        }
      }
    }

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
      score = Math.min(100, Math.max(0, score));
    }

    score = Math.round(Math.min(100, Math.max(0, score)));
    console.log('Calculated score:', score, 'Type:', typeof score);

    const userFid = user.fid;
    // Optimize: Extract user data in parallel with fetching followers
    const username = user.username || '';
    const avatarUrl = user.pfp_url || user.pfp?.url || user.avatar_url || '';
    const displayName = user.display_name || user.displayName || username;
    const followerCount = user.follower_count || 0;
    const followingCount = user.following_count || 0;
    
    // Fetch followers - important for @ mentions feature
    // Increase timeout to ensure we get followers
    let followers: Follower[] = [];
    try {
      followers = await Promise.race([
        fetchFollowers(userFid),
        new Promise<Follower[]>((resolve) => setTimeout(() => {
          console.warn(`⚠️ Followers fetch timeout for FID ${userFid}`);
          resolve([]);
        }, 5000)) // 5s timeout to allow more time
      ]);
    } catch (err) {
      console.warn('Followers fetch failed or timed out, continuing without:', err);
    }
    
    console.log(`📊 Returning ${followers.length} followers for FID ${userFid}`);

    return res.status(200).json({
      score,
      followers,
      username,
      fid: userFid,
      avatarUrl,
      displayName,
      followerCount,
      followingCount
    });
  } catch (err) {
    console.error('Error fetching score:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to fetch score'
    });
  }
}


