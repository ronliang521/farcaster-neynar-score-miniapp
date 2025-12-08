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
  const [checkLoading, setCheckLoading] = useState(false);
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

  // 统一设计系统 - 暖色调
  const designSystem = {
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      xxl: '24px'
    },
    borderRadius: {
      sm: '10px',
      md: '14px',
      lg: '18px'
    },
    button: {
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      borderRadius: '14px',
      minWidth: '150px'
    },
    card: {
      padding: '20px',
      borderRadius: '16px',
      marginBottom: '16px'
    },
    colors: {
      primary: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)',
      primaryHover: 'linear-gradient(135deg, #ff5252 0%, #ff7043 50%, #ff9800 100%)',
      secondary: 'linear-gradient(135deg, #ff9800 0%, #ff6b35 100%)',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 25%, #ff8a80 50%, #ffab40 75%, #ffcc02 100%)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      cardBgHover: 'rgba(255, 255, 255, 0.25)',
      text: '#fff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(255, 255, 255, 0.3)',
      borderHover: 'rgba(255, 255, 255, 0.5)',
      shadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
      shadowHover: '0 12px 40px rgba(255, 107, 107, 0.4)'
    }
  };

  const handleCheckScore = async () => {
    if (!input.trim()) {
      setError('Please enter FID or username');
      return;
    }
    // Use separate loading state for check to avoid conflicts with Myself panel
    setCheckLoading(true);
    setError(null);
    // Only clear Check panel states, never touch Myself panel states
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
        // Only update Check panel states, never update Myself panel states
        setScore(data.score ?? null);
        setFollowers(data.followers ?? []);
        setUsername(data.username ?? null);
        setFid(data.fid ?? null);
        setAvatarUrl(data.avatarUrl ?? null);
        setDisplayName(data.displayName ?? null);
        setFollowerCount(data.followerCount ?? null);
        setFollowingCount(data.followingCount ?? null);
        // Explicitly ensure Myself panel states are not affected
        // Do not update myScore, myAvatarUrl, myDisplayName, myUsername, etc.
      }
    } catch (err) {
      console.error(err);
      setError('Request failed, please try again later');
    } finally {
      setCheckLoading(false);
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
      padding: '0',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      height: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255, 200, 150, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          position: 'relative', 
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '12px 12px 35px 12px',
          minHeight: 0
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '12px', flexShrink: 0 }}>
          <h2 style={{
            marginBottom: '6px',
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 0,
            color: '#fff',
            textShadow: '0 2px 10px rgba(255, 107, 107, 0.3)',
            lineHeight: '1.2'
          }}>
            Neynar Score
          </h2>
          <p style={{
            marginBottom: '8px',
            textAlign: 'center',
            opacity: 0.9,
            fontSize: '13px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.4'
          }}>
            Check your Farcaster reputation score powered by Neynar
          </p>
          <a
            href="https://neynar.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
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

        <div style={{ marginBottom: '12px', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Enter FID (e.g.: 12345) or username (e.g.: @username)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !checkLoading) {
                handleCheckScore();
              }
            }}
            disabled={checkLoading}
            style={{
              padding: '8px 12px',
              width: '100%',
              borderRadius: designSystem.borderRadius.md,
              border: '2px solid ' + designSystem.colors.border,
              backgroundColor: designSystem.colors.cardBg,
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.4'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = designSystem.colors.borderHover;
              e.target.style.backgroundColor = designSystem.colors.cardBgHover;
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = designSystem.colors.border;
              e.target.style.backgroundColor = designSystem.colors.cardBg;
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }}
          />
          <motion.button
            onClick={handleCheckScore}
            disabled={checkLoading || !input.trim()}
            whileHover={checkLoading || !input.trim() ? {} : { scale: 1.02, y: -2 }}
            whileTap={checkLoading || !input.trim() ? {} : { scale: 0.98 }}
            style={{
              width: '100%',
              padding: '10px 20px',
              borderRadius: designSystem.button.borderRadius,
              border: 'none',
              background: checkLoading ? 'rgba(255, 255, 255, 0.3)' : designSystem.colors.primary,
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: checkLoading || !input.trim() ? 'not-allowed' : 'pointer',
              marginTop: designSystem.spacing.sm,
              boxShadow: checkLoading || !input.trim() ? '0 4px 15px rgba(0, 0, 0, 0.1)' : designSystem.colors.shadow,
              opacity: checkLoading || !input.trim() ? 0.6 : 1,
              transition: 'all 0.3s ease',
              lineHeight: '1.4'
            }}
          >
            {checkLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: '14px' }}
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
                padding: designSystem.spacing.md + ' ' + designSystem.spacing.lg,
                borderRadius: designSystem.borderRadius.md,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                marginBottom: designSystem.spacing.lg,
                color: '#fee2e2',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Only show check result panel in Check tab, not in Myself tab */}
        {activeTab === 'check' && score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: designSystem.colors.cardBg,
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #fff 0%, #ffe0cc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px',
                lineHeight: '1.5'
              }}>
                Neynar Score
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '1.3'
              }}>
                {score !== null ? score > 1 ? (score / 100).toFixed(2) : score.toFixed(2) : '0.00'}
              </div>
            </div>
            {avatarUrl && (
              <div style={{ marginLeft: '16px' }}>
                <img
                  src={avatarUrl}
                  alt={displayName || username || 'User avatar'}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </motion.div>
        )}

        <div style={{ 
          flex: 1, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          {activeTab === 'myself' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: designSystem.colors.cardBg,
                borderRadius: designSystem.borderRadius.md,
                padding: designSystem.card.padding,
                backdropFilter: 'blur(10px)',
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
              }}
            >
              {loading && !myScore && (
                <div style={{ textAlign: 'center', padding: '15px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', fontSize: '20px', marginBottom: '8px' }}
                  >
                    ⏳
                  </motion.span>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px', lineHeight: '1.3' }}>
                    Loading your score...
                  </div>
                </div>
              )}

              {!isConnected && !loading && (
                <div style={{ textAlign: 'center', padding: '12px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔗</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px', lineHeight: '1.3' }}>
                    Not connected to Farcaster
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '12px', lineHeight: '1.4' }}>
                    Please open this page in the Farcaster client
                  </div>
                  <button
                    onClick={connectFarcaster}
                    style={{
                      padding: designSystem.button.padding,
                      background: designSystem.colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: designSystem.button.borderRadius,
                      fontWeight: designSystem.button.fontWeight,
                      fontSize: designSystem.button.fontSize,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: designSystem.colors.shadow,
                      lineHeight: '1.5',
                      minWidth: designSystem.button.minWidth
                    }}
                  >
                    Reconnect
                  </button>
                </div>
              )}

              {isConnected && myScore !== null && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: designSystem.spacing.xs,
                    marginBottom: designSystem.spacing.sm,
                    paddingBottom: designSystem.spacing.xs,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    flexShrink: 0
                  }}>
                    {myAvatarUrl && (
                      <img
                        src={myAvatarUrl}
                        alt={myDisplayName || myUsername || 'User avatar'}
                        style={{
                          width: '40px',
                          height: '40px',
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
                        <div style={{ fontSize: '10px', fontWeight: '600', color: '#fff', marginBottom: '0px', lineHeight: '1.3' }}>
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
                            fontSize: '9px',
                            textDecoration: 'none',
                            lineHeight: '1.3'
                          }}
                        >
                          @{myUsername}
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: designSystem.colors.cardBg,
                    backdropFilter: 'blur(10px)',
                    borderRadius: designSystem.borderRadius.md,
                    padding: designSystem.spacing.md,
                    textAlign: 'center',
                    marginBottom: designSystem.spacing.sm,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: designSystem.colors.shadow,
                    flexShrink: 0
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '1px',
                      lineHeight: '1.3'
                    }}>
                      Neynar Score
                    </div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#fff',
                      lineHeight: '1.1',
                      marginBottom: '1px'
                    }}>
                      {myScore > 1 ? (myScore / 100).toFixed(2) : myScore.toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '8px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '2px 3px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      display: 'inline-block',
                      lineHeight: '1.2'
                    }}>
                      {getScoreRating(myScore)}
                    </div>
                  </div>

                  {(myFollowerCount !== null || myFollowingCount !== null) && (
                    <div style={{
                      display: 'flex',
                      gap: designSystem.spacing.sm,
                      justifyContent: 'center',
                      padding: designSystem.spacing.sm,
                      background: designSystem.colors.cardBg,
                      borderRadius: designSystem.borderRadius.sm,
                      marginBottom: designSystem.spacing.sm,
                      flexShrink: 0
                    }}>
                      {myFollowerCount !== null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
                            {myFollowerCount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '8px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
                            Followers
                          </div>
                        </div>
                      )}
                      {myFollowingCount !== null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
                            {myFollowingCount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '8px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
                            Following
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isConnected && myScore !== null && (
                    <div style={{ marginTop: designSystem.spacing.lg, textAlign: 'center', flexShrink: 0, paddingTop: designSystem.spacing.md }}>
                      <motion.button
                        onClick={handleShare}
                        disabled={isSharing}
                        whileHover={!isSharing ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isSharing ? { scale: 0.98 } : {}}
                        style={{
                          padding: designSystem.button.padding,
                          background: isSharing 
                            ? 'rgba(255, 255, 255, 0.3)' 
                            : designSystem.colors.primary,
                          color: '#fff',
                          border: 'none',
                          borderRadius: designSystem.button.borderRadius,
                          fontWeight: designSystem.button.fontWeight,
                          fontSize: designSystem.button.fontSize,
                          cursor: isSharing ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: isSharing 
                            ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                            : designSystem.colors.shadowHover,
                          opacity: isSharing ? 0.7 : 1,
                          minWidth: designSystem.button.minWidth,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: designSystem.spacing.sm,
                          margin: '0 auto',
                          lineHeight: '1.5',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {isSharing ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              style={{
                                width: '18px',
                                height: '18px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderTopColor: '#fff',
                                borderRadius: '50%',
                                display: 'inline-block'
                              }}
                            />
                            <span>Sharing...</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '16px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}>🚀</span>
                            <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Share to Farcaster</span>
                          </>
                        )}
                      </motion.button>
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
              style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
              }}
            >
              {score !== null ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {username && (
                    <div                     style={{
                      background: designSystem.colors.cardBg,
                      borderRadius: designSystem.borderRadius.sm,
                      padding: designSystem.spacing.md,
                      marginBottom: designSystem.spacing.sm,
                      backdropFilter: 'blur(10px)',
                      flexShrink: 0
                    }}>
                      {displayName && (
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '3px', lineHeight: '1.3' }}>
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
                            fontSize: '12px',
                            textDecoration: 'none',
                            lineHeight: '1.3'
                          }}
                        >
                          @{username}
                        </a>
                      )}
                      {(followerCount !== null || followingCount !== null) && (
                        <div style={{
                          display: 'flex',
                          gap: designSystem.spacing.md,
                          marginTop: designSystem.spacing.md,
                          paddingTop: designSystem.spacing.sm,
                          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {followerCount !== null && (
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
                                {followerCount.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '8px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
                                Followers
                              </div>
                            </div>
                          )}
                          {followingCount !== null && (
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
                                {followingCount.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '8px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.3' }}>
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
                      background: designSystem.colors.cardBg,
                      borderRadius: designSystem.borderRadius.sm,
                      padding: designSystem.spacing.md,
                      backdropFilter: 'blur(10px)',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0,
                      overflow: 'hidden'
                    }}>
                      <h4 style={{ marginTop: 0, marginBottom: '5px', fontSize: '10px', fontWeight: '600', flexShrink: 0, lineHeight: '1.3' }}>
                        👥 Followers ({followers.length})
                      </h4>
                      <div style={{ flex: 1, overflowY: 'hidden', minHeight: 0 }}>
                        {followers.map((f) => (
                          <div
                            key={f.fid}
                            style={{
                              padding: '4px',
                              marginBottom: '3px',
                              backgroundColor: designSystem.colors.cardBg,
                              borderRadius: designSystem.borderRadius.sm,
                              fontSize: '12px',
                              lineHeight: '1.4'
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
                <div style={{ 
                  textAlign: 'center', 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
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
                background: 'transparent',
                padding: '0',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto'
              }}
            >
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: `${designSystem.spacing.md} ${designSystem.spacing.lg}`,
                gap: designSystem.spacing.sm,
                marginTop: '0',
                marginBottom: '0',
                marginLeft: '-10px',
                marginRight: 'auto',
                width: '100%',
                maxWidth: '380px'
              }}>
                {/* 标题和描述区域 */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: designSystem.spacing.xs,
                  textAlign: 'center',
                  paddingTop: '0'
                }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#fff', 
                    lineHeight: '1.2',
                    textShadow: '0 2px 12px rgba(255, 107, 107, 0.4)',
                    letterSpacing: '-0.5px',
                    marginBottom: designSystem.spacing.xs
                  }}>
                    Improve Your Score
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: designSystem.colors.textSecondary,
                    lineHeight: '1.4',
                    maxWidth: '320px',
                    fontWeight: '400',
                    opacity: 0.95,
                    margin: '0 auto',
                    textAlign: 'center'
                  }}>
                    Discover proven strategies to boost your Farcaster reputation and increase your Neynar Score
                  </div>
                </div>

                {/* 主要按钮区域 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: designSystem.spacing.sm,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: designSystem.spacing.lg,
                  paddingTop: designSystem.spacing.md
                }}>
                  <motion.a
                    href="https://startonfarcaster.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: designSystem.spacing.sm,
                      padding: designSystem.button.padding,
                      background: designSystem.colors.primary,
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: designSystem.button.borderRadius,
                      fontWeight: designSystem.button.fontWeight,
                      fontSize: designSystem.button.fontSize,
                      transition: 'all 0.3s ease',
                      boxShadow: designSystem.colors.shadow,
                      lineHeight: '1.5',
                      minWidth: designSystem.button.minWidth,
                      margin: '0 auto',
                      position: 'relative',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>Visit Start on Farcaster</span>
                    <span style={{ fontSize: '16px', opacity: 0.9 }}>→</span>
                  </motion.a>
                </div>

                {/* 分隔线和支持创作者区域 */}
                <div style={{
                  paddingTop: designSystem.spacing.md,
                  flexShrink: 0,
                  textAlign: 'center',
                  position: 'relative',
                  width: '100%',
                  marginTop: designSystem.spacing.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: designSystem.spacing.sm,
                    paddingTop: designSystem.spacing.md,
                    width: '100%'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      color: designSystem.colors.textMuted,
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      Support the Creator
                    </div>
                    <motion.a
                      href="https://warpcast.com/ron521520"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: designSystem.spacing.sm,
                        padding: designSystem.button.padding,
                        background: designSystem.colors.primary,
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: designSystem.button.borderRadius,
                        fontSize: designSystem.button.fontSize,
                        fontWeight: designSystem.button.fontWeight,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid ' + designSystem.colors.borderHover,
                        lineHeight: '1.5',
                        boxShadow: designSystem.colors.shadowHover,
                        position: 'relative',
                        overflow: 'hidden',
                        minWidth: designSystem.button.minWidth,
                        whiteSpace: 'nowrap',
                        margin: '0 auto'
                      }}
                    >
                      <span style={{ 
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        fontWeight: '600'
                      }}>Follow @ron521520</span>
                      <span style={{ 
                        fontSize: '16px',
                        opacity: 0.9
                      }}>→</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tip' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: designSystem.colors.cardBg,
                borderRadius: designSystem.borderRadius.md,
                padding: designSystem.card.padding,
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                overflow: 'hidden'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: designSystem.spacing.xs, flexShrink: 0, lineHeight: '1.3' }}>
                💝 Tip Creator
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.4',
                marginBottom: designSystem.spacing.sm,
                flexShrink: 0
              }}>
                Your support is the greatest encouragement to the creator!
                <br />
                Tip will be sent to @ron521520
              </div>

              {isConnected && !walletAddress && (
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: designSystem.spacing.sm,
                  padding: designSystem.spacing.xs,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: designSystem.borderRadius.sm,
                  textAlign: 'center',
                  flexShrink: 0,
                  lineHeight: '1.3'
                }}>
                  <div style={{ marginBottom: '2px' }}>🔗 Connecting to Farcaster wallet...</div>
                  <div style={{ fontSize: '8px', opacity: 0.8, lineHeight: '1.2' }}>Please wait while we connect your wallet</div>
                </div>
              )}

              {isConnected && walletAddress && (
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: designSystem.spacing.sm,
                  padding: designSystem.spacing.xs,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: designSystem.borderRadius.sm,
                  wordBreak: 'break-all',
                  flexShrink: 0,
                  lineHeight: '1.3'
                }}>
                  ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}

              <div style={{ marginBottom: designSystem.spacing.sm, textAlign: 'left', flexShrink: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: designSystem.spacing.xs,
                  borderRadius: designSystem.borderRadius.sm,
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: designSystem.spacing.xs,
                  lineHeight: '1.4'
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
                  padding: designSystem.spacing.xs,
                  borderRadius: designSystem.borderRadius.sm,
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4'
                }}>
                  <span>Network</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: designSystem.spacing.xs, fontWeight: '600', color: '#fff' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#0052ff'
                    }} />
                    {BASE_NETWORK.name}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: designSystem.spacing.sm, textAlign: 'left', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: designSystem.spacing.xs, marginBottom: designSystem.spacing.xs }}>
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
                        padding: designSystem.spacing.xs + ' ' + designSystem.spacing.sm,
                        borderRadius: designSystem.borderRadius.sm,
                        border: `2px solid ${tipType === amount ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                        background: tipType === amount ? 'rgba(255, 107, 53, 0.3)' : designSystem.colors.cardBg,
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '0',
                        lineHeight: '1.4'
                      }}
                      onMouseEnter={(e) => {
                        if (tipType !== amount) {
                          e.currentTarget.style.background = designSystem.colors.cardBgHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (tipType !== amount) {
                          e.currentTarget.style.background = designSystem.colors.cardBg;
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
                      padding: designSystem.spacing.xs + ' ' + designSystem.spacing.sm,
                      borderRadius: designSystem.borderRadius.sm,
                      border: `2px solid ${tipType === 'custom' ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                      background: tipType === 'custom' ? 'rgba(255, 107, 53, 0.3)' : designSystem.colors.cardBg,
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '0',
                      lineHeight: '1.4'
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
                  <div style={{ display: 'flex', gap: designSystem.spacing.xs, alignItems: 'center', marginTop: designSystem.spacing.xs }}>
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
                        padding: designSystem.spacing.xs,
                        borderRadius: designSystem.borderRadius.sm,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none',
                        lineHeight: '1.4'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', lineHeight: '1.3' }}>
                      {USDC_TOKEN.symbol}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleTip}
                disabled={isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)}
                style={{
                  padding: '12px 20px',
                    background: (tipType === 'custom' && customTipAmount && parseFloat(customTipAmount) > 0) || (tipType !== 'custom' && tipAmount && parseFloat(tipAmount) > 0)
                    ? designSystem.colors.primary
                    : designSystem.colors.cardBg,
                  color: '#fff',
                  border: 'none',
                  borderRadius: designSystem.button.borderRadius,
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)
                    ? '0 4px 15px rgba(0, 0, 0, 0.2)'
                    : designSystem.colors.shadowHover,
                  opacity: isTipping || (tipType === 'custom' ? !customTipAmount || parseFloat(customTipAmount) <= 0 : !tipAmount || parseFloat(tipAmount) <= 0)
                    ? 0.7
                    : 1,
                  minWidth: designSystem.button.minWidth,
                  width: '100%',
                  flexShrink: 0,
                  lineHeight: '1.4',
                  marginTop: designSystem.spacing.xs
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
          padding: '8px 0',
          zIndex: 1000,
          flexShrink: 0
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
            <div style={{ fontSize: '18px' }}>👤</div>
            <div style={{ fontSize: '9px', fontWeight: activeTab === 'myself' ? '600' : '400', lineHeight: '1.3' }}>
              Myself
            </div>
            {activeTab === 'myself' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)',
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
            <div style={{ fontSize: '18px' }}>📊</div>
            <div style={{ fontSize: '9px', fontWeight: activeTab === 'check' ? '600' : '400', lineHeight: '1.3' }}>
              Check
            </div>
            {activeTab === 'check' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)',
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
            <div style={{ fontSize: '18px' }}>📈</div>
            <div style={{ fontSize: '9px', fontWeight: activeTab === 'improve' ? '600' : '400', lineHeight: '1.3' }}>
              Improve
            </div>
            {activeTab === 'improve' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)',
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
            <div style={{ fontSize: '18px' }}>💝</div>
            <div style={{ fontSize: '9px', fontWeight: activeTab === 'tip' ? '600' : '400', lineHeight: '1.3' }}>
              Tip
            </div>
            {activeTab === 'tip' && (
              <div style={{
                width: '24px',
                height: '3px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffa726 100%)',
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


