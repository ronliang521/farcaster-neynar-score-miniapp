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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
