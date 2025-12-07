import type { NextApiRequest, NextApiResponse } from 'next';

interface Follower {
  fid: string;
  username: string;
}

interface ApiResponse {
  score?: number;
  followers?: Follower[];
  username?: string;
  fid?: number;
  avatarUrl?: string;
  displayName?: string;
  followerCount?: number;
  followingCount?: number;
  error?: string;
}

const NEYNAR_API_KEY = '21128ECB-A49A-489A-8FB7-7158E43931DE';
const NEYNAR_API_BASE_URL = 'https://api.neynar.com/v2/farcaster';

async function fetchNeynarUserByUsername(username: string) {
  // 尝试使用 api_key header
  let response = await fetch(
    `${NEYNAR_API_BASE_URL}/user/by_username?username=${encodeURIComponent(username)}`,
    {
      method: 'GET',
      headers: {
        'api_key': NEYNAR_API_KEY,
        'Accept': 'application/json',
      },
    }
  );

  // 如果 api_key 不行，尝试 x-api-key
  if (!response.ok) {
    response = await fetch(
      `${NEYNAR_API_BASE_URL}/user/by_username?username=${encodeURIComponent(username)}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': NEYNAR_API_KEY,
          'Accept': 'application/json',
        },
      }
    );
  }

  return response;
}

async function fetchNeynarUser(fidNumber: number) {
  // 尝试使用 api_key header
  let response = await fetch(
    `${NEYNAR_API_BASE_URL}/user/bulk?fids=${fidNumber}`,
    {
      method: 'GET',
      headers: {
        'api_key': NEYNAR_API_KEY,
        'Accept': 'application/json',
      },
    }
  );

  // 如果 api_key 不行，尝试 x-api-key
  if (!response.ok) {
    response = await fetch(
      `${NEYNAR_API_BASE_URL}/user/bulk?fids=${fidNumber}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': NEYNAR_API_KEY,
          'Accept': 'application/json',
        },
      }
    );
  }

  return response;
}

async function fetchNeynarFollowers(fidNumber: number): Promise<Follower[]> {
  const followers: Follower[] = [];
  
  try {
    // 尝试使用 api_key header
    let response = await fetch(
      `${NEYNAR_API_BASE_URL}/user/followers?fid=${fidNumber}&limit=10`,
      {
        method: 'GET',
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    // 如果 api_key 不行，尝试 x-api-key
    if (!response.ok) {
      response = await fetch(
        `${NEYNAR_API_BASE_URL}/user/followers?fid=${fidNumber}&limit=10`,
        {
          method: 'GET',
          headers: {
            'x-api-key': NEYNAR_API_KEY,
            'Accept': 'application/json',
          },
        }
      );
    }

    if (response.ok) {
      const followersData = await response.json();
      const followerUsers = followersData.result?.users || followersData.users || [];
      followerUsers.forEach((f: any) => {
        followers.push({
          fid: f.fid?.toString() || '',
          username: f.username || `fid-${f.fid}`,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
    // 如果获取关注者失败，不影响主流程
  }

  return followers;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fid } = req.query;

  if (!fid || typeof fid !== 'string') {
    return res.status(400).json({ error: 'FID or username is required' });
  }

  // 判断输入是 FID（数字）还是用户名（字符串）
  const fidNumber = parseInt(fid, 10);
  const isFid = !isNaN(fidNumber) && fidNumber.toString() === fid.trim();

  try {
    let userResponse;
    let userData;
    let user: any;

    if (isFid) {
      // 直接通过 FID 查询
      userResponse = await fetchNeynarUser(fidNumber);

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('Neynar API error:', errorText);
        return res.status(userResponse.status).json({
          error: `Failed to fetch user data: ${userResponse.statusText}`,
        });
      }

      userData = await userResponse.json();
      
      // 处理不同的响应格式
      const users = userData.result?.users || userData.users || [];
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      user = users[0];
    } else {
      // 通过用户名查询，先获取 FID
      const username = fid.trim();
      
      // 移除 @ 符号（如果用户输入了）
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

      userResponse = await fetchNeynarUserByUsername(cleanUsername);

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('Neynar API error:', errorText);
        return res.status(userResponse.status).json({
          error: `Failed to fetch user data: ${userResponse.statusText}`,
        });
      }

      userData = await userResponse.json();
      
      // 处理不同的响应格式
      user = userData.result?.user || userData.user;
      
      if (!user || !user.fid) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 通过获取到的 FID 再次查询完整用户信息（包括 followers 等）
      const fullUserResponse = await fetchNeynarUser(user.fid);
      if (fullUserResponse.ok) {
        const fullUserData = await fullUserResponse.json();
        const users = fullUserData.result?.users || fullUserData.users || [];
        if (users.length > 0) {
          user = users[0];
        }
      }
    }

    // 尝试获取 Neynar 分数（如果存在）
    let score: number;
    
    if (user.experimental?.neynar_user_score !== undefined) {
      score = user.experimental.neynar_user_score;
      // 如果分数是0-1之间的小数，转换为0-100的整数
      if (score > 0 && score <= 1) {
        score = score * 100;
      }
    } else if (user.neynar_score !== undefined) {
      score = user.neynar_score;
      // 如果分数是0-1之间的小数，转换为0-100的整数
      if (score > 0 && score <= 1) {
        score = score * 100;
      }
    } else {
      // 如果没有直接的分数字段，基于用户的社交指标计算分数
      const followerCount = user.follower_count || 0;
      const followingCount = user.following_count || 0;
      const verificationCount = user.verifications?.length || 0;
      
      // 计算综合分数（0-100）
      // 使用对数增长来避免分数过高
      const engagementScore = Math.min(60, Math.log10(followerCount + 1) * 20);
      const activityScore = Math.min(30, Math.log10(followingCount + 1) * 10);
      const verificationScore = Math.min(10, verificationCount * 5);
      
      score = Math.round(engagementScore + activityScore + verificationScore);
      score = Math.min(100, Math.max(0, score)); // 确保在 0-100 范围内
    }
    
    // 确保分数在0-100范围内，并四舍五入到整数
    score = Math.round(Math.min(100, Math.max(0, score)));
    
    // 调试日志：输出分数值
    console.log('Calculated score:', score, 'Type:', typeof score);

    // 获取关注者列表
    const userFid = user.fid;
    const followers = await fetchNeynarFollowers(userFid);

    // 获取用户信息
    const username = user.username || '';
    const avatarUrl = user.pfp_url || user.pfp?.url || user.avatar_url || '';
    const displayName = user.display_name || user.displayName || username;
    const followerCount = user.follower_count || 0;
    const followingCount = user.following_count || 0;

    return res.status(200).json({
      score,
      followers,
      username,
      fid: userFid,
      avatarUrl,
      displayName,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error('Error fetching score:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch score',
    });
  }
}
