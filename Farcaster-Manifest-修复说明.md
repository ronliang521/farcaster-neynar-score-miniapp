# Farcaster Manifest 修复说明

## 问题原因

"Failed to submit manifest" 错误通常由以下原因导致：

1. **格式不正确** - manifest 需要使用正确的嵌套结构
2. **缺少必需字段** - 缺少 `accountAssociation` 或 `miniapp` 对象
3. **字段名称错误** - 使用了错误的字段名（如 `url` 应该是 `homeUrl`）
4. **缺少分类信息** - 缺少 `primaryCategory` 和 `tags`

## 已修复的问题

### 1. 正确的结构格式

**之前（错误）：**
```json
{
  "name": "...",
  "url": "...",
  "iconUrl": "..."
}
```

**现在（正确）：**
```json
{
  "accountAssociation": {
    "type": "custodyAddress"
  },
  "miniapp": {
    "version": "1",
    "name": "...",
    "homeUrl": "...",
    "iconUrl": "..."
  }
}
```

### 2. 必需字段

现在 manifest 包含所有必需字段：

- ✅ `accountAssociation` - 账户关联（用于验证域名所有权）
- ✅ `miniapp.version` - 版本号（必须是字符串 "1"）
- ✅ `miniapp.name` - 应用名称
- ✅ `miniapp.homeUrl` - 应用主页 URL（不是 `url`）
- ✅ `miniapp.iconUrl` - 图标 URL
- ✅ `miniapp.splashImageUrl` - 启动画面图片 URL
- ✅ `miniapp.splashBackgroundColor` - 启动背景颜色
- ✅ `miniapp.primaryCategory` - 主要分类（"social"）
- ✅ `miniapp.tags` - 标签数组

## 下一步操作

### 1. 验证 manifest 可访问

部署后，访问以下 URL 确认 manifest 可访问：
```
https://您的域名/.well-known/farcaster.json
```

应该能看到正确格式的 JSON。

### 2. 验证图片 URL 可访问

确保以下 URL 可以正常访问：
- 图标：`https://您的域名/neynar-score-icon.png`
- 启动画面：`https://您的域名/splash-screen.png`

### 3. 设置 accountAssociation（如果需要）

如果 Farcaster 要求验证域名所有权，您可能需要：

1. **生成签名**：
   - 使用您的 Farcaster 账户的 custody address
   - 签名 manifest 内容
   - 可以使用 Base Build Preview Tool: https://base.dev/preview

2. **添加签名到 manifest**：
   ```json
   {
     "accountAssociation": {
       "type": "custodyAddress",
       "custodyAddress": "0x...",
       "signature": "0x..."
     }
   }
   ```

### 4. 重新提交

1. 确保所有文件已部署到 Vercel
2. 验证 manifest URL 可访问
3. 验证图片 URL 可访问
4. 在 Farcaster 创建页面重新提交 manifest URL

## 常见错误排查

### 错误 1: "Manifest not found"
- **原因**：manifest 文件路径不正确或不可访问
- **解决**：确保文件在 `/.well-known/farcaster.json` 路径，且 Vercel 已正确部署

### 错误 2: "Invalid JSON format"
- **原因**：JSON 格式错误或语法错误
- **解决**：使用 JSON 验证工具检查格式

### 错误 3: "Missing required fields"
- **原因**：缺少必需字段
- **解决**：确保包含所有必需字段（见上方列表）

### 错误 4: "Image URL not accessible"
- **原因**：图片 URL 无法访问
- **解决**：在浏览器中直接访问图片 URL，确保返回图片而不是 404

### 错误 5: "Invalid category"
- **原因**：分类值不正确
- **解决**：使用有效的分类值，如 "social", "finance", "gaming" 等

## 验证清单

提交前请确认：

- [ ] manifest 文件在 `/.well-known/farcaster.json` 可访问
- [ ] JSON 格式正确，无语法错误
- [ ] 包含 `accountAssociation` 对象
- [ ] 包含 `miniapp` 对象
- [ ] `miniapp.homeUrl` 指向正确的应用 URL
- [ ] `miniapp.iconUrl` 图片可访问（1024x1024 PNG 推荐）
- [ ] `miniapp.splashImageUrl` 图片可访问
- [ ] `miniapp.primaryCategory` 是有效值
- [ ] `miniapp.tags` 是数组格式
- [ ] 所有 URL 使用 HTTPS
- [ ] 所有 URL 可公开访问（无认证要求）

## 测试命令

```bash
# 测试 manifest 可访问性
curl https://您的域名/.well-known/farcaster.json

# 测试图片可访问性
curl -I https://您的域名/neynar-score-icon.png
curl -I https://您的域名/splash-screen.png

# 验证 JSON 格式
node -e "const fs = require('fs'); JSON.parse(fs.readFileSync('public/.well-known/farcaster.json', 'utf8')); console.log('✅ JSON 格式正确');"
```

