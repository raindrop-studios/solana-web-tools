import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

// import * as web3 from "@solana/web3.js";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Button from '../components/Button';

const removeMintAuthority = (mintAddress: string) => {

}

const removeUpdateAuthority = (mintAddress: string) => {

}

const SPLMint: NextPage = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction, signAllTransactions } = useWallet();
  const [mintAddress, setMintAddress] = useState("");

  let wallet_connected = !!publicKey; 

  useEffect(() => {
    console.log("public key", publicKey);
    if (publicKey && signTransaction && signAllTransactions) {
      console.log("wallet ready", publicKey);
    }
  }, [connection, publicKey]);

  return (
    <main className="flex w-screen flex-1 flex-col items-center px-6 text-center">
      <div className='flex flex-col items-center mt-10 text-white'>
        <WalletMultiButton />
        <div className="text-4xl w-screen font-bold mt-12 flex flex-col items-center justify-center py-2">
          SPL Mint Tools

          <label className="flex flex-col mt-28 ml-10 mr-10 text-3xl">
            Address of Mint
            <input 
              id="mintInput"
              value={mintAddress}
              style={{width: "600px" }}
              onChange={(event) => setMintAddress(event.target.value)
              }
              onKeyUp={(event) => {
                if (event.key === "Enter" && mintAddress.length === 44) {
                  removeMintAuthority(mintAddress)
                }
              }}
              className="mt-4 ml-20 mr-20 p-5 rounded-2xl text-black text-lg text-center font-serif"
            ></input>
          </label>
          <Button enabled={mintAddress.length === 44} text={"Click to remove mint authority"} onClick={() => removeMintAuthority(mintAddress) } classes={["w-96"]} />
          <Button enabled={mintAddress.length === 44} text={"Click to remove update authority"} onClick={() => removeUpdateAuthority(mintAddress) } classes={["mt-20", "w-96", "bg-red-600"]} />
        </div>
      </div>
    </main>
  )
};

export default SPLMint;