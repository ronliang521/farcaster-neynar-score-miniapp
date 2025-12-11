import Head from 'next/head';
import NeynarScoreMiniAppV4 from '../components/NeynarScoreMiniAppV4';

export default function Home() {
  return (
    <>
      <Head>
        <title>Neynar Score Mini App</title>
        <meta name="description" content="Farcaster Neynar Score Mini App" />
        <link rel="icon" href="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* Farcaster Mini App Meta Tags - Required for embedded view */}
        <meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png","button":{"title":"Check Score Now","action":{"type":"launch_frame","name":"farcaster-neynar-score","url":"https://farcaster-neynar-score-miniapp.vercel.app/","splashImageUrl":"https://farcaster-neynar-score-miniapp.vercel.app/splash-screen-200-noalpha.png","splashBackgroundColor":"#9333ea"}}}' />
        {/* For backward compatibility */}
        <meta name="fc:frame" content='{"version":"1","imageUrl":"https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png","button":{"title":"Check Score Now","action":{"type":"launch_frame","name":"farcaster-neynar-score","url":"https://farcaster-neynar-score-miniapp.vercel.app/","splashImageUrl":"https://farcaster-neynar-score-miniapp.vercel.app/splash-screen-200-noalpha.png","splashBackgroundColor":"#9333ea"}}}' />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://farcaster-neynar-score-miniapp.vercel.app/" />
        <meta property="og:title" content="Neynar Score Checker - User" />
        <meta property="og:description" content="Quickly view Neynar Scores, engagement metrics, and identity insights for any Farcaster user." />
        <meta property="og:image" content="https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://farcaster-neynar-score-miniapp.vercel.app/" />
        <meta name="twitter:title" content="Neynar Score Checker - User" />
        <meta name="twitter:description" content="Quickly view Neynar Scores, engagement metrics, and identity insights for any Farcaster user." />
        <meta name="twitter:image" content="https://farcaster-neynar-score-miniapp.vercel.app/splash-screen.png" />
        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          body {
            background: linear-gradient(135deg, #1a0b2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7c3aed 100%);
            background-attachment: fixed;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          #__next {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}</style>
      </Head>

      <main style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7c3aed 100%)',
        backgroundAttachment: 'fixed',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <NeynarScoreMiniAppV4 />
      </main>
    </>
  );
}
