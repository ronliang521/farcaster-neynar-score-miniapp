// 更新 manifest 文件中的 URL，使用环境变量或当前域名
const fs = require('fs');
const path = require('path');

// 从环境变量获取域名，或使用默认值
const DOMAIN = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL 
  ? process.env.NEXT_PUBLIC_APP_URL
  : 'https://farcaster-neynar-score-miniapp.vercel.app';

const manifestPath = path.join(__dirname, '../public/.well-known/farcaster.json');
const warpcastPath = path.join(__dirname, '../public/.well-known/warpcast.json');

const manifest = {
  name: "Neynar Score Mini App",
  description: "Check your Farcaster Neynar Score and improve your social presence",
  version: "1.0.0",
  iconUrl: `${DOMAIN}/neynar-score-icon.png`,
  splashImageUrl: `${DOMAIN}/splash-screen.png`,
  splashBackgroundColor: "#9333ea",
  url: DOMAIN
};

// 更新 farcaster.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Updated ${manifestPath}`);
console.log(`   Domain: ${DOMAIN}`);

// 更新 warpcast.json
fs.writeFileSync(warpcastPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Updated ${warpcastPath}`);
