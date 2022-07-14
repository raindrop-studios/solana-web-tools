import { LOCALHOST } from '@metaplex-foundation/amman';
import { Amman } from '@metaplex-foundation/amman-client';
import {
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import {
  CLI,
} from '@raindrop-studios/sol-command';

const { Connection, Transaction, SystemProgram } = web3;

async function createMint(
    connection,
    amman,
    [mintPubKey, mintPrivateKey]: [web3.PublicKey, web3.Keypair],
    [payerPubKey, payerPrivateKey]: [web3.PublicKey, web3.Keypair],
    decimals,
    label
  ) {
  if (await connection.getBalance(mintPubKey) > 0) {
    console.log(`Mint ${mintPubKey.toString()} is already created, skipping...`);
    return mintPubKey;
  }
  
  let tx = new Transaction().add(
    // create mint account
    SystemProgram.createAccount({
      fromPubkey: payerPubKey,
      newAccountPubkey: mintPubKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint account
    createInitializeMintInstruction(
      mintPubKey, // mint pubkey
      decimals,
      payerPubKey, // mint authority
      payerPubKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    )
  );

  const txAddr = await connection.sendTransaction(tx, [payerPrivateKey, mintPrivateKey]);
  await connection.confirmTransaction(
    txAddr
  );
  await amman.addr.addLabel(`tx-${label}`, txAddr);
  
  return mintPubKey;
};
 
CLI.programCommandWithArgs("init", [], async () => {
  const connection = new Connection(LOCALHOST);
  const amman = Amman.instance();

  const mintAuthority = await amman.loadOrGenKeypair('mint-authority');
  const [mintAuthorityPublicKey, mintAuthorityKeyPair] = mintAuthority;
  console.log("🪂 mintAuthority:", mintAuthorityPublicKey.toString());
  await amman.airdrop(connection, mintAuthorityPublicKey, 2);

  const [mintPubKey, mintKeyPair] = await amman.loadOrGenKeypair('mint');
  console.log("🏦 create mint:", mintPubKey.toString());
  await createMint(
    connection,
    amman,
    [mintPubKey, mintKeyPair],
    [mintAuthorityPublicKey, mintAuthorityKeyPair],
    5,
    'create-mint'
  );

  console.log("🎉 init success"); 
}, false);

CLI.Program.parseAsync(process.argv);
