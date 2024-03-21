"use client";

import * as token from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";
import { getTokenAccount, getTokenMint } from "@/atoms/token";
import { useState } from "react";

function MintToken() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey } = useWallet();

  const [amount, setAmount] = useState("");

  const [tokenMint] = useAtom(getTokenMint);
  const [tokenAccount] = useAtom(getTokenAccount);

  async function mintToTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!wallet || !publicKey || !tokenMint || !tokenAccount)
      throw new Error("Missing wallet or publicKey");

    if (isNaN(Number(amount))) throw new Error("Amount must be a number");

    const transaction = new web3.Transaction().add(
      token.createMintToInstruction(
        tokenMint,
        tokenAccount,
        publicKey,
        Number(amount),
      ),
    );

    await sendTransaction(transaction, connection);
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <form
        className="flex items-center gap-2 m-4 self-stretch"
        onSubmit={mintToTransaction}
      >
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          value={amount}
          placeholder="Number of Tokens to mint"
          onChange={(e) => setAmount(e.target.value)}
          className="border-2 border-black p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-300 p-2 rounded-md font-semibold"
        >
          Mint Token
        </button>
      </form>
    </div>
  );
}

export default MintToken;
