# Base Build Preview Tool 使用指南

## 当前状态

根据您的截图，Base Build Preview Tool 显示：
- ✅ **关联账户 ron521520** - 成功
- ❌ **域名匹配 farcaster-neynar-score-miniapp.vercel.app** - 失败
- ✅ **签名 有效的** - 成功

## 问题分析

签名有效但域名匹配失败，说明：
1. accountAssociation 的签名本身是正确的
2. 但是 manifest 文件中的 `accountAssociation.payload` 仍然是空的（`{"domain": ""}`）
3. 需要更新为包含正确域名的 accountAssociation

## 解决步骤

### 步骤 1: 找到 "Verify" 按钮

根据您的截图，您已经看到了验证结果，说明可能已经验证过了。但如果您需要重新生成 accountAssociation：

1. **在 "账户关联" (Account Association) 标签页中**
   - 您当前应该在这个标签页（显示三个验证结果的地方）
   - 查看页面上是否有 "Verify" 或 "验证" 按钮
   - 通常在验证结果的上方或下方

2. **如果看不到 Verify 按钮**
   - 可能已经验证过了（因为签名显示为"有效的"）
   - 或者需要先点击 "提交" (Submit) 按钮
   - 提交后，Verify 按钮应该会出现

### 步骤 2: 查找生成的 accountAssociation

**重要：** accountAssociation 可能不会直接显示在验证结果页面。请尝试以下方法：

#### 方法 A: 查看验证结果下方的区域
- 在三个验证结果（关联账户、域名匹配、签名）的下方
- 可能有一个可展开的区域或 JSON 显示
- 查找包含 `header`, `payload`, `signature` 的 JSON 对象

#### 方法 B: 检查浏览器开发者工具
1. **打开开发者工具**：
   - 按 `F12` 或 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   
2. **查看 Console（控制台）标签**：
   - 查找包含 "accountAssociation" 的日志
   - 可能以 JSON 格式输出

3. **查看 Network（网络）标签**：
   - 刷新页面或重新提交
   - 查找 API 请求（可能以 `/api/` 或 `/preview/` 开头）
   - 点击请求，查看 Response（响应）标签
   - 响应中可能包含 accountAssociation

#### 方法 C: 查看页面源代码
1. 右键点击页面 → "查看页面源代码" 或 "View Page Source"
2. 按 `Cmd+F` (Mac) / `Ctrl+F` (Windows) 搜索
3. 搜索关键词：`accountAssociation`, `header`, `payload`, `signature`
4. 如果找到，复制完整的 JSON 对象

### 步骤 2: 复制 accountAssociation

如果页面显示了 accountAssociation，请复制完整的 JSON：

```json
{
  "header": "...",
  "payload": "...",
  "signature": "..."
}
```

### 步骤 3: 如果找不到 accountAssociation

如果 Base Build Preview Tool 没有直接显示 accountAssociation，可以尝试：

1. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签
   - 可能在那里有 accountAssociation 的输出

2. **检查 Network 请求**
   - 在开发者工具的 Network 标签中
   - 查找相关的 API 请求
   - 响应中可能包含 accountAssociation

3. **查看页面源代码**
   - 右键点击页面 → "查看页面源代码"
   - 搜索 "accountAssociation" 或 "header"
   - 可能嵌入在页面中

### 步骤 4: 手动验证 payload

如果获得了新的 payload，可以验证它是否包含正确的域名：

```bash
# 在终端中运行（替换 YOUR_PAYLOAD）
echo "YOUR_PAYLOAD" | base64 -d
```

应该看到：
```json
{"domain":"farcaster-neynar-score-miniapp.vercel.app"}
```

**绝不能是：**
```json
{"domain":""}
```

## 替代方案

如果 Base Build Preview Tool 无法生成 accountAssociation，可以尝试：

### 方案 A: 使用 Farcaster Developer Tools
1. 访问：https://farcaster.xyz/~/developers/mini-apps/manifest
2. 输入域名并生成 manifest
3. 复制 accountAssociation

### 方案 B: 使用 Warpcast 移动应用
1. Warpcast → Settings → Developer → Domains
2. 输入域名并生成 manifest
3. 复制 accountAssociation

## 更新 manifest

获得新的 accountAssociation 后，请提供：
- `header`
- `payload`
- `signature`

我会立即更新 `public/.well-known/farcaster.json` 文件。

## 验证步骤

更新后，请：
1. 提交并推送到 GitHub
2. 等待 Vercel 部署完成
3. 在 Base Build Preview Tool 中重新验证
4. 所有三个检查项应该都显示 ✅

