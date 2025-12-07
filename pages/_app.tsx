import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 初始化 Farcaster Mini App SDK
    const initFarcasterSDK = async () => {
      if (typeof window === 'undefined') {
        return; // 服务器端渲染时跳过
      }

      try {
        // 动态导入 SDK（仅在浏览器环境中）
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        // 检测是否在 Farcaster 环境中
        const urlParams = new URLSearchParams(window.location.search);
        const isFarcaster = urlParams.has('fid') || 
                           urlParams.has('farcaster') ||
                           (window as any).farcaster !== undefined ||
                           (window as any).isFarcaster === true;
        
        if (isFarcaster) {
          document.documentElement.setAttribute('data-farcaster', 'true');
        }

        // 等待应用完全加载后调用 ready()
        // 使用 requestAnimationFrame 和 setTimeout 确保 DOM 已完全渲染
        requestAnimationFrame(() => {
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('✅ Farcaster Mini App SDK ready - splash screen hidden');
            } catch (err) {
              console.warn('⚠️ Failed to call sdk.actions.ready():', err);
              // 即使失败也继续显示应用（可能在普通浏览器中）
            }
          }, 200); // 稍微延迟以确保所有组件都已挂载
        });
      } catch (err) {
        // 如果 SDK 不可用（例如在普通浏览器中），静默失败
        console.log('ℹ️ Farcaster Mini App SDK not available (running in browser)');
      }
    };

    initFarcasterSDK();
  }, []);

  return <Component {...pageProps} />;
}

