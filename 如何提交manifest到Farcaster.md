# 如何在 Farcaster Developer Tools 中提交 Manifest

## 前提条件

在提交之前，请确保：
- ✅ Manifest 文件可以访问（HTTP Status: 200）
- ✅ Account Association 验证通过（Domain Matches: ✅）
- ✅ Mini App Configuration 有效（无错误）
- ✅ 所有字段都符合 Farcaster 的要求

## 重要说明

**Farcaster Mini App 的发布是自动的！**

一旦您的 manifest 文件正确配置并部署，并且 accountAssociation 验证通过，您的 Mini App 就会自动被 Farcaster 发现和索引。**通常不需要一个明确的"提交"按钮**。

## 验证和注册步骤

### 步骤 1: 验证 Manifest（已完成 ✅）

1. **访问 Farcaster Developer Tools**：
   ```
   https://farcaster.xyz/~/developers/mini-apps/manifest
   ```

2. **输入域名并刷新**：
   - 在 "Domain" 输入框中输入：`farcaster-neynar-score-miniapp.vercel.app`
   - 点击 "Refresh" 按钮
   - 确认所有验证项都显示 ✅

### 步骤 2: 确认验证通过

确保以下所有项都显示 ✅：
- ✅ HTTP Status: 200
- ✅ Account Association: Valid
- ✅ Domain Matches: ✅
- ✅ Signature: Verified
- ✅ Mini App Configuration: Valid

### 步骤 3: 自动发现和索引

一旦验证通过，Farcaster 会自动：
1. **索引您的 Mini App**：系统会自动发现并索引您的 manifest
2. **使其可搜索**：用户可以在 Farcaster 客户端中搜索到您的 Mini App
3. **允许分享**：用户可以通过链接或 cast 分享您的 Mini App

**注意**：根据 Farcaster 文档，Mini App 需要一些用户活动后才会出现在搜索结果中。

### 方法 2: 使用 Hosted Manifest（可选）

如果 Farcaster Developer Tools 提供 "Create Hosted Manifest" 选项：

1. **点击 "+ Create Hosted Manifest" 按钮**
   - 通常在页面顶部的蓝色信息框中

2. **填写应用信息**：
   - 按照提示填写所有必需字段
   - 系统会自动验证 manifest

3. **获得 Hosted Manifest ID**：
   - 创建完成后，会获得一个 hosted manifest ID
   - 例如：`1234567890`

4. **设置重定向（可选）**：
   - 如果使用 hosted manifest，可以在 `next.config.js` 中设置重定向
   - 这样 manifest 将由 Farcaster 托管，无需手动管理

### 方法 3: 通过 Warpcast 客户端验证（可选）

您也可以通过 Warpcast 客户端验证 Mini App：

1. **打开 Warpcast 移动应用或 Web 客户端**

2. **尝试打开您的 Mini App**：
   - 在聊天中输入或分享您的 Mini App URL
   - 例如：`https://farcaster-neynar-score-miniapp.vercel.app/`
   - 如果能够正常打开，说明 Mini App 已成功注册

3. **检查开发者设置**（可选）：
   - Settings → Developer → Domains
   - 查看您的域名是否已注册

## 验证 Mini App 是否成功发布

验证通过后，可以通过以下方式确认 Mini App 已发布：

### 1. 检查 Farcaster Developer Tools
- 回到 Farcaster Developer Tools 页面
- 刷新后，所有验证项应该都显示 ✅
- 如果看到 "This domain has a valid manifest setup" 或类似消息，说明已成功

### 2. 在 Farcaster 客户端中测试
- 打开 Warpcast 或其他 Farcaster 客户端
- 尝试打开您的 Mini App URL：
  ```
  https://farcaster-neynar-score-miniapp.vercel.app/
  ```
- 如果能够正常打开并显示您的应用，说明已成功发布

### 3. 检查 manifest URL
- 访问：https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json
- 确认文件可以正常访问，并且包含正确的 accountAssociation

### 4. 搜索 Mini App（可能需要时间）
- 在 Farcaster 客户端中搜索您的 Mini App 名称：`farcaster-neynar-score`
- **注意**：根据 Farcaster 文档，Mini App 需要一些用户活动后才会出现在搜索结果中
- 如果暂时搜索不到，这是正常的，不影响 Mini App 的正常使用

## 常见问题

### Q: 找不到 "Submit" 按钮怎么办？

**A:** 可能的原因：
1. **验证未通过**：确保所有验证项都显示 ✅
2. **页面需要滚动**：检查页面底部是否有提交按钮
3. **使用 Hosted Manifest**：尝试点击 "+ Create Hosted Manifest"
4. **通过客户端提交**：使用 Warpcast 移动应用或 Web 客户端

### Q: 提交后显示错误怎么办？

**A:** 检查以下几点：
1. **Manifest 文件可访问**：确认 `/.well-known/farcaster.json` 返回 200
2. **Account Association 有效**：确认 domain 匹配
3. **所有字段符合要求**：检查字段长度、格式等
4. **图片 URL 可访问**：确认所有图片 URL 都能正常访问

### Q: 提交后多久能看到 Mini App？

**A:** 通常：
- **立即生效**：如果验证通过，通常立即生效
- **可能需要几分钟**：某些情况下可能需要几分钟同步
- **需要用户活动**：根据文档，Mini App 需要一些用户活动后才会出现在搜索结果中

## 当前状态检查清单

在提交前，请确认：

- [ ] Manifest 文件可访问（HTTP Status: 200）
- [ ] Account Association 验证通过
- [ ] Domain Matches 显示 ✅
- [ ] Signature 显示 Verified
- [ ] Mini App Configuration 有效（无错误）
- [ ] 所有图片 URL 可访问
- [ ] 所有字段符合 Farcaster 文档要求

## 需要帮助？

如果遇到问题：
1. **提供截图**：显示 Farcaster Developer Tools 的当前状态
2. **提供错误信息**：如果有任何错误消息
3. **检查 manifest URL**：确认 manifest 文件可以正常访问

## 下一步

提交成功后：
1. **测试 Mini App**：在 Farcaster 客户端中打开您的 Mini App
2. **分享给用户**：通过 cast 或其他方式分享您的 Mini App
3. **监控使用情况**：关注用户反馈和使用情况

