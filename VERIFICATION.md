# Farcaster Mini App 验证清单

## ✅ 已完成的配置

### 1. 生产 URL
- **Vercel URL**: https://farcaster-neynar-score-miniapp.vercel.app
- ✅ 已更新到所有配置文件

### 2. 配置文件

#### `public/.well-known/warpcast.json`
```json
{
  "name": "Neynar Score",
  "description": "Check your Neynar Score and Farcaster reputation...",
  "imageUrl": "https://farcaster-neynar-score-miniapp.vercel.app/icon.png",
  "action": {
    "type": "link",
    "url": "https://farcaster-neynar-score-miniapp.vercel.app"
  }
}
```

#### `pages/index.tsx`
- ✅ Open Graph URL 已更新
- ✅ Twitter Card URL 已更新
- ✅ 添加了图片 meta 标签

### 3. 需要验证的 URL

部署完成后（Vercel 会自动重新部署），验证以下 URL 可访问：

1. **主页**
   - https://farcaster-neynar-score-miniapp.vercel.app/
   - ✅ 应该显示应用界面

2. **Warpcast 配置**
   - https://farcaster-neynar-score-miniapp.vercel.app/.well-known/warpcast.json
   - ✅ 应该返回 JSON 配置

3. **Manifest**
   - https://farcaster-neynar-score-miniapp.vercel.app/manifest.json
   - ✅ 应该返回 PWA manifest

4. **图标**
   - https://farcaster-neynar-score-miniapp.vercel.app/icon.png
   - ✅ 应该显示图标

## 🚀 在 Farcaster 中使用

### 方法 1: 直接在 Warpcast 中分享链接

1. 在 Warpcast 中创建一个 Cast
2. 添加链接：`https://farcaster-neynar-score-miniapp.vercel.app`
3. Warpcast 会自动识别为 mini app
4. 用户点击链接即可在 Farcaster 中打开应用

### 方法 2: 通过 Farcaster 开发者门户

1. 访问 Farcaster 开发者文档
2. 提交应用信息
3. 等待审核通过

## 📱 测试步骤

1. **在浏览器中测试**
   - 打开 https://farcaster-neynar-score-miniapp.vercel.app
   - 验证所有功能正常

2. **在 Warpcast 中测试**
   - 在 Warpcast 中分享应用链接
   - 点击链接，验证应用在 Farcaster 中打开
   - 测试自动连接 Farcaster 功能
   - 测试查看积分功能
   - 测试分享功能
   - 测试打赏功能

3. **验证配置**
   ```bash
   # 验证 warpcast.json
   curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/warpcast.json
   
   # 验证 manifest.json
   curl https://farcaster-neynar-score-miniapp.vercel.app/manifest.json
   ```

## ⚠️ 注意事项

1. **等待 Vercel 重新部署**
   - 代码已推送到 GitHub
   - Vercel 会自动检测并重新部署
   - 通常需要 1-2 分钟

2. **清除缓存**
   - 如果配置不生效，清除浏览器缓存
   - 或在 Vercel 中手动触发重新部署

3. **HTTPS**
   - ✅ Vercel 自动提供 HTTPS
   - ✅ 符合 Farcaster 要求

4. **CORS**
   - ✅ 已在 next.config.js 中配置
   - ✅ 允许 Farcaster 访问配置文件

## 🎉 完成！

你的应用现在已经配置为 Farcaster mini app！

**应用链接**: https://farcaster-neynar-score-miniapp.vercel.app

在 Warpcast 中分享这个链接，用户就可以在 Farcaster 中直接使用你的应用了！

