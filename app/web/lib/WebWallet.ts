// import * as Anchor from "@project-serum/anchor";
import * as Web3 from '@solana/web3.js';

export default class WebWallet { //implements Anchor.Wallet {
  _signTransaction: (transaction: Web3.Transaction) => Promise<Web3.Transaction>;
  _signAllTransactions: (transaction: Web3.Transaction[]) => Promise<Web3.Transaction[]>;
  sendTransaction: (transaction: Web3.Transaction, connection: Web3.Connection, options?: any) => Promise<string>;
  _publicKey: Web3.PublicKey;
  payer: Web3.Keypair;

  static fakeWallet() {
    return new WebWallet(
      Web3.PublicKey.default,
      (transaction: Web3.Transaction) => {return Promise.resolve(new Web3.Transaction())},
      (transaction: Web3.Transaction[]) => {return Promise.resolve([new Web3.Transaction()])},
      () => {},
    )
  }

  constructor(
    publicKey: Web3.PublicKey,
    signTransaction: (transaction: Web3.Transaction) => Promise<Web3.Transaction>,
    signAllTransactions: (transaction: Web3.Transaction[]) => Promise<Web3.Transaction[]>,
    sendTransaction: any
  ) {
    this._publicKey = publicKey;
    this._signTransaction = signTransaction;
    this._signAllTransactions = signAllTransactions;
    this.sendTransaction = sendTransaction;
    this.payer = new Web3.Keypair(); 
  }

  async signTransaction(tx: Web3.Transaction): Promise<Web3.Transaction> {
    return this._signTransaction(tx);
  }

  async signAllTransactions(txs: Web3.Transaction[]): Promise<Web3.Transaction[]> {
    return this._signAllTransactions(txs);
  }

  get publicKey(): Web3.PublicKey {
    return this._publicKey;
  }
}
