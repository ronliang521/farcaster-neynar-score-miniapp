import Head from 'next/head';
import NeynarScoreMiniAppV5 from '../components/NeynarScoreMiniAppV5';

export default function Home() {
  return (
    <>
      <Head>
        <title>Neynar Score - Check Your Farcaster Reputation Score | Neynar</title>
        <meta name="description" content="Check your Neynar Score and Farcaster reputation. Discover your influence and engagement metrics on the Farcaster network powered by Neynar." />
        <meta name="keywords" content="Neynar, Farcaster, Score, Reputation, Social Graph, Web3" />
        <meta name="author" content="Neynar" />
        <link rel="icon" href="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://neynar.com/score" />
        <meta property="og:title" content="Neynar Score - Check Your Farcaster Reputation" />
        <meta property="og:description" content="Check your Neynar Score and Farcaster reputation. Discover your influence and engagement metrics." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://neynar.com/score" />
        <meta property="twitter:title" content="Neynar Score - Check Your Farcaster Reputation" />
        <meta property="twitter:description" content="Check your Neynar Score and Farcaster reputation. Discover your influence and engagement metrics." />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <NeynarScoreMiniAppV5 />
      </main>
    </>
  );
}
