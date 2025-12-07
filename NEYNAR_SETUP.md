# Neynar Mini App 配置指南

## 在 Neynar 控制台中的配置步骤

### 1. Set up 标签页配置

#### App Name
- **值**: `Check Neynar Score`
- ✅ 已配置

#### Logo URL
- **当前值**: `https://farcaster-neynar-score-miniapp.vercel.app/`
- **应该改为**: `https://farcaster-neynar-score-miniapp.vercel.app/icon.png`
- ⚠️ **重要**: Logo URL 必须是图片 URL，不是网站 URL！

#### API Key
- ✅ 已配置
- 用于 Neynar API 认证

#### Client ID
- **值**: `5f8bb7cf-17f6-410b-b9b8-21622b553803`
- ✅ 已配置

### 2. Mini App 标签页配置

#### Mini app Notifications Webhook URL
- **值**: `https://api.neynar.com/f/app/5f8bb7cf-17f6-410b-b9b8-21622b553803/event`
- ✅ 已配置在 Farcaster Domain manifest 中

### 3. 需要创建的配置文件

我已经为你创建了以下配置文件：

1. **`public/.well-known/warpcast.json`** - Warpcast 配置
2. **`public/.well-known/farcaster.json`** - Farcaster 基础配置
3. **`public/.well-known/farcaster-domain-manifest.json`** - Farcaster Domain Manifest（包含 webhook URL）

## 🔧 修复步骤

### 步骤 1: 更新 Neynar 控制台中的 Logo URL

在 Neynar 控制台的 "Set up" 标签页中：

1. 找到 "Logo URL" 字段
2. 将值从 `https://farcaster-neynar-score-miniapp.vercel.app/` 
   改为 `https://farcaster-neynar-score-miniapp.vercel.app/icon.png`
3. 保存更改

### 步骤 2: 验证配置文件可访问

部署后，验证以下 URL：

```bash
# Warpcast 配置
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/warpcast.json

# Farcaster 配置
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json

# Farcaster Domain Manifest
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster-domain-manifest.json

# 图标
curl -I https://farcaster-neynar-score-miniapp.vercel.app/icon.png
```

### 步骤 3: 在 Farcaster 中测试

1. **在 Warpcast 中分享链接**
   - 创建一个 Cast
   - 添加链接：`https://farcaster-neynar-score-miniapp.vercel.app`
   - 点击链接，应该能在 Farcaster 中打开

2. **通过搜索查找**
   - 在 Warpcast 中搜索 "Neynar Score"
   - 或搜索你的应用 URL

## 📋 配置检查清单

- [ ] Logo URL 已更新为图片 URL（`/icon.png`）
- [ ] 所有配置文件已部署并可访问
- [ ] Webhook URL 已配置在 manifest 中
- [ ] 应用在浏览器中可正常访问
- [ ] 应用在 Warpcast 中可正常打开

## ⚠️ 常见问题

### Q: 为什么在 Farcaster 中找不到应用？

**A: 可能的原因：**

1. **Logo URL 错误**
   - 必须是图片 URL，不是网站 URL
   - 应该是：`https://farcaster-neynar-score-miniapp.vercel.app/icon.png`

2. **配置文件未部署**
   - 等待 Vercel 重新部署
   - 验证配置文件可访问

3. **缓存问题**
   - 清除浏览器缓存
   - 在 Vercel 中手动触发重新部署

4. **需要时间索引**
   - Farcaster 可能需要一些时间来索引新应用
   - 等待几分钟后重试

### Q: 如何验证配置是否正确？

**A: 使用以下命令：**

```bash
# 检查所有配置文件
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/warpcast.json
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster-domain-manifest.json

# 检查图标
curl -I https://farcaster-neynar-score-miniapp.vercel.app/icon.png
```

所有请求应该返回 200 状态码。

## 🎯 下一步

1. ✅ 更新 Neynar 控制台中的 Logo URL
2. ✅ 等待 Vercel 重新部署
3. ✅ 验证所有配置文件可访问
4. ✅ 在 Warpcast 中测试应用链接
5. ✅ 如果仍无法找到，等待几分钟让 Farcaster 索引

