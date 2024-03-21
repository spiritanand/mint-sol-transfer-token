"use client";

import * as token from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function CreateMint() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey } = useWallet();

  // creating the mint (account)
  // A Token Mint is the account that holds data about a specific token
  async function buildCreateMintTransaction() {
    if (!connection || !wallet || !publicKey)
      throw new Error("Missing connection or wallet");

    const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
    const tokenMintKeypair = web3.Keypair.generate();
    const programId = token.TOKEN_PROGRAM_ID;

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: tokenMintKeypair.publicKey,
        space: token.MINT_SIZE,
        lamports,
        programId,
      }),
      token.createInitializeMintInstruction(
        tokenMintKeypair.publicKey,
        0,
        publicKey,
        publicKey,
        programId,
      ),
    );

    const tokenMint = await sendTransaction(transaction, connection, {
      signers: [tokenMintKeypair],
    });

    console.log({ tokenMint });

    // const associatedTokenAddress =
    //   await buildCreateAssociatedTokenAccountTransaction(
    //     tokenMintKeypair.publicKey,
    //     publicKey,
    //   );
    //
    // await buildMintToTransaction(
    //   tokenMintKeypair.publicKey,
    //   100,
    //   associatedTokenAddress,
    // );

    // const destination = await buildCreateAssociatedTokenAccountTransaction(
    //   tokenMintKeypair.publicKey,
    //   new PublicKey("C8twmXGV6BFerUbV5kK6uBsxboeR3qXDzjFUJyKdZMc6"),
    // );
    //
    // console.log({ destination });

    // await buildTransferTransaction(associatedTokenAddress, destination, 25);
  }

  // creating the token account to hold the tokens generated from the mint above
  // here we are creating a program derived account aka an associated token account
  async function buildCreateAssociatedTokenAccountTransaction(
    mint: web3.PublicKey,
    owner: web3.PublicKey,
  ) {
    if (!wallet) throw new Error("Missing wallet or publicKey");

    const associatedTokenAddress = await token.getAssociatedTokenAddress(
      mint,
      owner,
    );

    const transaction = new web3.Transaction().add(
      token.createAssociatedTokenAccountInstruction(
        owner,
        associatedTokenAddress,
        owner,
        mint,
      ),
    );

    await sendTransaction(transaction, connection);

    return associatedTokenAddress;
  }

  async function buildMintToTransaction(
    mint: web3.PublicKey,
    amount: number,
    tokenAccount: web3.PublicKey,
  ) {
    if (!wallet || !publicKey) throw new Error("Missing wallet or publicKey");

    const transaction = new web3.Transaction().add(
      token.createMintToInstruction(mint, tokenAccount, publicKey, amount),
    );

    await sendTransaction(transaction, connection);
  }

  async function buildTransferTransaction(
    tokenAccount: web3.PublicKey,
    destination: web3.PublicKey,
    amount: number,
  ) {
    if (!wallet || !publicKey) throw new Error("Missing wallet or publicKey");

    const transaction = new web3.Transaction().add(
      token.createTransferInstruction(
        tokenAccount,
        destination,
        publicKey,
        amount,
      ),
    );

    const transferSig = await sendTransaction(transaction, connection);

    console.log({ transferSig });
  }

  return (
    <div>
      <button onClick={buildCreateMintTransaction}>HI</button>
    </div>
  );
}

export default CreateMint;
