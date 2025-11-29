import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Follower {
  fid: string;
  username: string;
}

const PAGE_SIZE = 20; // 每页显示的粉丝数量

export default function NeynarScoreMiniAppV4() {
  const [input, setInput] = useState('');
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const handleCheckScore = async () => {
    if (!input) return;
    setLoading(true);
    setError('');
    setScore(null);
    setFollowers([]);
    setPage(1);

    try {
      const res = await fetch(`https://api.farcaster.xyz/v2/users/${input}/followers`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();

      setFollowers(data.followers || []);
      setHasMore((data.followers?.length || 0) > PAGE_SIZE);

      const calculatedScore = Math.min(100, Math.floor((data.followers.length / 1000) * 100));
      setScore(calculatedScore);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    setHasMore((followers.length - page * PAGE_SIZE) > 0);
  };

  const visibleFollowers = followers.slice(0, page * PAGE_SIZE);

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '16px',
      width: '340px',
      borderRadius: '12px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ marginBottom: '12px', textAlign: 'center', color: '#333' }}>
        Neynar Score Checker
      </h2>

      <input
        type="text"
        placeholder="Enter FID or Username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '12px',
          borderRadius: '6px',
          border: '1px solid #bbb',
          fontSize: '14px'
        }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCheckScore}
        style={{
          padding: '10px',
          width: '100%',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Checking...' : 'Check Score'}
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ color: 'red', marginTop: '12px', textAlign: 'center' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {score !== null && !loading && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginTop: '12px', textAlign: 'center', fontSize: '18px' }}
          >
            Score: <strong>{score}</strong>
          </motion.p>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '16px', maxHeight: '200px', overflowY: 'auto' }}>
        {loading && (
          <div>
            <p>Loading followers...</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#ddd',
                    height: '16px',
                    borderRadius: '4px',
                    width: `${60 + i * 10}%`,
                    animation: 'pulse 1.5s infinite'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {!loading && visibleFollowers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h4 style={{ marginBottom: '8px' }}>Followers:</h4>
              <ul style={{ paddingLeft: '16px' }}>
                {visibleFollowers.map((f) => (
                  <motion.li
                    key={f.fid}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ marginBottom: '4px' }}
                  >
                    {f.username} ({f.fid})
                  </motion.li>
                ))}
              </ul>
              {hasMore && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Load More
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
