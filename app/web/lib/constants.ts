import * as web3 from '@solana/web3.js';

enum Environment {
  Localnet = "localnet",
  Devnet = "devnet",
  Mainnet = "mainnet",
}

let environment: string = Environment.Localnet;

switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
  case "production":
    environment = Environment.Mainnet;
    break;
  case "preview":
    environment = Environment.Mainnet;
    break;
  default:
    environment = process.env.NEXT_PUBLIC_SOLANA_ENV ? process.env.NEXT_PUBLIC_SOLANA_ENV : environment;
}

console.log(environment)

let walletPubKey, programConnection;
let endpoint = "https://ssc-dao.genesysgo.net/";
let rainMint = new web3.PublicKey("rainH85N1vCoerCi4cQ3w6mCf7oYUdrsTFtFzpaRwjL");

switch(environment) {
  case Environment.Localnet:
    endpoint = "http://127.0.0.1:8899";

    if (process.env.NEXT_PUBLIC_RAIN_MINT) {
      rainMint = new web3.PublicKey(process.env.NEXT_PUBLIC_RAIN_MINT);
    }

    if (process.env.NEXT_PUBLIC_TEST_WALLET_PUBKEY) {
      walletPubKey = new web3.PublicKey(process.env.NEXT_PUBLIC_TEST_WALLET_PUBKEY);
    }
    break;
  case Environment.Devnet:
    throw new Error("no endpoint set for devnet");
  default:
    break;
};

console.log(endpoint);

programConnection = new web3.Connection(endpoint);
  
export const RAIN_MINT = rainMint;
export const WALLET_PUBKEY = walletPubKey;
export const PROGRAM_CONNECTION = programConnection;
export const ENDPOINT = endpoint;
export const ENVIRONMENT = environment;
