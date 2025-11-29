import { useState } from 'react';

interface Follower {
  fid: string;
  username: string;
}

export default function NeynarScoreMiniAppV4() {
  const [input, setInput] = useState('');
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckScore = async () => {
    if (!input) return;
    setLoading(true);
    setError('');
    setScore(null);
    setFollowers([]);

    try {
      // 替换为真实 Farcaster API 请求
      const res = await fetch(`https://api.farcaster.xyz/v2/users/${input}/followers`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();

      setFollowers(data.followers || []);

      // 简单逻辑计算 Score，例如粉丝数量百分比
      const calculatedScore = Math.min(100, Math.floor((data.followers.length / 1000) * 100));
      setScore(calculatedScore);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', width: '320px', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '12px' }}>Neynar Score Checker</h2>
      <input
        type="text"
        placeholder="Enter FID or Username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '8px', borderRadius: '4px', border: '1px solid #aaa' }}
      />
      <button
        onClick={handleCheckScore}
        style={{
          padding: '8px 12px',
          width: '100%',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Checking...' : 'Check Score'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

      {score !== null && !loading && (
        <p style={{ marginTop: '8px' }}>Score: <strong>{score}</strong></p>
      )}

      {followers.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <h4>Followers:</h4>
          <ul>
            {followers.map((f) => (
              <li key={f.fid}>{f.username} ({f.fid})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
