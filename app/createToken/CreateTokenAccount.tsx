import web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function CreateTokenAccount() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey } = useWallet();

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

  return <div></div>;
}

export default CreateTokenAccount;
