import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 检测是否在 Farcaster 环境中
    if (typeof window !== 'undefined') {
      // 检查 URL 参数，Farcaster 可能会传递特定参数
      const urlParams = new URLSearchParams(window.location.search);
      const isFarcaster = urlParams.has('fid') || 
                         urlParams.has('farcaster') ||
                         (window as any).farcaster !== undefined;
      
      if (isFarcaster) {
        // 在 Farcaster 环境中，确保应用在应用内打开
        document.documentElement.setAttribute('data-farcaster', 'true');
      }
    }
  }, []);

  return <Component {...pageProps} />;
}

