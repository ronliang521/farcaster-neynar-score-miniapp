# 如何以内嵌方式打开 Farcaster Mini App

## 问题说明

如果您在浏览器中直接打开 Mini App URL，会显示为普通网页。**Mini App 必须在 Farcaster 客户端（如 Warpcast）中打开才能以内嵌方式显示**。

## 正确打开方式

### 方法 1: 通过 Cast 中的链接打开（推荐）

1. **在 Warpcast 中创建一个 Cast**：
   - 打开 Warpcast（移动应用或 Web）
   - 创建一个新的 Cast
   - 在 Cast 中包含您的 Mini App URL：
     ```
     https://farcaster-neynar-score-miniapp.vercel.app/
     ```

2. **点击链接**：
   - 发布 Cast 后，点击链接
   - Mini App 会在 Warpcast 的内嵌视图中打开

3. **或者分享给其他人**：
   - 将包含 Mini App URL 的 Cast 分享给其他用户
   - 他们点击链接时，也会在内嵌视图中打开

### 方法 2: 通过直接输入 URL（在 Farcaster 客户端中）

1. **在 Warpcast 中**：
   - 打开聊天界面
   - 直接输入或粘贴 Mini App URL：
     ```
     https://farcaster-neynar-score-miniapp.vercel.app/
     ```
   - 发送消息
   - 点击链接，会在内嵌视图中打开

### 方法 3: 通过 Mini App 卡片/按钮

如果您的 Mini App 已经发布并被索引：

1. **搜索 Mini App**：
   - 在 Warpcast 中搜索您的 Mini App 名称
   - 如果找到，会显示为卡片形式
   - 点击卡片即可打开

2. **通过分享按钮**：
   - 如果其他用户分享了您的 Mini App
   - 点击分享的卡片或按钮
   - 会在内嵌视图中打开

## 为什么在浏览器中打开是网页？

**这是正常行为！**

- **在浏览器中打开**：Mini App 会显示为普通网页
- **在 Farcaster 客户端中打开**：Mini App 会以内嵌方式显示，并可以使用 Farcaster SDK 功能

## 如何测试内嵌模式

### 测试步骤：

1. **确保在 Farcaster 客户端中**：
   - 使用 Warpcast 移动应用或 Web 客户端
   - **不要**在普通浏览器中打开

2. **通过 Cast 链接打开**：
   - 创建一个 Cast，包含您的 Mini App URL
   - 点击链接
   - 应该会在内嵌视图中打开

3. **验证内嵌模式**：
   - 内嵌模式下，应用会显示在 Farcaster 客户端内
   - 不会有浏览器的地址栏和工具栏
   - 可以使用 Farcaster SDK 功能（如获取用户信息）

## 代码检查

您的代码已经正确配置了：

✅ **已调用 `sdk.actions.ready()`**：
```typescript
useEffect(() => {
  const initializeSDK = async () => {
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk');
      if (sdk && sdk.actions && sdk.actions.ready) {
        await sdk.actions.ready();
      }
    } catch (err) {
      // Fallback handling
    }
  };
  initializeSDK();
}, []);
```

✅ **已导入 Farcaster Mini App SDK**：
```typescript
import('@farcaster/miniapp-sdk')
```

✅ **已使用 SDK 获取用户上下文**：
```typescript
const context = await sdk.context;
```

## 常见问题

### Q: 为什么我在浏览器中打开看到的是网页？

**A:** 这是正常的。Mini App 必须在 Farcaster 客户端中打开才能以内嵌方式显示。在浏览器中打开会显示为普通网页。

### Q: 如何在 Farcaster 客户端中打开？

**A:** 
1. 在 Warpcast 中创建一个 Cast，包含您的 Mini App URL
2. 点击链接，会在内嵌视图中打开
3. 或者直接在聊天中输入 URL 并点击

### Q: 如何测试内嵌模式？

**A:**
1. 使用 Warpcast 移动应用或 Web 客户端
2. 创建一个 Cast，包含 Mini App URL
3. 点击链接，应该会在内嵌视图中打开

### Q: 内嵌模式和网页模式有什么区别？

**A:**
- **内嵌模式**：
  - 显示在 Farcaster 客户端内
  - 可以使用 Farcaster SDK 功能
  - 可以获取用户信息
  - 没有浏览器地址栏

- **网页模式**：
  - 显示在浏览器中
  - 无法使用 Farcaster SDK 功能
  - 无法获取用户信息
  - 有浏览器地址栏和工具栏

## 验证清单

在测试内嵌模式时，请确认：

- [ ] 在 Farcaster 客户端（Warpcast）中打开，而不是浏览器
- [ ] 通过 Cast 中的链接打开
- [ ] 应用显示在客户端内，没有浏览器地址栏
- [ ] 可以正常使用应用功能
- [ ] SDK 功能正常工作（如获取用户信息）

## 下一步

1. **在 Warpcast 中测试**：
   - 创建一个 Cast，包含您的 Mini App URL
   - 点击链接，验证是否以内嵌方式打开

2. **分享给其他用户**：
   - 将包含 Mini App URL 的 Cast 分享给其他用户
   - 他们点击链接时，也会在内嵌视图中打开

3. **验证功能**：
   - 确认应用在内嵌模式下正常工作
   - 确认可以获取用户信息
   - 确认所有功能正常
