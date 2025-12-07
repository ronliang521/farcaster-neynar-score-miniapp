import { useState, KeyboardEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Follower {
  fid: string;
  username: string;
}

export default function NeynarScoreMiniAppV5() {
  const [fid, setFid] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [userFid, setUserFid] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<'myself' | 'check' | 'improve' | 'tip'>('myself');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tipping, setTipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 打赏接收地址
  const TIP_RECIPIENT_ADDRESS = '0x684265505B22F9F975fb4fc54b8DEdCdbe289A5a';
  const TIP_RECIPIENT_USERNAME = 'ron521520';

  // Base 链配置
  const BASE_CHAIN = {
    id: 'base',
    name: 'Base',
    chainId: '0x2105', // 8453 in decimal
    rpcUrl: 'https://mainnet.base.org',
    isEVM: true,
  };

  // USDC 代币配置（Base 链）
  const USDC_TOKEN = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
  };

  // 打赏数量选项
  const TIP_AMOUNT_OPTIONS = ['2', '4', '6', 'custom'] as const;
  
  // 打赏选择状态（默认数量 2）
  const [tipAmount, setTipAmount] = useState('2');
  const [selectedAmountOption, setSelectedAmountOption] = useState<'2' | '4' | '6' | 'custom'>('2');
  const [customAmount, setCustomAmount] = useState('');
  
  // 当前登录用户的状态
  const [currentUserFid, setCurrentUserFid] = useState<number | null>(null);
  const [currentUserScore, setCurrentUserScore] = useState<number | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(null);
  const [currentFollowerCount, setCurrentFollowerCount] = useState<number | null>(null);
  const [currentFollowingCount, setCurrentFollowingCount] = useState<number | null>(null);
  const [farcasterConnected, setFarcasterConnected] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleCheckScore = async () => {
    if (!fid.trim()) {
      setError('请输入 FID 或用户名');
      return;
    }
    setLoading(true);
    setError(null);
    setScore(null);
    setFollowers([]);
    setUsername(null);
    setUserFid(null);
    setAvatarUrl(null);
    setDisplayName(null);
    setFollowerCount(null);
    setFollowingCount(null);
    setShowTooltip(false);
    setActiveTab('check');

    try {
      const res = await fetch(`/api/getScore?fid=${encodeURIComponent(fid.trim())}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // 调试日志：输出接收到的分数
        console.log('Received score from API:', data.score, 'Type:', typeof data.score);
        setScore(data.score ?? null);
        setFollowers(data.followers ?? []);
        setUsername(data.username ?? null);
        setUserFid(data.fid ?? null);
        setAvatarUrl(data.avatarUrl ?? null);
        setDisplayName(data.displayName ?? null);
        setFollowerCount(data.followerCount ?? null);
        setFollowingCount(data.followingCount ?? null);
      }
    } catch (err) {
      console.error(err);
      setError('请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleCheckScore();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '待提升';
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (typeof window === 'undefined') return;

      // 检查是否在 Farcaster 环境中
      if ((window as any).farcaster) {
        try {
          const farcaster = (window as any).farcaster;
          if (farcaster && farcaster.connectWallet) {
            const account = await farcaster.connectWallet();
            if (account) {
              setWalletAddress(account);
              setWalletConnected(true);
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

      // 如果不在 Farcaster 环境，尝试使用通用的 Web3 钱包
      if ((window as any).ethereum) {
        try {
          const ethereum = (window as any).ethereum;
          if (ethereum && typeof ethereum.request === 'function') {
            const accounts = await ethereum.request({
              method: 'eth_requestAccounts',
            });
            if (accounts && accounts.length > 0) {
              setWalletAddress(accounts[0]);
              setWalletConnected(true);
              return;
            }
          }
        } catch (err: any) {
          if (
            err?.message?.includes('disconnected port') ||
            err?.message?.includes('Extension context') ||
            err?.code === -32002
          ) {
            console.warn('Extension connection error (ignored):', err.message);
          } else {
            throw err;
          }
        }
      }

      // 尝试连接 Solana 钱包
      if ((window as any).solana) {
        try {
          const solana = (window as any).solana;
          if (solana && solana.connect) {
            const response = await solana.connect();
            if (response.publicKey) {
              setWalletAddress(response.publicKey.toString());
              setWalletConnected(true);
              return;
            }
          }
        } catch (err: any) {
          console.warn('Solana wallet connection error:', err);
        }
      }

      setError('未检测到钱包，请安装 MetaMask、Phantom 或在 Farcaster 客户端中打开');
    } catch (err: any) {
      if (
        !err?.message?.includes('disconnected port') &&
        !err?.message?.includes('Extension context')
      ) {
        console.error('Wallet connection error:', err);
        setError('连接钱包失败，请重试');
      }
    }
  };


  // 切换到 Base 链
  const switchToBase = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('未检测到钱包');
      }

      const ethereum = (window as any).ethereum;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN.chainId }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        // 链不存在，尝试添加链
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_CHAIN.chainId,
            chainName: BASE_CHAIN.name,
            rpcUrls: [BASE_CHAIN.rpcUrl],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
          }],
        });
      } else {
        throw err;
      }
    }
  };

  // 发送打赏
  const handleTip = async () => {
    if (!walletConnected || !walletAddress) {
      await connectWallet();
      return;
    }

    // 确定打赏数量
    const finalAmount = selectedAmountOption === 'custom' ? customAmount : tipAmount;
    
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      setError('请输入有效的打赏金额');
      return;
    }

    setTipping(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('未检测到钱包');
      }

      const ethereum = (window as any).ethereum;
      
      // 切换到 Base 链
      await switchToBase();

      // 检查当前链
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== BASE_CHAIN.chainId) {
        throw new Error('请切换到 Base 网络');
      }

      // USDC 代币转账
      const transferFunctionSignature = '0xa9059cbb';
      const recipientAddress = TIP_RECIPIENT_ADDRESS.slice(2).padStart(64, '0');
      const amountWei = BigInt(Math.floor(parseFloat(finalAmount) * Math.pow(10, USDC_TOKEN.decimals)));
      const amountHex = amountWei.toString(16).padStart(64, '0');
      const data = transferFunctionSignature + recipientAddress + amountHex;

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: walletAddress,
            to: USDC_TOKEN.address,
            data: '0x' + data,
          },
        ],
      });

      alert(`打赏成功！交易哈希: ${txHash}\n感谢您的支持！`);
      setTipping(false);
    } catch (err: any) {
      console.error('Tip error:', err);
      if (err.code === 4001) {
        setError('用户拒绝了交易');
      } else if (err.code === -32602) {
        setError('交易参数错误');
      } else {
        setError(err.message || '打赏失败，请重试');
      }
      setTipping(false);
    }
  };

  // 获取用户积分
  const fetchUserScore = async (fid: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/getScore?fid=${fid}`);
      const data = await res.json();

      if (!data.error) {
        setCurrentUserScore(data.score ?? null);
        setCurrentUsername(data.username ?? null);
        setCurrentAvatarUrl(data.avatarUrl ?? null);
        setCurrentDisplayName(data.displayName ?? null);
        setCurrentFollowerCount(data.followerCount ?? null);
        setCurrentFollowingCount(data.followingCount ?? null);
      }
    } catch (err) {
      console.error('Failed to fetch user score:', err);
    } finally {
      setLoading(false);
    }
  };

  // 自动连接 Farcaster 并获取当前用户信息
  const connectFarcaster = async () => {
    try {
      if (typeof window === 'undefined') return;

      setLoading(true);

      // 方法1: 使用 Farcaster Mini App SDK (推荐方法)
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        // 获取当前上下文（包含用户信息）
        const context = await sdk.context;
        
        if (context && context.user) {
          const user = context.user;
          const userFid = user.fid;
          
          if (userFid) {
            console.log('✅ 通过 SDK 获取到用户信息:', userFid);
            setCurrentUserFid(userFid);
            setFarcasterConnected(true);
            
            // 保存用户信息到 state（如果有）
            // 注意：SDK 的 UserContext 可能不包含所有字段，我们通过 API 获取完整信息
            // 这里只保存 FID，完整信息通过 fetchUserScore 获取
            
            // 获取用户积分
            await fetchUserScore(userFid);
            setLoading(false);
            return;
          }
        }
      } catch (sdkErr: any) {
        // SDK 可能不可用（例如在普通浏览器中）
        console.log('ℹ️ SDK context not available, trying alternative methods:', sdkErr.message);
      }

      // 方法2: 检查 window.farcaster (旧版 SDK 或扩展)
      if ((window as any).farcaster) {
        try {
          const farcaster = (window as any).farcaster;
          if (farcaster && farcaster.user) {
            const user = farcaster.user;
            const userFid = user.fid || user.fidNumber;
            if (userFid) {
              console.log('✅ 通过 window.farcaster 获取到用户信息:', userFid);
              setCurrentUserFid(userFid);
              setFarcasterConnected(true);
              await fetchUserScore(userFid);
              setLoading(false);
              return;
            }
          }
          if (farcaster && farcaster.connectUser) {
            const user = await farcaster.connectUser();
            if (user && user.fid) {
              console.log('✅ 通过 connectUser 获取到用户信息:', user.fid);
              setCurrentUserFid(user.fid);
              setFarcasterConnected(true);
              await fetchUserScore(user.fid);
              setLoading(false);
              return;
            }
          }
        } catch (err: any) {
          // 忽略扩展相关的错误
          if (err?.message?.includes('disconnected port') || err?.message?.includes('Extension context')) {
            console.warn('Extension connection error (ignored):', err.message);
          } else {
            console.warn('window.farcaster error:', err.message);
          }
        }
      }

      // 方法3: 从 URL 参数获取（Farcaster mini app 通常会传递用户信息）
      try {
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const fidParam = urlParams.get('fid');
          if (fidParam) {
            const fidNumber = parseInt(fidParam, 10);
            if (!isNaN(fidNumber)) {
              console.log('✅ 通过 URL 参数获取到 FID:', fidNumber);
              setCurrentUserFid(fidNumber);
              setFarcasterConnected(true);
              await fetchUserScore(fidNumber);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err: any) {
        console.warn('URL parameter parsing error:', err.message);
      }

      // 方法4: 从 localStorage 获取（如果之前保存过）
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedFid = localStorage.getItem('farcaster_fid');
          if (savedFid) {
            const fidNumber = parseInt(savedFid, 10);
            if (!isNaN(fidNumber)) {
              console.log('✅ 通过 localStorage 获取到 FID:', fidNumber);
              setCurrentUserFid(fidNumber);
              setFarcasterConnected(true);
              await fetchUserScore(fidNumber);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err: any) {
        console.warn('LocalStorage error:', err.message);
      }

      // 如果无法自动连接
      console.log('⚠️ 无法自动连接 Farcaster，请在 Farcaster 客户端中打开此应用');
      setLoading(false);
    } catch (err: any) {
      // 只记录非扩展相关的错误
      if (
        !err?.message?.includes('disconnected port') &&
        !err?.message?.includes('Extension context')
      ) {
        console.error('Farcaster connection error:', err);
      }
      setLoading(false);
    }
  };

  // 分享到 Farcaster
  const handleShare = async () => {
    if (!farcasterConnected || currentUserScore === null) {
      setError('请先连接 Farcaster 账户');
      return;
    }

    setSharing(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !(window as any).farcaster) {
        throw new Error('Farcaster SDK 不可用');
      }

      const farcaster = (window as any).farcaster;
      
      // 格式化积分显示
      const scoreDisplay = currentUserScore > 1 
        ? (currentUserScore / 100).toFixed(2) 
        : currentUserScore.toFixed(2);
      
      // 构建分享内容
      const shareText = `🎯 我的 Neynar Score: ${scoreDisplay}\n\n` +
        `快来测试你的 Farcaster 积分吧！\n` +
        `🔗 点击链接查看你的分数：\n` +
        `${typeof window !== 'undefined' ? window.location.origin : 'https://neynar.com/score'}`;

      // 尝试使用 Farcaster SDK 的 cast 方法
      if (farcaster.cast) {
        await farcaster.cast({
          text: shareText,
        });
        alert('✅ 分享成功！你的积分已分享到 Farcaster');
      } else if (farcaster.publishCast) {
        await farcaster.publishCast({
          text: shareText,
        });
        alert('✅ 分享成功！你的积分已分享到 Farcaster');
      } else if (farcaster.openCastComposer) {
        // 如果 SDK 支持打开 Cast 编辑器
        farcaster.openCastComposer({
          text: shareText,
        });
      } else {
        // 降级方案：使用 Web Share API 或复制到剪贴板
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          if (navigator.share) {
            await navigator.share({
              title: '我的 Neynar Score',
              text: shareText,
              url: window.location.href,
            });
          } else if (navigator.clipboard) {
            // 复制到剪贴板
            await navigator.clipboard.writeText(shareText);
            alert('✅ 分享内容已复制到剪贴板！你可以粘贴到 Farcaster 中分享');
          } else {
            // 最后的降级方案：使用旧的剪贴板 API
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              alert('✅ 分享内容已复制到剪贴板！你可以粘贴到 Farcaster 中分享');
            } catch (err) {
              setError('无法复制到剪贴板，请手动复制');
            }
            document.body.removeChild(textArea);
          }
        } else {
          setError('浏览器环境不可用');
        }
      }

      setSharing(false);
    } catch (err: any) {
      console.error('Share error:', err);
      
      // 如果分享失败，尝试降级方案
      try {
        const scoreDisplay = currentUserScore > 1 
          ? (currentUserScore / 100).toFixed(2) 
          : currentUserScore.toFixed(2);
        
        const shareText = `🎯 我的 Neynar Score: ${scoreDisplay}\n\n` +
          `快来测试你的 Farcaster 积分吧！\n` +
          `🔗 点击链接查看你的分数：\n` +
          `${typeof window !== 'undefined' ? window.location.origin : 'https://neynar.com/score'}`;

        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            alert('✅ 分享内容已复制到剪贴板！你可以粘贴到 Farcaster 中分享');
          } else {
            // 使用旧的剪贴板 API
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              alert('✅ 分享内容已复制到剪贴板！你可以粘贴到 Farcaster 中分享');
            } catch (err) {
              setError('无法复制到剪贴板，请手动复制');
            }
            document.body.removeChild(textArea);
          }
        } else {
          setError('分享失败，请稍后重试');
        }
      } catch (fallbackErr) {
        setError('分享失败，请稍后重试');
      }
      
      setSharing(false);
    }
  };

  // 组件加载时自动连接 Farcaster
  useEffect(() => {
    // 延迟一点时间，确保 SDK 已初始化（等待 _app.tsx 中的 SDK ready() 调用完成）
    const timer = setTimeout(() => {
      connectFarcaster().catch((err) => {
        console.error('Failed to connect Farcaster:', err);
        // 不阻止应用继续运行
      });
    }, 500); // 等待 SDK ready() 调用完成后再连接

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h2
            style={{
              marginBottom: '10px',
              fontSize: '36px',
              fontWeight: '700',
              textAlign: 'center',
              marginTop: 0,
              background: 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Neynar Score
          </h2>
          <p
            style={{
              marginBottom: '28px',
              textAlign: 'center',
              opacity: 0.95,
              fontSize: '15px',
              fontWeight: '400',
            }}
          >
            Check your Farcaster reputation score powered by Neynar
          </p>
          <a
            href="https://neynar.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '12px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '8px',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
          >
            Powered by Neynar →
          </a>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="输入 FID (如: 12345) 或用户名 (如: @username)"
            value={fid}
            onChange={(e) => setFid(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              padding: '16px 18px',
              width: '100%',
              borderRadius: '14px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
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
            disabled={loading || !fid.trim()}
            whileHover={loading || !fid.trim() ? {} : { scale: 1.02, y: -2 }}
            whileTap={loading || !fid.trim() ? {} : { scale: 0.98 }}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background: loading
                ? 'rgba(255, 255, 255, 0.3)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              fontSize: '17px',
              fontWeight: '600',
              cursor: loading || !fid.trim() ? 'not-allowed' : 'pointer',
              marginTop: '14px',
              boxShadow: loading || !fid.trim()
                ? '0 4px 15px rgba(0, 0, 0, 0.1)'
                : '0 6px 25px rgba(245, 87, 108, 0.4)',
              opacity: loading || !fid.trim() ? 0.6 : 1,
              transition: 'all 0.3s ease',
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
                查询中...
              </span>
            ) : (
              '🔍 查询分数'
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
                fontSize: '14px',
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 主要面板 - 显示用户信息和分数 */}
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #fff 0%, #ffe0cc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '12px',
                }}
              >
                Neynar Score
              </div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  color: '#fff',
                  lineHeight: '1',
                }}
              >
                {score !== null ? (score > 1 ? (score / 100).toFixed(2) : score.toFixed(2)) : '0.00'}
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
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* 内容区域 - 根据选中的标签显示不同内容 */}
        <div style={{ minHeight: '200px', marginBottom: '80px' }}>
            {/* Myself Score 页面 */}
            {activeTab === 'myself' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '28px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {loading && !currentUserScore && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', fontSize: '32px', marginBottom: '16px' }}
                    >
                      ⏳
                    </motion.span>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                      正在加载您的积分...
                    </div>
                  </div>
                )}
                
                {!farcasterConnected && !loading && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
                      未连接 Farcaster
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
                      请在 Farcaster 客户端中打开此页面
                    </div>
                    <button
                      onClick={connectFarcaster}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      重新连接
                    </button>
                  </div>
                )}

                {farcasterConnected && currentUserScore !== null && (
                  <div>
                    {/* 用户头像和基本信息 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '24px',
                        paddingBottom: '24px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {currentAvatarUrl && (
                        <img
                          src={currentAvatarUrl}
                          alt={currentDisplayName || currentUsername || 'User avatar'}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        {currentDisplayName && (
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '600',
                              color: '#fff',
                              marginBottom: '8px',
                            }}
                          >
                            {currentDisplayName}
                          </div>
                        )}
                        {currentUsername && (
                          <a
                            href={`https://warpcast.com/${currentUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '16px',
                              textDecoration: 'none',
                            }}
                          >
                            @{currentUsername}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* 积分显示 */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #764ba2 100%)',
                        borderRadius: '20px',
                        padding: '32px',
                        textAlign: 'center',
                        marginBottom: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.9)',
                          marginBottom: '12px',
                        }}
                      >
                        Neynar Score
                      </div>
                      <div
                        style={{
                          fontSize: '64px',
                          fontWeight: '700',
                          color: '#fff',
                          lineHeight: '1',
                          marginBottom: '12px',
                        }}
                      >
                        {currentUserScore > 1 ? (currentUserScore / 100).toFixed(2) : currentUserScore.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '20px',
                          display: 'inline-block',
                        }}
                      >
                        {getScoreLabel(currentUserScore)}
                      </div>
                    </div>

                    {/* 关注数据 */}
                    {(currentFollowerCount !== null || currentFollowingCount !== null) && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '24px',
                          justifyContent: 'center',
                          padding: '20px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                        }}
                      >
                        {currentFollowerCount !== null && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                              {currentFollowerCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                              关注者
                            </div>
                          </div>
                        )}
                        {currentFollowingCount !== null && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                              {currentFollowingCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                              正在关注
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Share 按钮 */}
                    {farcasterConnected && currentUserScore !== null && (
                      <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <button
                          onClick={handleShare}
                          disabled={sharing}
                          style={{
                            padding: '14px 32px',
                            background: sharing
                              ? 'rgba(255, 255, 255, 0.3)'
                              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: sharing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            opacity: sharing ? 0.7 : 1,
                            minWidth: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            margin: '0 auto',
                          }}
                          onMouseEnter={(e) => {
                            if (!sharing) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!sharing) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                            }
                          }}
                        >
                          {sharing ? (
                            <>
                              <span
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                  borderTopColor: '#fff',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }}
                              />
                              分享中...
                            </>
                          ) : (
                            <>
                              📤 分享到 Farcaster
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Check 页面 (原来的 score 页面) */}
            {activeTab === 'check' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {score !== null ? (
                  <div>
                    {/* 用户详细信息 */}
                    {username && (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          padding: '20px',
                          marginBottom: '16px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {displayName && (
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '600',
                              color: '#fff',
                              marginBottom: '8px',
                            }}
                          >
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
                              textDecoration: 'none',
                            }}
                          >
                            @{username}
                          </a>
                        )}
                        {(followerCount !== null || followingCount !== null) && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '24px',
                              marginTop: '16px',
                              paddingTop: '16px',
                              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            {followerCount !== null && (
                              <div>
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                  {followerCount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                                  关注者
                                </div>
                              </div>
                            )}
                            {followingCount !== null && (
                              <div>
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                  {followingCount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8, color: 'rgba(255, 255, 255, 0.9)' }}>
                                  正在关注
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* 关注者列表 */}
                    {followers.length > 0 && (
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          padding: '20px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                          👥 关注者 ({followers.length})
                        </h4>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {followers.map((f, index) => (
                            <div
                              key={f.fid}
                              style={{
                                padding: '10px',
                                marginBottom: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                fontSize: '14px',
                              }}
                            >
                              <a
                                href={`https://warpcast.com/${f.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#fff',
                                  textDecoration: 'none',
                                }}
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
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)',
                      padding: '40px 20px',
                    }}
                  >
                    请先查询用户分数
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
                  minHeight: '300px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#fff',
                      marginBottom: '16px',
                    }}
                  >
                    Improve Score
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.6',
                      marginBottom: '24px',
                    }}
                  >
                    访问 Start on Farcaster 了解更多提升分数的方法
                  </div>
                  <a
                    href="https://startonfarcaster.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #764ba2 100%)',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    访问 Start on Farcaster →
                  </a>
                </div>
                
                {/* 关注小程序作者 */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
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
                      border: '1px solid rgba(255, 255, 255, 0.2)',
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
                    <span>关注小程序作者 @ron521520</span>
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
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '16px',
                  }}
                >
                  💝 给创作者打赏
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                  }}
                >
                  您的支持是对创作者最大的鼓励！
                  <br />
                  打赏将发送给 @{TIP_RECIPIENT_USERNAME}
                </div>

                {walletConnected && walletAddress && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '20px',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      wordBreak: 'break-all',
                    }}
                  >
                    已连接: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                )}

                {/* 支付信息 */}
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                    }}
                  >
                    <span>Payment</span>
                    <span style={{ fontWeight: '600', color: '#fff' }}>
                      {selectedAmountOption === 'custom' ? (customAmount || '0') : tipAmount} {USDC_TOKEN.symbol}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <span>Network</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#fff' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#0052ff',
                        }}
                      />
                      {BASE_CHAIN.name}
                    </span>
                  </div>
                </div>

                {/* 数量选择 */}
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {(['2', '4', '6'] as const).map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmountOption(amount);
                          setTipAmount(amount);
                          setCustomAmount('');
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: `2px solid ${selectedAmountOption === amount ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                          background: selectedAmountOption === amount
                            ? 'rgba(255, 107, 53, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minWidth: '0',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAmountOption !== amount) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAmountOption !== amount) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                      >
                        {amount}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedAmountOption('custom');
                        setTipAmount('');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: `2px solid ${selectedAmountOption === 'custom' ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
                        background: selectedAmountOption === 'custom'
                          ? 'rgba(255, 107, 53, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '0',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAmountOption !== 'custom') {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAmountOption !== 'custom') {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                    >
                      自定义
                    </button>
                  </div>
                  
                  {selectedAmountOption === 'custom' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomAmount(value);
                        }}
                        min="0"
                        step="0.01"
                        placeholder="输入自定义数量"
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '600',
                        }}
                      >
                        {USDC_TOKEN.symbol}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleTip}
                  disabled={tipping || (selectedAmountOption === 'custom' ? (!customAmount || parseFloat(customAmount) <= 0) : (!tipAmount || parseFloat(tipAmount) <= 0))}
                  style={{
                    padding: '14px 32px',
                    background: ((selectedAmountOption === 'custom' && customAmount && parseFloat(customAmount) > 0) || (selectedAmountOption !== 'custom' && tipAmount && parseFloat(tipAmount) > 0))
                      ? 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: (tipping || (selectedAmountOption === 'custom' ? (!customAmount || parseFloat(customAmount) <= 0) : (!tipAmount || parseFloat(tipAmount) <= 0))) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    opacity: (tipping || (selectedAmountOption === 'custom' ? (!customAmount || parseFloat(customAmount) <= 0) : (!tipAmount || parseFloat(tipAmount) <= 0))) ? 0.7 : 1,
                    minWidth: '200px',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    const isValid = selectedAmountOption === 'custom' 
                      ? (customAmount && parseFloat(customAmount) > 0)
                      : (tipAmount && parseFloat(tipAmount) > 0);
                    if (!tipping && isValid) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isValid = selectedAmountOption === 'custom' 
                      ? (customAmount && parseFloat(customAmount) > 0)
                      : (tipAmount && parseFloat(tipAmount) > 0);
                    if (!tipping && isValid) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                >
                  {tipping ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      处理中...
                    </span>
                  ) : (
                    `Send ${selectedAmountOption === 'custom' ? customAmount : tipAmount} ${USDC_TOKEN.symbol} 💝`
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

        {/* 底部导航栏 */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '520px',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '12px 0',
            borderRadius: '20px 20px 0 0',
            zIndex: 1000,
          }}
        >
            {/* Myself Score 导航项 */}
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
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '24px' }}>
                👤
              </div>
              <div style={{ fontSize: '11px', fontWeight: activeTab === 'myself' ? '600' : '400' }}>
                Myself
              </div>
              {activeTab === 'myself' && (
                <div
                  style={{
                    width: '24px',
                    height: '3px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)',
                    borderRadius: '2px',
                    marginTop: '2px',
                  }}
                />
              )}
            </button>

            {/* Check 导航项 */}
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
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '24px' }}>
                📊
              </div>
              <div style={{ fontSize: '11px', fontWeight: activeTab === 'check' ? '600' : '400' }}>
                Check
              </div>
              {activeTab === 'check' && (
                <div
                  style={{
                    width: '24px',
                    height: '3px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)',
                    borderRadius: '2px',
                    marginTop: '2px',
                  }}
                />
              )}
            </button>

            {/* Improve 导航项 */}
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
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '24px' }}>
                📈
              </div>
              <div style={{ fontSize: '11px', fontWeight: activeTab === 'improve' ? '600' : '400' }}>
                Improve
              </div>
              {activeTab === 'improve' && (
                <div
                  style={{
                    width: '24px',
                    height: '3px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)',
                    borderRadius: '2px',
                    marginTop: '2px',
                  }}
                />
              )}
            </button>

            {/* Tip 导航项 */}
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
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '24px' }}>
                💝
              </div>
              <div style={{ fontSize: '11px', fontWeight: activeTab === 'tip' ? '600' : '400' }}>
                Tip
              </div>
              {activeTab === 'tip' && (
                <div
                  style={{
                    width: '24px',
                    height: '3px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f5576c 100%)',
                    borderRadius: '2px',
                    marginTop: '2px',
                  }}
                />
              )}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
