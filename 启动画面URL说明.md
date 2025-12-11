# 启动画面图片 URL 说明

## 当前配置的 URL

根据配置文件，启动画面图片的 URL 格式为：

```
https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png
```

## 如何找到实际的 Vercel URL

### 方法 1：通过 Vercel 控制台（最准确）

1. 访问 https://vercel.com/dashboard
2. 找到项目 `farcaster-neynar-score-miniapp`
3. 在项目页面顶部查看部署 URL
4. 实际 URL 格式：
   ```
   https://[您的实际域名]/splash-screen.png
   ```

### 方法 2：通过 GitHub 仓库

1. 访问：https://github.com/ronliang521/farcaster-neynar-score-miniapp
2. 如果仓库已连接 Vercel，右侧会显示部署状态
3. 点击部署状态徽章查看实际 URL

### 方法 3：测试访问

部署完成后，直接在浏览器访问以下 URL 测试：

```
https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png
https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.svg
```

如果能看到图片，说明部署成功！

## 所有相关文件的 URL

部署后，以下文件可以通过 URL 访问：

| 文件 | URL 格式 |
|------|----------|
| 启动画面 PNG | `https://您的域名/splash-screen.png` |
| 启动画面 SVG | `https://您的域名/splash-screen.svg` |
| 应用图标 PNG | `https://您的域名/neynar-score-icon.png` |
| 应用图标 SVG | `https://您的域名/neynar-score-icon.svg` |
| Farcaster Manifest | `https://您的域名/.well-known/farcaster.json` |
| Warpcast Manifest | `https://您的域名/.well-known/warpcast.json` |

## 配置文件中的 URL

当前配置文件中使用的 URL（需要根据实际域名更新）：

- **farcaster.json**: `https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png`
- **warpcast.json**: `https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png`

## 更新 URL 的方法

如果您的实际 Vercel 域名不同，需要更新配置文件：

1. **手动更新**：
   - 编辑 `public/.well-known/farcaster.json`
   - 编辑 `public/.well-known/warpcast.json`
   - 将所有 `farcaster-neynar-score-miniapp.vercel.app` 替换为您的实际域名

2. **使用脚本**（如果设置了环境变量）：
   ```bash
   node scripts/update-manifest-urls.js
   ```

3. **在 Vercel 环境变量中设置**：
   - 在 Vercel 项目设置中添加环境变量 `NEXT_PUBLIC_APP_URL`
   - 值为您的实际域名（如：`https://your-domain.vercel.app`）

## 验证配置

部署完成后，访问以下 URL 验证：

1. **检查启动画面图片**：
   ```
   https://您的域名/splash-screen.png
   ```

2. **检查 Manifest 配置**：
   ```
   https://您的域名/.well-known/farcaster.json
   ```
   应该能看到包含 `splashImageUrl` 和 `splashBackgroundColor` 的 JSON

3. **检查图片是否可访问**：
   在浏览器中直接打开图片 URL，应该能看到紫色背景的启动画面图片

