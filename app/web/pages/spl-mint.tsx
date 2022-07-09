import type { NextPage } from 'next'
import { useEffect, useState, Dispatch, SetStateAction } from 'react';

import * as SolKit from "@raindrops-protocol/sol-kit";
import * as web3 from "@solana/web3.js";
import {
  AuthorityType,
  createCloseAccountInstruction,
  createInitializeMintInstruction,
  createSetAuthorityInstruction,
  getMinimumBalanceForRentExemptMint,
  getMint,
  Mint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SendTransactionOptions } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet, WalletContext } from '@solana/wallet-adapter-react';

import Button from '../components/Button';
import Loading from '../components/Loading';
import MintInfo from '../components/MintInfo';

const _removeMintAuthority = (
  walletContext: WalletContext,
  mintAddress: web3.PublicKey,
  setMint: Dispatch<SetStateAction<Mint>>,
  setError: Dispatch<SetStateAction<string>>,
) => {
  console.log("removeMintAuthority");
  return _updateAuthority(
    walletContext,
    mintAddress,
    setMint,
    AuthorityType.MintTokens,
    null,
    setError,
  );
}

async function _removeFreezeAuthority(
  walletContext: WalletContext,
  mintAddress: web3.PublicKey,
  setMint: Dispatch<SetStateAction<Mint>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  console.log("removeFreezeAuthority");
  return _updateAuthority(
    walletContext,
    mintAddress,
    setMint,
    AuthorityType.FreezeAccount,
    null,
    setError,
  );
}

async function _updateAuthority(
  walletContext: WalletContext,
  mintAddress: web3.PublicKey,
  setMint: Dispatch<SetStateAction<Mint>>,
  authorityType: AuthorityType,
  newAuth: web3.PublicKey | null,
  setError: Dispatch<SetStateAction<string>>,
) {
  const { connection, signTransaction } = walletContext;
  const walletPublicKey = walletContext.publicKey;

  let tx = new web3.Transaction().add(
    // init mint account
    createSetAuthorityInstruction(
      mintAddress,
      walletPublicKey, // current auth
      authorityType, // authority type
      newAuth,  // new auth (you can pass `null` to close it)
    )
  );

  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  try {
    await SolKit.Transaction.sendSignedTransaction({
      signedTransaction: await signTransaction(tx),
      connection,
      timeout: 30_000,
      commitment: "finalized"
    });
  } catch (error: any) {
    setError(`Error updating authority on mint '${error}'`);
    return;
  }

  console.log(`Updated mint with address ${mintAddress}`)
  await fetchMint(connection, mintAddress, setMint, setError);
  return mintAddress;
}

async function _createMint(
  walletContext: WalletContext,
  decimals: number,
  setMint: Dispatch<SetStateAction<Mint>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  const { connection, signTransaction } = walletContext;
  const walletPublicKey = walletContext.publicKey;

  const mintKeyPair = web3.Keypair.generate();
  const mintAddress = mintKeyPair.publicKey;

  let tx = new web3.Transaction().add(
    // create mint account
    web3.SystemProgram.createAccount({
      fromPubkey: walletPublicKey,
      newAccountPubkey: mintAddress,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint account
    createInitializeMintInstruction(
      mintAddress,     // mint pubkey
      decimals,               // decimals
      walletPublicKey, // mint authority
      walletPublicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    )
  );

  tx.feePayer = walletPublicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.partialSign(mintKeyPair);

  try {
    await SolKit.Transaction.sendSignedTransaction({
      signedTransaction: await signTransaction(tx),
      connection,
      timeout: 30_000,
      commitment: "finalized"
    });
  } catch (error: any) {
    setError(`Error creating mint '${error}'`);
    return;
  }

  console.log(`Created mint with address ${mintAddress}`)
  await fetchMint(connection, mintAddress, setMint, setError);
  return mintAddress;
};

async function fetchMint(
  connection: web3.Connection,
  mintAddress: web3.PublicKey,
  setMint: Dispatch<SetStateAction<Mint>>,
  setError: Dispatch<SetStateAction<string>>,
): Promise<void> {
  try {
    const mint = await getMint(connection, mintAddress);
    setMint(mint);
    setError("")
  } catch (error) {
    setMint({} as Mint);
    setError(`Error fetching entered mint ${error}`);
  }
}

type WalletContext =  {
  publicKey: web3.PublicKey,
  connection: web3.Connection,
  signTransaction: (transaction: web3.Transaction) => Promise<web3.Transaction>,
};

const SPLMint: NextPage = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [ mintAddress, setMintAddress ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ errorText, setErrorText ] = useState("");
  const [ createdErrorText, setCreatedErrorText ] = useState("");
  const [ updatedErrorText, setUpdatedErrorText ] = useState("");
  const [ createdMint, setCreatedMint ] = useState({} as Mint);
  const [ fetchedMint, setFetchedMint ] = useState({} as Mint);

  let wallet_connected = !!publicKey; 
  let mintAddressValid = mintAddress.length >= 43;
  let mintActionEnabled = wallet_connected && mintAddressValid;

  const walletContext = {
    publicKey,
    connection,
    signTransaction,
    sendTransaction,
  } as WalletContext;

  let mintAddressPubKey: web3.PublicKey;
  if (mintAddressValid) {
    mintAddressPubKey = new web3.PublicKey(mintAddress);
  }

  useEffect(() => {
    console.log("public key", publicKey);
    if (publicKey && connection && signTransaction) {
      console.log("wallet ready", publicKey);
    }
    setErrorText("")
  }, [connection, publicKey]);

  useEffect(() => {
    if (mintAddressValid) {
      fetchMint(connection, mintAddressPubKey, setFetchedMint, setUpdatedErrorText);
    } else {
      setFetchedMint({} as Mint);
      setUpdatedErrorText("")
    }
  }, [mintAddress])

  if (loading) {
    return (
      <main className="flex w-screen h-screen items-center justify-center px-6 text-center">
        <div className='flex items-center mt-10 text-white'>
          <Loading />
        </div>
      </main>
    )
  }

  if (!wallet_connected) {
    return (
      <main className="flex flex-col w-full h-full items-center justify-center p-6 text-center font-bold text-white">
        <h1 className="text-7xl mt-12">SPL Mint</h1>
        <div className='flex mt-10 items-center text-white'>
          <WalletMultiButton />
        </div>
      </main>
    );
  }

  const createMint = async () => {
    const decimals = prompt("How many decimals?");
    if (!decimals) {
      return;
    }
    setLoading(true);
    await _createMint(walletContext, parseInt(decimals), setCreatedMint, setCreatedErrorText)
    setLoading(false);
  };
  const removeMintAuthority = async () => {
    setLoading(true);
    await _removeMintAuthority(walletContext, mintAddressPubKey, setFetchedMint, setUpdatedErrorText);
    setLoading(false);
  };
  const removeFreezeAuthority = async () => {
    setLoading(true);
    await _removeFreezeAuthority(walletContext, mintAddressPubKey, setFetchedMint, setUpdatedErrorText);
    setLoading(false);
  };

  return (
    <main className="flex w-full flex-col items-center p-6 text-center">
      <div className='flex flex-col items-center text-white'>
        <div className="w-full font-bold mt-12 flex flex-col items-center justify-center">
          <h1 className="text-7xl font-bold">SPL Mint</h1>
          {errorText.length > 0 && (<h2 className="text-red-600 mt-4">{errorText}</h2>)}
          <div className='mt-10'>
            <WalletMultiButton />
          </div>

          <div className="mt-28 ring-white ring-2 rounded-2xl p-6">
            <div className='flex flex-col gap-y-10 pb-4 items-center'>
              <h2 className="text-5xl">Create Mint</h2>
              {createdErrorText.length > 0 && (<h3 className="text-red-600 mt-4">{createdErrorText}</h3>)}
              <Button
                enabled={wallet_connected}
                text={"Create"}
                onClick={createMint}
                classes={["w-96"]}
              />
              {createdMint && (<MintInfo mintInfo={createdMint} />)}
            </div>
          </div>

          <div className="flex flex-col ml-4 max-w-sm sm:max-w-md md:max-w-none items-center mt-28 ring-white ring-2 rounded-2xl p-12">
            <h2 className="text-5xl">Update Mint</h2>
            {updatedErrorText.length > 0 && (<h3 className="text-red-600 mt-4">{updatedErrorText}</h3>)}
            <label className="flex flex-col w-full mt-10 text-3xl">
              Address of Mint
              <input 
                id="mintInput"
                value={mintAddress}
                // style={{width: "640px"}}
                onChange={(event) => {
                  setMintAddress(event.target.value)
                }}
                className="mt-4 p-5 w-fill md:w-fill rounded-2xl text-black text-lg text-center font-serif"
              ></input>
            </label>
            { fetchedMint.address && (
              <div className="mt-20 max-w-sm md:max-w-none">
                <MintInfo mintInfo={fetchedMint} />
              </div>
            ) }
            <div className="flex gap-x-16 items-center justify-center">
              <Button
                enabled={mintActionEnabled}
                text={"Remove freeze authority"}
                onClick={removeFreezeAuthority}
                classes={["mt-20", "w-auto", "bg-red-600"]}
              />
              <Button
                enabled={mintActionEnabled}
                text={"Remove mint authority"}
                onClick={removeMintAuthority}
                classes={["mt-20", "w-auto", "bg-red-600"]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
};

export default SPLMint;