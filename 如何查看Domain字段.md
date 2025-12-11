# 如何查看和设置 Domain 字段

## Domain 字段在哪里？

Domain 字段位于 **Farcaster Mini App 创建页面**的表单顶部。

### 位置说明

在 Farcaster 创建 Mini App 的页面中，表单的第一个字段就是 **Domain**：

```
┌─────────────────────────────────────────┐
│ Domain                                  │
│ ┌───────────────────────────────────┐ │
│ │ example.com                        │ │ ← 这里就是 Domain 字段
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 如何获取正确的 Domain？

### 方法 1：通过 Vercel 控制台（最准确）

1. **访问 Vercel Dashboard**
   - 打开：https://vercel.com/dashboard
   - 登录您的账户

2. **找到您的项目**
   - 在项目列表中找到 `farcaster-neynar-score-miniapp`
   - 点击进入项目详情页

3. **查看域名信息**
   - 在项目页面顶部，您会看到部署的 URL
   - 格式通常是：`项目名-用户名.vercel.app` 或 `项目名.vercel.app`
   - **这就是您需要填写的 Domain**

4. **示例**
   - 如果显示：`https://farcaster-neynar-score-miniapp.vercel.app`
   - 那么 Domain 应该填写：`farcaster-neynar-score-miniapp.vercel.app`
   - **注意：不要包含 `https://` 和末尾的 `/`**

### 方法 2：通过 GitHub 仓库

1. **访问 GitHub 仓库**
   - 打开：https://github.com/ronliang521/farcaster-neynar-score-miniapp

2. **查看部署状态**
   - 如果仓库已连接到 Vercel，右侧会显示部署状态徽章
   - 点击徽章可以看到部署的 URL

### 方法 3：通过 manifest 文件

1. **访问 manifest 文件**
   - 部署完成后，访问：
     ```
     https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json
     ```

2. **查看 homeUrl**
   - 在返回的 JSON 中找到 `frame.homeUrl` 字段
   - 例如：`"homeUrl": "https://farcaster-neynar-score-miniapp.vercel.app/"`
   - 提取域名部分（去掉 `https://` 和末尾的 `/`）
   - 结果：`farcaster-neynar-score-miniapp.vercel.app`

### 方法 4：通过浏览器地址栏

1. **访问您的应用**
   - 在浏览器中打开您的应用 URL

2. **查看地址栏**
   - 地址栏显示的域名就是 Domain
   - 例如：如果 URL 是 `https://farcaster-neynar-score-miniapp.vercel.app`
   - 那么 Domain 就是：`farcaster-neynar-score-miniapp.vercel.app`

## 当前项目的 Domain

根据您的项目配置，Domain 应该是：

```
farcaster-neynar-score-miniapp.vercel.app
```

## 如何填写 Domain 字段？

### 在 Farcaster 创建页面：

1. **找到 Domain 字段**（表单第一个字段）

2. **填写域名**（不要包含协议和路径）：
   ```
   ✅ 正确：farcaster-neynar-score-miniapp.vercel.app
   ❌ 错误：https://farcaster-neynar-score-miniapp.vercel.app
   ❌ 错误：farcaster-neynar-score-miniapp.vercel.app/
   ❌ 错误：example.com
   ```

3. **验证格式**
   - 只包含域名部分
   - 不包含 `http://` 或 `https://`
   - 不包含末尾的 `/`
   - 不包含路径（如 `/path`）

## 常见错误

### 错误 1：填写了完整 URL
- ❌ `https://farcaster-neynar-score-miniapp.vercel.app`
- ✅ `farcaster-neynar-score-miniapp.vercel.app`

### 错误 2：包含了路径
- ❌ `farcaster-neynar-score-miniapp.vercel.app/`
- ✅ `farcaster-neynar-score-miniapp.vercel.app`

### 错误 3：使用了示例域名
- ❌ `example.com`
- ✅ `farcaster-neynar-score-miniapp.vercel.app`

### 错误 4：使用了预览分支域名
- ❌ `farcaster-neynar-score-miniapp-git-main-rons-projects-75076165.vercel.app`
- ✅ `farcaster-neynar-score-miniapp.vercel.app`（使用主域名）

## 验证 Domain 是否正确

填写 Domain 后，Farcaster 会验证：

1. **检查 manifest 文件是否存在**
   - 访问：`https://您的域名/.well-known/farcaster.json`
   - 应该返回正确的 JSON

2. **验证域名所有权**
   - 通过 `accountAssociation` 签名验证
   - 确保 manifest 中包含正确的签名

## 快速检查命令

```bash
# 检查 manifest 是否可访问
curl https://farcaster-neynar-score-miniapp.vercel.app/.well-known/farcaster.json

# 检查域名是否正确
echo "Domain: farcaster-neynar-score-miniapp.vercel.app"
```

## 总结

**Domain 字段位置：** Farcaster Mini App 创建页面的表单顶部

**正确的 Domain 值：** `farcaster-neynar-score-miniapp.vercel.app`

**如何确认：** 
1. 访问 Vercel Dashboard 查看项目域名
2. 或访问 manifest 文件查看 homeUrl
3. 或查看浏览器地址栏的域名

**重要提示：** 只填写域名部分，不要包含 `https://` 和路径！


