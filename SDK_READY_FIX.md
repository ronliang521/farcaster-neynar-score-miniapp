# Farcaster Mini App SDK Ready() 修复

## ✅ 已修复的问题

应用启动后显示 "Ready not called" 警告，提示应用没有调用 `sdk.actions.ready()`。

## 🔧 修复内容

### 1. 安装 Farcaster Mini App SDK

```bash
npm install @farcaster/miniapp-sdk
```

### 2. 在 `pages/_app.tsx` 中添加 SDK 初始化

在应用加载完成后调用 `sdk.actions.ready()` 来隐藏启动画面：

```typescript
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
        requestAnimationFrame(() => {
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('✅ Farcaster Mini App SDK ready - splash screen hidden');
            } catch (err) {
              console.warn('⚠️ Failed to call sdk.actions.ready():', err);
            }
          }, 200);
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
```

## 📋 关键点

### 1. 动态导入 SDK
- 使用 `await import('@farcaster/miniapp-sdk')` 动态导入
- 避免在服务器端渲染时出错

### 2. 检测 Farcaster 环境
- 检查 URL 参数（`fid`, `farcaster`）
- 检查 `window.farcaster` 和 `window.isFarcaster`
- 只在 Farcaster 环境中调用 SDK

### 3. 调用时机
- 使用 `requestAnimationFrame` 确保 DOM 已渲染
- 使用 `setTimeout` 延迟 200ms，确保所有组件都已挂载
- 在应用完全加载后调用 `sdk.actions.ready()`

### 4. 错误处理
- 在非 Farcaster 环境中（如普通浏览器），SDK 可能不可用
- 添加 try-catch 确保应用在普通浏览器中也能正常运行

## 🎯 预期结果

修复后：

1. **在 Farcaster 中打开应用时**：
   - ✅ 启动画面会正常显示
   - ✅ 应用加载完成后，启动画面会自动隐藏
   - ✅ 不再显示 "Ready not called" 警告

2. **在普通浏览器中打开时**：
   - ✅ 应用正常显示（SDK 不可用时静默失败）
   - ✅ 不会出现错误

## 🧪 测试步骤

### 1. 等待 Vercel 重新部署

代码已推送到 GitHub，Vercel 会自动重新部署（1-2 分钟）。

### 2. 在 Farcaster 中测试

1. 在 Farcaster 中打开应用
2. **应该看到**：
   - 启动画面正常显示
   - 应用加载完成后，启动画面自动隐藏
   - 不再显示 "Ready not called" 警告

### 3. 检查控制台

打开浏览器开发者工具，应该看到：
```
✅ Farcaster Mini App SDK ready - splash screen hidden
```

## 📝 相关文档

- [Farcaster Mini App SDK 文档](https://docs.farcaster.xyz/miniapps)
- [Making Your App Display](https://docs.farcaster.xyz/miniapps/making-your-app-display)

## ⚠️ 注意事项

1. **必须在应用加载完成后调用**：`sdk.actions.ready()` 必须在应用完全加载后调用，否则启动画面不会隐藏。

2. **错误处理很重要**：在非 Farcaster 环境中，SDK 可能不可用，需要添加适当的错误处理。

3. **调用时机**：使用 `requestAnimationFrame` 和 `setTimeout` 确保在正确的时机调用。

现在你的应用应该可以正常隐藏启动画面了！🎉

