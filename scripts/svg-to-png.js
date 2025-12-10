// 将 SVG 转换为 PNG 的脚本
const fs = require('fs');
const path = require('path');

// 检查是否安装了 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('需要安装 sharp 库。正在安装...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    sharp = require('sharp');
  } catch (err) {
    console.error('无法安装 sharp。请手动运行: npm install sharp --save-dev');
    console.log('\n或者您可以使用以下方法：');
    console.log('1. 在浏览器中打开 public/neynar-score-icon.html');
    console.log('2. 右键点击图片，选择"图片另存为"保存为 PNG');
    process.exit(1);
  }
}

const svgPath = path.join(__dirname, '../public/neynar-score-icon.svg');
const pngPath = path.join(__dirname, '../public/neynar-score-icon.png');

async function convertSvgToPng() {
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    // 使用 sharp 将 SVG 转换为 PNG (512x512)
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    
    console.log('✅ 成功将 SVG 转换为 PNG！');
    console.log(`📁 文件位置: ${pngPath}`);
    console.log(`🌐 网页访问: /neynar-score-icon.png`);
  } catch (error) {
    console.error('转换失败:', error);
    process.exit(1);
  }
}

convertSvgToPng();
