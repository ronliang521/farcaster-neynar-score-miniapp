# Manifest 提交失败排查指南

## ✅ 已验证正常的部分

根据检查，以下部分都是正常的：
- ✅ JSON 格式正确
- ✅ Manifest 文件可访问
- ✅ 图片 URL 可访问（图标和启动画面）
- ✅ homeUrl 使用稳定域名
- ✅ Domain 配置正确

## 🔍 可能的问题原因

### 1. accountAssociation 签名验证失败 ⚠️

**问题**：`accountAssociation` 中的签名可能已过期或无效

**检查方法**：
- 签名是基于特定时间生成的，可能已过期
- Farcaster 需要验证签名是否与您的账户匹配

**解决方案**：
1. **重新生成签名**：
   - 访问 Farcaster 的签名工具
   - 使用您的 Farcaster 账户重新签名 manifest
   - 更新 `accountAssociation` 中的 `header`, `payload`, `signature`

2. **检查签名格式**：
   - 确保签名是 base64 编码
   - 确保 header 和 payload 格式正确

### 2. 图片尺寸或格式问题

**问题**：图片可能不符合 Farcaster 的要求

**检查清单**：
- ✅ 图标：推荐 1024x1024 PNG
- ✅ 启动画面：推荐合适的尺寸
- ✅ 格式：PNG, JPG, WebP

**当前状态**：
- 图标：512x512 PNG ✅
- 启动画面：1024x1024 PNG ✅

**可能需要**：将图标升级到 1024x1024

### 3. 字段验证问题

**可能的问题字段**：

1. **ogTitle 中的特殊字符**：
   ```
   "ogTitle": "Neynar Score Checker –User "
   ```
   `–` 是特殊字符（en dash），可能需要转义或替换为普通 `-`

2. **tagline 末尾空格**：
   ```
   "tagline": "Check any user's Neynar Score "
   ```
   末尾有空格，可能需要去除

3. **description 长度**：可能需要符合特定长度要求

### 4. Domain 验证问题

**检查**：
- Domain 字段是否完全匹配
- 是否使用了正确的协议（HTTPS）
- manifest 路径是否正确：`/.well-known/farcaster.json`

### 5. 缓存问题

**问题**：Farcaster 可能缓存了旧的 manifest

**解决方案**：
- 等待 10-24 小时让缓存过期
- 或者尝试清除缓存后重新提交

## 🔧 修复建议

### 修复 1：清理字段中的问题

让我修复一些可能的问题：

1. **去除 tagline 末尾空格**
2. **修复 ogTitle 中的特殊字符**
3. **确保所有字符串格式正确**

### 修复 2：升级图标尺寸

如果需要，可以将图标升级到 1024x1024

### 修复 3：重新生成 accountAssociation

如果签名过期，需要重新生成

## 📋 详细检查清单

提交前请确认：

- [ ] Domain 字段完全匹配：`farcaster-neynar-score-miniapp.vercel.app`
- [ ] Manifest 可访问：`https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json`
- [ ] JSON 格式正确，无语法错误
- [ ] 所有图片 URL 可访问
- [ ] accountAssociation 签名有效且未过期
- [ ] 所有必需字段都存在
- [ ] 字符串字段无特殊字符问题
- [ ] homeUrl 使用稳定域名（不是预览分支域名）
- [ ] 图片尺寸符合要求

## 🚨 需要的信息

为了进一步排查，请提供：

1. **具体的错误信息**：
   - Farcaster 显示的具体错误消息是什么？
   - 是否有错误代码？

2. **提交时的操作**：
   - Domain 字段填写的是什么？
   - 是直接提交表单还是粘贴 JSON？

3. **错误发生的时间**：
   - 是在点击 Submit 后立即失败？
   - 还是验证过程中失败？

## 💡 临时解决方案

如果问题持续，可以尝试：

1. **使用 Farcaster 提供的 JSON**：
   - 在创建页面，使用页面底部显示的 "Manifest JSON"
   - 直接复制那个 JSON 到 manifest 文件
   - 确保 Domain 字段正确

2. **联系 Farcaster 支持**：
   - 如果所有检查都通过但仍然失败
   - 可能需要联系 Farcaster 支持获取具体错误信息


