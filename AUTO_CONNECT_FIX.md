# 自动连接 Farcaster 账户修复

## ✅ 已修复的问题

应用打开时无法自动连接 Farcaster 账户。

## 🔧 修复内容

### 1. 使用 Farcaster Mini App SDK 的 `sdk.context`

**之前的问题**：
- 只检查了 `window.farcaster`，这在 Mini App 环境中可能不可用
- 没有使用官方 SDK 的 `context` API

**修复后**：
- 优先使用 `sdk.context` 获取用户信息（官方推荐方法）
- `sdk.context` 会自动提供当前登录用户的信息

```typescript
// 方法1: 使用 Farcaster Mini App SDK (推荐方法)
const { sdk } = await import('@farcaster/miniapp-sdk');
const context = await sdk.context;

if (context && context.user) {
  const user = context.user;
  const userFid = user.fid;
  
  if (userFid) {
    setCurrentUserFid(userFid);
    setFarcasterConnected(true);
    await fetchUserScore(userFid);
    return;
  }
}
```

### 2. 改进连接时机

**之前的问题**：
- 在组件加载时立即尝试连接，但 SDK 可能还未初始化完成

**修复后**：
- 延迟 500ms 后再连接，确保 SDK 的 `ready()` 调用已完成
- 使用 `setTimeout` 和清理函数确保不会重复连接

```typescript
useEffect(() => {
  // 延迟一点时间，确保 SDK 已初始化
  const timer = setTimeout(() => {
    connectFarcaster().catch((err) => {
      console.error('Failed to connect Farcaster:', err);
    });
  }, 500); // 等待 SDK ready() 调用完成后再连接

  return () => clearTimeout(timer);
}, []);
```

### 3. 多重降级方案

如果 SDK context 不可用，会尝试以下方法：

1. **SDK Context**（优先）
   - 使用 `sdk.context` 获取用户信息

2. **window.farcaster**（降级方案 1）
   - 检查 `window.farcaster.user` 或 `window.farcaster.connectUser()`

3. **URL 参数**（降级方案 2）
   - 从 URL 参数中获取 `fid`

4. **localStorage**（降级方案 3）
   - 从 localStorage 中获取之前保存的 `farcaster_fid`

### 4. 修复 TypeScript 类型错误

- 移除了不存在的 `user.fidNumber` 属性（只使用 `user.fid`）
- 移除了不存在的 `user.pfp` 属性（通过 API 获取完整用户信息）

## 📋 连接流程

```
应用打开
  ↓
SDK 初始化（_app.tsx）
  ↓
调用 sdk.actions.ready()
  ↓
等待 500ms
  ↓
调用 connectFarcaster()
  ↓
尝试方法1: sdk.context
  ├─ 成功 → 获取用户信息 → 显示积分
  └─ 失败 → 尝试方法2: window.farcaster
      ├─ 成功 → 获取用户信息 → 显示积分
      └─ 失败 → 尝试方法3: URL 参数
          ├─ 成功 → 获取用户信息 → 显示积分
          └─ 失败 → 尝试方法4: localStorage
              ├─ 成功 → 获取用户信息 → 显示积分
              └─ 失败 → 显示"未连接"提示
```

## 🎯 预期结果

修复后，在 Farcaster 中打开应用时：

1. **自动检测用户**：
   - ✅ 应用打开后自动检测当前登录的 Farcaster 用户
   - ✅ 无需手动点击"连接"按钮

2. **自动显示积分**：
   - ✅ 检测到用户后，自动获取并显示用户的 Neynar Score
   - ✅ 显示用户头像、用户名、关注数等信息

3. **用户体验**：
   - ✅ 打开应用即可看到自己的积分
   - ✅ 无需任何手动操作

## 🧪 测试步骤

### 1. 等待 Vercel 重新部署

代码已推送到 GitHub，Vercel 会自动重新部署（1-2 分钟）。

### 2. 在 Farcaster 中测试

1. 在 Farcaster 中打开应用
2. **应该看到**：
   - 应用自动检测到当前登录的用户
   - 自动显示用户的积分和信息
   - 无需点击任何按钮

### 3. 检查控制台

打开浏览器开发者工具，应该看到：
```
✅ 通过 SDK 获取到用户信息: [FID]
```

## 📝 相关文档

- [Farcaster Mini App SDK - Context](https://miniapps.farcaster.xyz/sdk/context)
- [Authenticating users](https://miniapps.farcaster.xyz/guides/authenticating-users)

## ⚠️ 注意事项

1. **SDK 初始化顺序**：
   - 必须先调用 `sdk.actions.ready()`，然后才能访问 `sdk.context`
   - 因此我们延迟 500ms 后再连接

2. **降级方案**：
   - 如果 SDK context 不可用，会自动尝试其他方法
   - 确保在普通浏览器中也能正常运行

3. **用户信息获取**：
   - SDK context 可能不包含所有用户信息（如头像、关注数等）
   - 我们通过 `fetchUserScore` API 获取完整的用户信息

现在你的应用应该可以在打开时自动连接 Farcaster 账户了！🎉

