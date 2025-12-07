# 测试 Farcaster Frame

## ✅ 已添加的配置

我已经根据 ChatGPT 的建议，添加了所有必需的 Farcaster Frame meta 标签：

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
<meta property="fc:frame:image:aspect_ratio" content="1:1" />
<meta property="og:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
```

## 🧪 测试步骤

### 1. 验证 Meta 标签在 HTML 源代码中

部署完成后（等待 1-2 分钟），在浏览器中：

1. 访问：https://farcaster-neynar-score-miniapp.vercel.app
2. 右键点击页面 → "查看页面源代码"（或按 Ctrl+U / Cmd+Option+U）
3. 在源代码中搜索 `fc:frame`
4. **应该看到**：
   ```html
   <meta property="fc:frame" content="vNext" />
   <meta property="fc:frame:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
   ```

### 2. 在 Warpcast 中测试

1. **创建新的 Cast**
   - 在 Warpcast 中点击"Compose"
   - 添加链接：`https://farcaster-neynar-score-miniapp.vercel.app`
   - **应该看到**：链接预览显示为 Frame 卡片（带图片），而不是普通链接

2. **发布 Cast**
   - 点击发布
   - **应该看到**：Cast 中显示为 Frame 卡片

3. **点击 Frame**
   - 点击 Frame 卡片
   - **应该看到**：在 Farcaster 应用内打开，而不是跳转到浏览器

## 🔍 如果仍然无法识别

### 检查 1: 验证 HTML 源代码

使用命令行验证：

```bash
curl -s https://farcaster-neynar-score-miniapp.vercel.app/ | grep "fc:frame"
```

应该输出：
```
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://farcaster-neynar-score-miniapp.vercel.app/icon.png" />
```

### 检查 2: 验证图片 URL

```bash
curl -I https://farcaster-neynar-score-miniapp.vercel.app/icon.png
```

应该返回 `200 OK` 状态码。

### 检查 3: 清除缓存

1. 在 Vercel 控制台中，手动触发重新部署
2. 清除浏览器缓存
3. 等待 5-10 分钟让 Farcaster 重新索引

### 检查 4: 使用 Frame 验证工具

可以使用 Farcaster Frame 验证工具来检查配置：
- https://warpcast.com/~/developers/frames

## 📝 当前状态

- ✅ `fc:frame` meta 标签已添加
- ✅ `fc:frame:image` meta 标签已添加  
- ✅ `og:image` meta 标签已添加
- ✅ Next.js 服务器端渲染（确保 meta 标签在 HTML 中）
- ✅ 代码已推送到 GitHub
- ⏳ 等待 Vercel 重新部署（1-2 分钟）

## 🎯 预期结果

部署完成后：

1. **在 Warpcast 中创建 Cast 时**：
   - 添加链接后，应该看到 Frame 卡片预览（带图片）
   - 而不是普通链接预览

2. **发布 Cast 后**：
   - 链接显示为 Frame 卡片
   - 用户可以看到应用图标

3. **点击 Frame**：
   - 在 Farcaster 应用内打开
   - 显示完整的应用界面
   - 不会跳转到浏览器

## 💡 提示

如果 Frame 仍然无法识别，可能需要：

1. **等待更长时间**：Farcaster 可能需要几分钟来索引新的 Frame
2. **检查图片格式**：确保 `icon.png` 是有效的图片文件
3. **使用 Frame 验证工具**：检查配置是否符合规范

现在你的应用应该可以在 Farcaster 中正确显示为 Frame 了！

