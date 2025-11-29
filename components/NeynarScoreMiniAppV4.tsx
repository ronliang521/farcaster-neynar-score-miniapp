import { useState } from 'react';

interface Follower {
  fid: string;
  username: string;
}

interface UserData {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  score: number;
  follower_count: number;
}

export default function NeynarScoreMiniAppV4() {
  const [fid, setFid] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckScore = async () => {
    if (!fid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.farcaster.xyz/v1/users/${fid}`);
      const data = await res.json();

      if (data?.author) {
        setScore(data.author.score);
        setFollowersCount(data.author.follower_count);
      } else {
        setScore(null);
        setFollowersCount(null);
        setError('User not found');
      }
    } catch (err) {
      console.error(err);
      setScore(null);
      setFollowersCount(null);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', width: '300px' }}>
      <h2>Neynar Score Checker</h2>
      <input
        type="text"
        placeholder="Enter FID or Username"
        value={fid}
        onChange={(e) => setFid(e.target.value)}
        style={{ width: '100%', marginBottom: '8px', padding: '4px' }}
      />
      <button
        onClick={handleCheckScore}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check Score'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {score !== null && (
        <div>
          <p>
            <strong>Score:</strong> {score}
          </p>
          <p>
            <strong>Followers:</strong> {followersCount}
          </p>
        </div>
      )}
    </div>
  );
}
