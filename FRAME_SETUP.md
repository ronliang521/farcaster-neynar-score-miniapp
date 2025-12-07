# Farcaster Frame 配置说明

## ✅ 已添加的 Frame Meta 标签

根据 Farcaster Frame 规范，我已经在 `pages/index.tsx` 中添加了以下必需的 meta 标签：

```tsx
{/* Farcaster Frame Meta Tags - Required for Frame recognition */}
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
<meta property="fc:frame:image:aspect_ratio" content="1:1" />

{/* Open Graph - Required for Frame */}
<meta property="og:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="1200" />
```

## 📋 Frame Meta 标签说明

### 必需的标签：

1. **`fc:frame`** - Frame 版本
   - 值：`vNext`（当前 Frame 规范版本）

2. **`fc:frame:image`** - Frame 显示的图片
   - 值：你的应用图标 URL
   - 这是用户在 Cast 中看到的 Frame 卡片图片

3. **`og:image`** - Open Graph 图片
   - 值：与 `fc:frame:image` 相同
   - 用于社交媒体分享预览

### 可选的标签：

- **`fc:frame:image:aspect_ratio`** - 图片宽高比（1:1 或 1.91:1）
- **`fc:frame:button:1`** - 按钮（如果需要交互）
- **`fc:frame:post_url`** - 按钮点击后的处理 URL

## 🚀 测试步骤

### 1. 等待 Vercel 重新部署

代码已推送到 GitHub，Vercel 会自动重新部署（1-2 分钟）。

### 2. 验证 Meta 标签

部署完成后，在浏览器中：

1. 访问：https://farcaster-neynar-score-miniapp.vercel.app
2. 右键点击页面 → "查看页面源代码"
3. 在源代码中搜索 `fc:frame`，应该能看到：
   ```html
   <meta property="fc:frame" content="vNext" />
   <meta property="fc:frame:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
   ```

### 3. 在 Warpcast 中测试

1. 在 Warpcast 中创建一个新的 Cast
2. 添加链接：`https://farcaster-neynar-score-miniapp.vercel.app`
3. 发布 Cast
4. **应该看到**：链接显示为 Frame 卡片（带图片），而不是普通链接
5. 点击 Frame 卡片，应该在 Farcaster 应用内打开

## ⚠️ 重要提示

### Frame vs Mini App

- **Frame**：在 Cast 中显示为卡片，点击后在应用内打开
- **Mini App**：通过 Neynar 控制台配置的完整应用

你的应用现在同时支持：
- ✅ Frame 格式（可以在 Cast 中显示为卡片）
- ✅ Mini App 功能（完整的应用功能）

### 如果仍然无法识别

1. **清除缓存**
   - 在 Vercel 中手动触发重新部署
   - 清除浏览器缓存

2. **检查图片 URL**
   - 确保 `icon.png` 可以访问
   - 图片应该是有效的图片文件

3. **验证 HTML 源代码**
   - 确保 meta 标签在服务器端渲染的 HTML 中
   - 不是在客户端 JavaScript 中添加的

4. **等待索引**
   - Farcaster 可能需要几分钟来索引新的 Frame
   - 等待 5-10 分钟后重试

## 📝 当前配置状态

- ✅ `fc:frame` meta 标签已添加
- ✅ `fc:frame:image` meta 标签已添加
- ✅ `og:image` meta 标签已添加
- ✅ 图片 URL 正确配置
- ✅ Next.js 服务器端渲染（SSR）
- ✅ 代码已推送到 GitHub
- ⏳ 等待 Vercel 重新部署

## 🎯 预期结果

部署完成后，在 Warpcast 中：

1. **创建 Cast 时**：添加链接后，应该看到 Frame 卡片预览
2. **发布 Cast 后**：链接显示为带图片的 Frame 卡片
3. **点击 Frame**：在 Farcaster 应用内打开，而不是跳转到浏览器

如果一切正常，你的应用现在应该可以在 Farcaster 中正确显示了！

