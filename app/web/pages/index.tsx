import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head'

import Button from '../components/Button';

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Solana Web Tools</title>
        <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center px-6 text-center">
        <div className='mt-10 text-white'>
          <Link href="/spl-mint" passHref>
            <Button enabled={true} text={"Spl mint"} />
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
