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

let endpoint = "https://ssc-dao.genesysgo.net/";

switch(environment) {
  case Environment.Localnet:
    endpoint = "http://127.0.0.1:8899";
    break;
  case Environment.Devnet:
    throw new Error("no endpoint set for devnet");
  default:
    break;
};

console.log(endpoint);

export const ENDPOINT = endpoint;
export const ENVIRONMENT = environment;
export const PROGRAM_CONNECTION = new web3.Connection(endpoint);
