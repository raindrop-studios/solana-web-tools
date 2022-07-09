import type { NextPage } from 'next'
import Link from 'next/link';
import Head from 'next/head'

import Button from '../components/Button';

const Home: NextPage = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <Head>
        <title>Solana Tools</title>
        <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
      </Head>

      <main className="flex w-full flex-col items-center p-6 text-center text-white font-bold">
        <h1 className='mt-12 text-7xl'>Solana Tools</h1>
        <div className='mt-10'>
          <Link href="/spl-mint" passHref>
            <Button enabled={true} text={"Spl Mint"} classes={["text-xl", "font-semibold", "w-96"]} />
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
