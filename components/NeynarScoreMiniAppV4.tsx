import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Follower {
  fid: string;
  username: string;
}

export default function NeynarScoreMiniAppV4() {
  const [input, setInput] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('myself');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [myAvatarUrl, setMyAvatarUrl] = useState<string | null>(null);
  const [myDisplayName, setMyDisplayName] = useState<string | null>(null);
  const [myFollowerCount, setMyFollowerCount] = useState<number | null>(null);
  const [myFollowingCount, setMyFollowingCount] = useState<number | null>(null);
  const [myFid, setMyFid] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [tipAmount, setTipAmount] = useState('2');
  const [tipType, setTipType] = useState('2');
  const [customTipAmount, setCustomTipAmount] = useState('');

  const BASE_NETWORK = {
    name: 'Base',
    chainId: '0x2105',
    rpcUrl: 'https://mainnet.base.org'
  };

  const USDC_TOKEN = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC'
  };

  const handleCheckScore = async () => {
    if (!input.trim()) {
      setError('Please enter FID or username');
      return;
    }
    setLoading(true);
    setError(null);
    setScore(null);
    setFollowers([]);
    setUsername(null);
    setFid(null);
    setAvatarUrl(null);
    setDisplayName(null);
    setFollowerCount(null);
    setFollowingCount(null);
    setActiveTab('check');

    try {
      const res = await fetch(`/api/getScore?fid=${encodeURIComponent(input.trim())}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setScore(data.score ?? null);
        setFollowers(data.followers ?? []);
        setUsername(data.username ?? null);
        setFid(data.fid ?? null);
        setAvatarUrl(data.avatarUrl ?? null);
        setDisplayName(data.displayName ?? null);
        setFollowerCount(data.followerCount ?? null);
        setFollowingCount(data.followingCount ?? null);
      }
    } catch (err) {
      console.error(err);
      setError('Request failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const connectFarcasterWallet = async () => {
    try {
      if (window.farcaster) {
        const farcaster = window.farcaster;
        if (farcaster && farcaster.connectWallet) {
          try {
            const wallet = await farcaster.connectWallet();
            if (wallet) {
              console.log('✅ Connected to Farcaster embedded wallet:', wallet);
              setWalletAddress(wallet);
              setIsConnected(true);
              return true;
            }
          } catch (err: any) {
            if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
              console.warn('Extension connection error (ignored):', err.message);
            } else {
              console.warn('Farcaster wallet connection error:', err.message);
            }
          }
        }
      }
      return false;
    } catch (err: any) {
      console.warn('Failed to connect Farcaster wallet:', err);
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      // First try Farcaster embedded wallet
      const farcasterWalletConnected = await connectFarcasterWallet();
      if (farcasterWalletConnected) {
        return;
      }

      if (window.farcaster) {
        try {
          const farcaster = window.farcaster;
          if (farcaster && farcaster.connectWallet) {
            const wallet = await farcaster.connectWallet();
            if (wallet) {
              setWalletAddress(wallet);
              setIsConnected(true);
              return;
            }
          }
        } catch (err: any) {
          if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
            console.warn('Extension connection error (ignored):', err.message);
          } else {
            throw err;
          }
        }
      }

      if (window.ethereum) {
        try {
          const ethereum = window.ethereum;
          if (ethereum && typeof ethereum.request === 'function') {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts && accounts.length > 0) {
              setWalletAddress(accounts[0]);
              setIsConnected(true);
              return;
            }
          }
        } catch (err: any) {
          if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context') || err.code === -32002) {
            console.warn('Extension connection error (ignored):', err.message);
          } else {
            throw err;
          }
        }
      }

      if (window.solana) {
        try {
          const solana = window.solana;
          if (solana && solana.connect) {
            const response = await solana.connect();
            if (response.publicKey) {
              setWalletAddress(response.publicKey.toString());
              setIsConnected(true);
              return;
            }
          }
        } catch (err) {
          console.warn('Solana wallet connection error:', err);
        }
      }

      setError('Wallet not detected, please install MetaMask, Phantom, or open in Farcaster client');
    } catch (err: any) {
      if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
        console.error('Wallet connection error:', err);
        setError('Failed to connect wallet, please try again');
      }
    }
  };

  const switchToBaseNetwork = async () => {
    try {
      if (!window.ethereum) throw new Error('Wallet not detected');
      const ethereum = window.ethereum;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_NETWORK.chainId }]
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_NETWORK.chainId,
            chainName: BASE_NETWORK.name,
            rpcUrls: [BASE_NETWORK.rpcUrl],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            }
          }]
        });
      } else {
        throw err;
      }
    }
  };

  const handleTip = async () => {
    if (!isConnected || !walletAddress) {
      await connectWallet();
      return;
    }

    const amount = tipType === 'custom' ? customTipAmount : tipAmount;
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid tip amount');
      return;
    }

    setIsTipping(true);
    setError(null);

    try {
      if (!window.ethereum) throw new Error('Wallet not detected');
      const ethereum = window.ethereum;

      await switchToBaseNetwork();

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId !== BASE_NETWORK.chainId) {
        throw new Error('Please switch to Base network');
      }

      const recipientAddress = '0x684265505B22F9F975fb4fc54b8DEdCdbe289A5a';
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, USDC_TOKEN.decimals)));
      const recipientAddressPadded = recipientAddress.slice(2).padStart(64, '0');
      const amountPadded = amountInWei.toString(16).padStart(64, '0');

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: USDC_TOKEN.address,
          data: `0xa9059cbb${recipientAddressPadded}${amountPadded}`
        }]
      });

      alert(`Tip successful! Transaction hash: ${txHash}\nThank you for your support!`);
      setIsTipping(false);
    } catch (err: any) {
      console.error('Tip error:', err);
      if (err.code === 4001) {
        setError('User rejected transaction');
      } else if (err.code === -32602) {
        setError('Transaction parameter error');
      } else {
        setError(err.message || 'Tip failed, please try again');
      }
      setIsTipping(false);
    }
  };

  const fetchUserScore = async (fid: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/getScore?fid=${fid}`);
      const data = await res.json();

      if (!data.error) {
        setMyScore(data.score ?? null);
        setMyUsername(data.username ?? null);
        setMyAvatarUrl(data.avatarUrl ?? null);
        setMyDisplayName(data.displayName ?? null);
        setMyFollowerCount(data.followerCount ?? null);
        setMyFollowingCount(data.followingCount ?? null);
      }
    } catch (err) {
      console.error('Failed to fetch user score:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectFarcaster = async () => {
    try {
      setLoading(true);
      try {
        const { sdk } = await Promise.all([
          import('@farcaster/miniapp-sdk'),
          import('@farcaster/miniapp-sdk'),
          import('@farcaster/miniapp-sdk')
        ]).then((modules) => modules[0]);

        const context = await sdk.context;
        if (context && context.user) {
          const user = context.user;
          const fid = user.fid;
          if (fid) {
            console.log('✅ Got user info via SDK:', fid);
            setMyFid(fid);
            setIsConnected(true);
            await fetchUserScore(fid);
            // Auto-connect Farcaster embedded wallet
            setTimeout(() => {
              connectFarcasterWallet().catch(err => {
                console.log('Auto wallet connection skipped:', err);
              });
            }, 1000);
            setLoading(false);
            return;
          }
        }
      } catch (err: any) {
        console.log('ℹ️ SDK context not available, trying alternative methods:', err.message);
      }

      if (window.farcaster) {
        try {
          const farcaster = window.farcaster;
          if (farcaster && farcaster.user) {
            const user = farcaster.user;
            const fid = user.fid || user.fidNumber;
            if (fid) {
              console.log('✅ Got user info via window.farcaster:', fid);
              setMyFid(fid);
              setIsConnected(true);
              await fetchUserScore(fid);
              // Auto-connect Farcaster embedded wallet
              setTimeout(() => {
                connectFarcasterWallet().catch(err => {
                  console.log('Auto wallet connection skipped:', err);
                });
              }, 1000);
              setLoading(false);
              return;
            }
          }
          if (farcaster && farcaster.connectUser) {
            const user = await farcaster.connectUser();
            if (user && user.fid) {
              console.log('✅ Got user info via connectUser:', user.fid);
              setMyFid(user.fid);
              setIsConnected(true);
              await fetchUserScore(user.fid);
              // Auto-connect Farcaster embedded wallet
              setTimeout(() => {
                connectFarcasterWallet().catch(err => {
                  console.log('Auto wallet connection skipped:', err);
                });
              }, 1000);
              setLoading(false);
              return;
            }
          }
        } catch (err: any) {
          if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
            console.warn('Extension connection error (ignored):', err.message);
          } else {
            console.warn('window.farcaster error:', err.message);
          }
        }
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const fidParam = params.get('fid');
        if (fidParam) {
          const fid = parseInt(fidParam, 10);
          if (!isNaN(fid)) {
            console.log('✅ Got FID via URL parameter:', fid);
            setMyFid(fid);
            setIsConnected(true);
            await fetchUserScore(fid);
            setLoading(false);
            return;
          }
        }
      } catch (err: any) {
        console.warn('URL parameter parsing error:', err.message);
      }

      try {
        if (window.localStorage) {
          const storedFid = localStorage.getItem('farcaster_fid');
          if (storedFid) {
            const fid = parseInt(storedFid, 10);
            if (!isNaN(fid)) {
              console.log('✅ Got FID via localStorage:', fid);
              setMyFid(fid);
              setIsConnected(true);
              await fetchUserScore(fid);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err: any) {
        console.warn('LocalStorage error:', err.message);
      }

      console.log('⚠️ Unable to auto-connect Farcaster, please open this app in Farcaster client');
      setLoading(false);
    } catch (err: any) {
      if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
        console.error('Farcaster connection error:', err);
      }
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!isConnected || myScore === null) {
      setError('Please connect Farcaster account first');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const scoreText = myScore > 1 ? (myScore / 100).toFixed(2) : myScore.toFixed(2);
      const appUrl = window.location.origin;
      const displayName = myDisplayName || myUsername || 'User';
      
      // Format share text with app link
      const shareText = `My Neynar Score is ${scoreText}. Check your score! ${appUrl}`;

      // Priority 1: Use Farcaster openCastComposer to open cast page
      if (window.farcaster) {
        const farcaster = window.farcaster;
        
        if (farcaster.openCastComposer) {
          // Open cast composer with pre-filled text and embed URL
          farcaster.openCastComposer({ 
            text: shareText,
            embeds: [{
              url: appUrl
            }]
          });
          setIsSharing(false);
          return;
        }
        
        // Fallback: Try cast or publishCast (but prefer composer)
        if (farcaster.cast) {
          await farcaster.cast({ text: shareText });
          alert('✅ Share successful! Your score has been shared to Farcaster');
          setIsSharing(false);
          return;
        } else if (farcaster.publishCast) {
          await farcaster.publishCast({ text: shareText });
          alert('✅ Share successful! Your score has been shared to Farcaster');
          setIsSharing(false);
          return;
        }
      }

      // Fallback: Use Web Share API or clipboard
      if (typeof navigator !== 'undefined') {
        if (navigator.share) {
          await navigator.share({
            title: `${displayName}'s Neynar Score`,
            text: shareText,
            url: appUrl
          });
          setIsSharing(false);
          return;
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          alert('✅ Share content copied to clipboard! You can paste it in Farcaster to share');
          setIsSharing(false);
          return;
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = shareText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            alert('✅ Share content copied to clipboard! You can paste it in Farcaster to share');
          } catch (err) {
            setError('Unable to copy to clipboard, please copy manually');
          }
          document.body.removeChild(textarea);
          setIsSharing(false);
          return;
        }
      }

      setError('Farcaster SDK not available. Please open this app in Farcaster client.');
      setIsSharing(false);
    } catch (err) {
      console.error('Share error:', err);
      setError('Share failed, please try again later');
      setIsSharing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      connectFarcaster().catch((err) => {
        console.error('Failed to connect Farcaster:', err);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-connect wallet when switching to Tip tab and Farcaster is connected
  useEffect(() => {
    if (activeTab === 'tip' && isConnected && myFid !== null && !walletAddress) {
      // Wait a bit for the tab to render, then auto-connect wallet
      const timer = setTimeout(() => {
        console.log('🔄 Auto-connecting Farcaster wallet in Tip tab...');
        connectFarcasterWallet().catch((err) => {
          console.log('Auto wallet connection skipped:', err);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isConnected, myFid, walletAddress]);

  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      margin: '0',
      padding: '20px 16px 100px 16px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 0,
            color: '#fff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            Neynar Score
          </h2>
          <p style={{
            marginBottom: '12px',
            textAlign: 'center',
            opacity: 0.9,
            fontSize: '13px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Check your Farcaster reputation score powered by Neynar
          </p>
          <a
            href="https://neynar.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          >
            Powered by Neynar →
          </a>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter FID (e.g.: 12345) or username (e.g.: @username)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleCheckScore();
              }
            }}
            disabled={loading}
            style={{
              padding: '12px 14px',
              width: '100%',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
          />
          <motion.button
            onClick={handleCheckScore}
            disabled={loading || !input.trim()}
            whileHover={loading || !input.trim() ? {} : { scale: 1.02, y: -2 }}
            whileTap={loading || !input.trim() ? {} : { scale: 0.98 }}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background: loading ? 'rgba(255, 255, 255, 0.3)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              fontSize: '17px',
              fontWeight: '600',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              marginTop: '14px',
              boxShadow: loading || !input.trim() ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 6px 25px rgba(245, 87, 108, 0.4)',
              opacity: loading || !input.trim() ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: '18px' }}
                >
                  ⏳
                </motion.span>
                Checking...
              </span>
            ) : (
              '🔍 Check Score'
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                marginBottom: '16px',
                color: '#fee2e2',
                fontSize: '14px'
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fff 0%, #ffe0cc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                Neynar Score
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '1'
              }}>
                {score !== null ? score > 1 ? (score / 100).toFixed(2) : score.toFixed(2) : '0.00'}
              </div>
            </div>
            {avatarUrl && (
              <div style={{ marginLeft: '20px' }}>
                <img
                  src={avatarUrl}
                  alt={displayName || username || 'User avatar'}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </motion.div>
        )}

        <div style={{ minHeight: '200px', marginBottom: '80px' }}>
          {activeTab === 'myself' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '28px',
                backdropFilter: 'blur(10px)'
              }}
            >
              {loading && !myScore && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', fontSize: '32px', marginBottom: '16px' }}
                  >
                    ⏳
                  </motion.span>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                    Loading your score...
                  </div>
                </div>
              )}

              {!isConnected && !loading && (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
                    Not connected to Farcaster
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
                    Please open this page in the Farcaster client
                  </div>
                  <button
                    onClick={connectFarcaster}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
                    }}
                  >
                    Reconnect
                  </button>
                </div>
              )}

              {isConnected && myScore !== null && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {myAvatarUrl && (
                      <img
                        src={myAvatarUrl}
                        alt={myDisplayName || myUsername || 'User avatar'}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                          objectFit: 'cover'
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      {myDisplayName && (
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                          {myDisplayName}
                        </div>
                      )}
                      {myUsername && (
                        <a
                          href={`https://warpcast.com/${myUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '13px',
                            textDecoration: 'none'
                          }}
                        >
                          @{myUsername}
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px'
                    }}>
                      Neynar Score
                    </div>
                    <div style={{
                      fontSize: '42px',
                      fontWeight: '700',
                      color: '#fff',
                      lineHeight: '1',
                      marginBottom: '8px'
                    }}>
                      {myScore > 1 ? (myScore / 100).toFixed(2) : myScore.toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      display: 'inline-block'
                    }}>
                      {getScoreRating(myScore)}
                    </div>
                  </div>

                  {(myFollowerCount !== null || myFollowingCount !== null) && (
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'center',
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px'
                    }}>
                      {myFollowerCount !== null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                            {myFollowerCount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '11px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                            Followers
                          </div>
                        </div>
                      )}
                      {myFollowingCount !== null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                            {myFollowingCount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '11px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                            Following
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isConnected && myScore !== null && (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      <button
                        onClick={handleShare}
                        disabled={isSharing}
                        style={{
                          padding: '14px 32px',
                          background: isSharing ? 'rgba(255, 255, 255, 0.3)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: '600',
                          fontSize: '16px',
                          cursor: isSharing ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                          opacity: isSharing ? 0.7 : 1,
                          minWidth: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          margin: '0 auto'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSharing) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSharing) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                          }
                        }}
                      >
                        {isSharing ? (
                          <>
                            <span style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTopColor: '#fff',
                              borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite'
                            }} />
                            Sharing...
                          </>
                        ) : (
                          '📤 Share to Farcaster'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'check' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {score !== null ? (
                <div>
                  {username && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '16px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {displayName && (
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                          {displayName}
                        </div>
                      )}
                      {username && (
                        <a
                          href={`https://warpcast.com/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            textDecoration: 'none'
                          }}
                        >
                          @{username}
                        </a>
                      )}
                      {(followerCount !== null || followingCount !== null) && (
                        <div style={{
                          display: 'flex',
                          gap: '24px',
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {followerCount !== null && (
                            <div>
                              <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                {followerCount.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                                Followers
                              </div>
                            </div>
                          )}
                          {followingCount !== null && (
                            <div>
                              <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                {followingCount.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                                Following
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {followers.length > 0 && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '20px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                        👥 Followers ({followers.length})
                      </h4>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {followers.map((f) => (
                          <div
                            key={f.fid}
                            style={{
                              padding: '10px',
                              marginBottom: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              fontSize: '14px'
                            }}
                          >
                            <a
                              href={`https://warpcast.com/${f.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#fff', textDecoration: 'none' }}
                            >
                              @{f.username}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', padding: '40px 20px' }}>
                  Please check user score first
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'improve' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '28px',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '300px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
                  Improve Score
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  Visit Start on Farcaster to learn more ways to improve your score
                </div>
                <a
                  href="https://startonfarcaster.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 87, 108, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 87, 108, 0.3)';
                  }}
                >
                  Visit Start on Farcaster →
                </a>
              </div>
              <div style={{
                marginTop: 'auto',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <a
                  href="https://warpcast.com/ron521520"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>👤</span>
                  <span>Follow the mini app author @ron521520</span>
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'tip' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '28px',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>
                💝 Tip Creator
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Your support is the greatest encouragement to the creator!
                <br />
                Tip will be sent to @ron521520
              </div>

              {isConnected && !walletAddress && (
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '20px',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '8px' }}>🔗 Connecting to Farcaster wallet...</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Please wait while we connect your wallet</div>
                </div>
              )}

              {isConnected && walletAddress && (
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '20px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  wordBreak: 'break-all'
                }}>
                  ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '8px'
                }}>
                  <span>Payment</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>
                    {tipType === 'custom' ? customTipAmount || '0' : tipAmount} {USDC_TOKEN.symbol}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <span>Network</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#fff' }}>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#0052ff'
                    }} />
                    {BASE_NETWORK.name}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {['2', '4', '6'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setTipType(amount);
                        setTipAmount(amount);
                        setCustomTipAmount('');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `2px solid ${tipType === amount ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                        background: tipType === amount ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '0'
                      }}
                      onMouseEnter={(e) => {
                        if (tipType !== amount) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (tipType !== amount) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      {amount}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTipType('custom');
                      setTipAmount('');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `2px solid ${tipType === 'custom' ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                      background: tipType === 'custom' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '0'
                    }}
                    onMouseEnter={(e) => {
                      if (tipType !== 'custom') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (tipType !== 'custom') {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                  >
                    Custom
                  </button>
                </div>

                {tipType === 'custom' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                    <input
                      type="number"
                      value={customTipAmount}
                      onChange={(e) => {
                        setCustomTipAmount(e.target.value);
                      }}
                      min="0"
                      step="0.01"
                      placeholder="Enter custom amount"
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>
                      {USDC_TOKEN.symbol}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleTip}
                disabled={isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)}
                style={{
                  padding: '14px 32px',
                  background: (tipType === 'custom' && customTipAmount && parseFloat(customTipAmount) > 0) || (tipType !== 'custom' && tipAmount && parseFloat(tipAmount) > 0)
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  opacity: isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)
                    ? 0.7
                    : 1,
                  minWidth: '200px',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  const isValid = tipType === 'custom' ? customTipAmount && parseFloat(customTipAmount) > 0 : tipAmount && parseFloat(tipAmount) > 0;
                  if (!isTipping && isValid) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  const isValid = tipType === 'custom' ? customTipAmount && parseFloat(customTipAmount) > 0 : tipAmount && parseFloat(tipAmount) > 0;
                  if (!isTipping && isValid) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                  }
                }}
              >
                {isTipping ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Processing...
                  </span>
                ) : (
                  `Send ${tipType === 'custom' ? customTipAmount : tipAmount} ${USDC_TOKEN.symbol} 💝`
                )}
              </button>

              <style jsx>{`
                @keyframes spin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </motion.div>
          )}
        </div>

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          zIndex: 1000
        }}>
          <button
            onClick={() => setActiveTab('myself')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'myself' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px' }}>👤</div>
            <div style={{ fontSize: '11px', fontWeight: activeTab === 'myself' ? '600' : '400' }}>
              Myself
            </div>
            {activeTab === 'myself' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '2px',
                marginTop: '2px'
              }} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('check')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'check' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px' }}>📊</div>
            <div style={{ fontSize: '11px', fontWeight: activeTab === 'check' ? '600' : '400' }}>
              Check
            </div>
            {activeTab === 'check' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '2px',
                marginTop: '2px'
              }} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('improve')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'improve' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px' }}>📈</div>
            <div style={{ fontSize: '11px', fontWeight: activeTab === 'improve' ? '600' : '400' }}>
              Improve
            </div>
            {activeTab === 'improve' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '2px',
                marginTop: '2px'
              }} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tip')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'tip' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '24px' }}>💝</div>
            <div style={{ fontSize: '11px', fontWeight: activeTab === 'tip' ? '600' : '400' }}>
              Tip
            </div>
            {activeTab === 'tip' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '2px',
                marginTop: '2px'
              }} />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
