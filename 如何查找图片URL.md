# 如何查找部署后的图片 URL

部署完成后，有几种方法可以找到图片的 URL：

## 方法 1：通过 Vercel 控制台（推荐）

1. **访问 Vercel 控制台**
   - 打开 https://vercel.com/dashboard
   - 登录您的账户

2. **找到您的项目**
   - 在项目列表中找到 `farcaster-neynar-score-miniapp`
   - 点击进入项目详情页

3. **查看部署信息**
   - 在项目页面顶部，您会看到部署的 URL
   - 格式通常是：`https://项目名-用户名.vercel.app` 或自定义域名

4. **构建图片 URL**
   - PNG 图片：`https://您的域名/neynar-score-icon.png`
   - SVG 图片：`https://您的域名/neynar-score-icon.svg`
   - HTML 预览：`https://您的域名/neynar-score-icon.html`

## 方法 2：通过 GitHub 仓库设置

1. **查看 GitHub 仓库**
   - 访问：https://github.com/ronliang521/farcaster-neynar-score-miniapp
   - 如果仓库已连接到 Vercel，仓库页面右侧会显示部署状态

2. **点击部署状态徽章**
   - 会跳转到 Vercel 部署页面
   - 可以看到部署的 URL

## 方法 3：通过 Vercel CLI（如果已安装）

```bash
# 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 登录 Vercel
vercel login

# 在项目目录中运行
cd /Users/luo/Desktop/farcaster-neynar-score-miniapp
vercel

# 查看项目信息
vercel ls
```

## 方法 4：直接访问测试

部署完成后，直接在浏览器中访问：

```
https://您的项目名.vercel.app/neynar-score-icon.png
https://您的项目名.vercel.app/neynar-score-icon.svg
```

如果能看到图片，说明部署成功！

## 方法 5：通过浏览器开发者工具

1. **打开您的应用**
   - 访问部署后的应用主页

2. **打开开发者工具**
   - 按 `F12` 或右键选择"检查"
   - 切换到 "Network"（网络）标签

3. **刷新页面**
   - 在 Network 标签中查找 `neynar-score-icon.png` 或 `neynar-score-icon.svg`
   - 点击该请求，可以看到完整的 URL

## 方法 6：检查 Vercel 项目设置

1. **进入项目设置**
   - 在 Vercel 项目页面，点击 "Settings"
   - 查看 "Domains" 部分

2. **查看所有域名**
   - 可以看到所有分配给项目的域名
   - 包括默认的 `.vercel.app` 域名和自定义域名（如果有）

## 图片文件列表

部署后，以下文件可以通过 URL 访问：

| 文件 | 路径 | URL 格式 |
|------|------|----------|
| PNG 图标 | `/public/neynar-score-icon.png` | `https://域名/neynar-score-icon.png` |
| SVG 图标 | `/public/neynar-score-icon.svg` | `https://域名/neynar-score-icon.svg` |
| HTML 预览 | `/public/neynar-score-icon.html` | `https://域名/neynar-score-icon.html` |

## 快速测试脚本

创建一个测试页面来验证图片是否可访问：

```html
<!DOCTYPE html>
<html>
<head>
  <title>图片 URL 测试</title>
</head>
<body>
  <h1>图片 URL 测试</h1>
  <p>PNG 图片：</p>
  <img src="/neynar-score-icon.png" alt="PNG Icon" width="256" />
  <p>SVG 图片：</p>
  <img src="/neynar-score-icon.svg" alt="SVG Icon" width="256" />
</body>
</html>
```

## 注意事项

- Next.js 的 `public` 目录下的文件会自动部署
- 文件路径不需要包含 `/public` 前缀
- 确保 Vercel 项目已连接到正确的 GitHub 仓库
- 如果修改了文件，需要重新推送到 GitHub 才会触发新的部署

