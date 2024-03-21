"use client";

import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getTokenMint, tokenAccountAddress } from "@/atoms/token";
import { useAtom } from "jotai";

function CreateTokenAccount() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey } = useWallet();

  const [tokenAccount, setTokenAccount] = useAtom(tokenAccountAddress);
  const [tokenMint] = useAtom(getTokenMint);

  // creating the token account to hold the tokens generated from the mint above
  // here we are creating a program derived account aka an associated token account
  async function createAssociatedTokenAccount() {
    if (!wallet || !publicKey || !tokenMint)
      throw new Error("Missing wallet or publicKey");

    const associatedTokenAddress = await token.getAssociatedTokenAddress(
      tokenMint,
      publicKey,
    );

    try {
      const transaction = new web3.Transaction().add(
        token.createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          publicKey,
          tokenMint,
        ),
      );

      await sendTransaction(transaction, connection);
    } catch (e) {
      console.log("Account already exists");
    }

    setTokenAccount(associatedTokenAddress);

    return associatedTokenAddress;
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <button
        onClick={createAssociatedTokenAccount}
        className="bg-blue-300 p-2 rounded-md font-semibold"
      >
        Get Token Account
      </button>

      <form className="flex items-center gap-2 m-4 self-stretch">
        <label htmlFor="tokenAccount">Token Account</label>
        <input
          type="text"
          id="tokenAccount"
          defaultValue={tokenAccount?.toString()}
          onChange={(e) => setTokenAccount(new web3.PublicKey(e.target.value))}
          className="border-2 border-black p-2 flex-1"
        />
      </form>
    </div>
  );
}

export default CreateTokenAccount;
