# 使用 Farcaster Hosted Manifests（推荐方案）

这是最简单的方案，不需要手动管理 manifest 文件。

## 步骤 1: 创建 Hosted Manifest

1. **访问**：https://farcaster.xyz/~/developers/mini-apps/manifest

2. **输入域名**：
   ```
   farcaster-neynar-score-miniapp.vercel.app
   ```

3. **填写应用信息**：
   - App Name: `farcaster-neynar-score`
   - Icon URL: `https://farcaster-neynar-score-miniapp.vercel.app/neynar-score-icon-1024-noalpha.png`
   - Home URL: `https://farcaster-neynar-score-miniapp.vercel.app/`
   - 其他字段按需填写

4. **提交后获得 Hosted Manifest ID**：
   - 例如：`1234567890`
   - 保存这个 ID

## 步骤 2: 设置重定向

更新 `next.config.js` 添加重定向：

```javascript
async redirects() {
  return [
    {
      source: '/.well-known/farcaster.json',
      destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_HOSTED_MANIFEST_ID',
      permanent: false,
    },
  ]
},
```

## 步骤 3: 部署

提交并部署后，manifest 将由 Farcaster 托管，您可以在网站上直接更新。

## 优势

- ✅ 不需要手动管理 manifest 文件
- ✅ 可以在 Farcaster 网站上直接更新
- ✅ 自动验证和错误检查
- ✅ 支持域名迁移
- ✅ accountAssociation 自动生成和管理
