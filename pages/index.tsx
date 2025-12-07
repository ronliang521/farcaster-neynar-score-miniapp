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
      </Head>

      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <NeynarScoreMiniAppV4 />
      </main>
    </>
  );
}
