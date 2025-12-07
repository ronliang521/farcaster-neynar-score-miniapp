# Neynar Score Mini App

A Farcaster mini app for checking Neynar Scores and Farcaster reputation.

## Features

- ✅ Check your own Neynar Score
- ✅ Check other users' scores by FID or username
- ✅ Share your score to Farcaster
- ✅ Tip creators with USDC on Base network
- ✅ View follower and following counts
- ✅ Beautiful, responsive UI

## Setup for Farcaster Mini App

### 1. Deploy Your App

Deploy your Next.js app to a hosting service (Vercel, Netlify, etc.) and get your production URL.

### 2. Update Configuration

Update the following files with your production URL:

- `public/.well-known/warpcast.json` - Update the `action.url` field
- `pages/index.tsx` - Update Open Graph and Twitter meta tags URLs

### 3. Verify Configuration

Make sure these URLs are accessible:
- `https://your-domain.com/.well-known/warpcast.json`
- `https://your-domain.com/manifest.json`
- `https://your-domain.com/icon.png`

### 4. Submit to Farcaster

1. Go to [Farcaster Developer Portal](https://warpcast.com/~/developers)
2. Create a new app
3. Fill in the app details:
   - Name: Neynar Score
   - Description: Check your Neynar Score and Farcaster reputation
   - Icon: Upload your icon.png
   - URL: Your production URL
4. Submit for review

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file:

```
# Optional: Add any environment variables here
```

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Framer Motion
- Neynar API

## License

MIT

