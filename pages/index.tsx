import Head from 'next/head';
import NeynarScoreMiniAppV4 from '../components/NeynarScoreMiniAppV4';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Neynar Score Mini App</title>
        <meta name="description" content="Farcaster Neynar Score Mini App" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <main>
        <h1>Welcome to Neynar Score Mini App</h1>
        <NeynarScoreMiniAppV4 />
      </main>
    </div>
  );
}
