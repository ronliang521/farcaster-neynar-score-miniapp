# Farcaster Mini App 部署指南

## 步骤 1: 部署应用

### 选项 A: 使用 Vercel（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 点击 "Deploy"
5. 等待部署完成，获取你的 URL（例如：`https://your-app.vercel.app`）

### 选项 B: 使用 Netlify

1. 将代码推送到 GitHub
2. 访问 [Netlify](https://netlify.com)
3. 导入你的 GitHub 仓库
4. 构建命令：`npm run build`
5. 发布目录：`.next`
6. 点击 "Deploy site"

### 选项 C: 使用其他平台

确保你的平台支持：
- Next.js 13
- Node.js 18+
- 静态文件服务（用于 `.well-known` 目录）

## 步骤 2: 更新配置文件

部署完成后，更新以下文件中的 URL：

### 1. `public/.well-known/warpcast.json`

将 `action.url` 更新为你的生产 URL：

```json
{
  "name": "Neynar Score",
  "description": "Check your Neynar Score and Farcaster reputation...",
  "imageUrl": "https://your-domain.com/icon.png",
  "action": {
    "type": "link",
    "url": "https://your-domain.com"
  },
  "version": "1.0.0"
}
```

### 2. `pages/index.tsx`

更新 Open Graph 和 Twitter meta 标签中的 URL：

```tsx
<meta property="og:url" content="https://your-domain.com" />
<meta property="twitter:url" content="https://your-domain.com" />
```

## 步骤 3: 验证配置

确保以下 URL 可以访问：

- ✅ `https://your-domain.com/.well-known/warpcast.json`
- ✅ `https://your-domain.com/manifest.json`
- ✅ `https://your-domain.com/icon.png`
- ✅ `https://your-domain.com/` (主页)

你可以使用浏览器或 curl 测试：

```bash
curl https://your-domain.com/.well-known/warpcast.json
```

应该返回 JSON 内容。

## 步骤 4: 提交到 Farcaster

### 方法 1: 通过 Warpcast

1. 在 Warpcast 中创建一个 Cast
2. 添加你的应用链接
3. 如果配置正确，Warpcast 会自动识别为 mini app

### 方法 2: 通过 Farcaster 开发者门户

1. 访问 Farcaster 开发者文档
2. 按照指南提交你的应用
3. 提供应用信息：
   - 名称：Neynar Score
   - 描述：Check your Neynar Score and Farcaster reputation
   - URL：你的生产 URL
   - 图标：上传 `public/icon.png`

## 步骤 5: 测试

1. 在 Warpcast 中打开你的应用链接
2. 测试所有功能：
   - ✅ 自动连接 Farcaster
   - ✅ 查看自己的积分
   - ✅ 查询其他用户的积分
   - ✅ 分享功能
   - ✅ 打赏功能

## 常见问题

### Q: `.well-known` 目录无法访问？

A: 确保 Next.js 配置正确，`public` 目录下的文件会自动提供。如果使用其他服务器，确保配置了正确的静态文件路由。

### Q: 应用在 Farcaster 中无法打开？

A: 检查：
1. URL 是否正确
2. `warpcast.json` 是否可访问
3. 应用是否使用 HTTPS
4. CORS 设置是否正确

### Q: 如何更新应用？

A: 
1. 更新代码
2. 推送到 GitHub
3. 重新部署
4. 清除浏览器缓存

## 技术支持

如有问题，请查看：
- [Farcaster 文档](https://docs.farcaster.xyz)
- [Next.js 文档](https://nextjs.org/docs)

