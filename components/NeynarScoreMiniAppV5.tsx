import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Follower {
  fid: string;
  username: string;
}

export default function NeynarScoreMiniAppV5() {
  const [fid, setFid] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckScore = async () => {
    if (!fid) return;
    setLoading(true);
    setError(null);
    setScore(null);
    setFollowers([]);

    try {
      const res = await fetch(`/api/getScore?fid=${encodeURIComponent(fid)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setScore(data.score ?? null);
        setFollowers(data.followers ?? []);
      }
    } catch (err) {
      console.error(err);
      setError('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', width: '350px', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '12px' }}>Neynar Score Checker</h2>
      <input
        type="text"
        placeholder="Enter FID or Username"
        value={fid}
        onChange={(e) => setFid(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '12px', borderRadius: '4px', border: '1px solid #999' }}
      />
      <button
        onClick={handleCheckScore}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#4caf50',
          color: '#fff',
          cursor: 'pointer',
          marginBottom: '12px'
        }}
      >
        Check Score
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: '12px' }}
          >
            Loading...
          </motion.div>
        )}
      </AnimatePresence>

      {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}

      {score !== null && (
        <div style={{ marginBottom: '12px' }}>
          <strong>Score:</strong> {score}
        </div>
      )}

      {followers.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <h4>Followers:</h4>
          <ul>
            {followers.map((f) => (
              <li key={f.fid}>
                {f.username} ({f.fid})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
