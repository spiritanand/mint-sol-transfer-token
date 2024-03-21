"use client";

import * as web3 from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";
import { getTokenAccount, getTokenMint } from "@/atoms/token";
import { FormEvent, useState } from "react";
import * as token from "@solana/spl-token";

function TransferToken() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey, signTransaction } = useWallet();

  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  const [tokenMint] = useAtom(getTokenMint);
  const [tokenAccount] = useAtom(getTokenAccount);

  async function buildTransferTransaction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!wallet || !publicKey || !tokenMint || !tokenAccount)
      throw new Error("Missing wallet or publicKey");

    if (isNaN(Number(amount))) throw new Error("Amount must be a number");

    const destination = new PublicKey(receiver);

    const destinationTokenAccount = await token.getAssociatedTokenAddress(
      tokenMint,
      destination,
    );

    const transaction = new web3.Transaction().add(
      token.createAssociatedTokenAccountInstruction(
        publicKey,
        destinationTokenAccount,
        destination,
        tokenMint,
      ),
      token.createTransferInstruction(
        tokenAccount,
        destinationTokenAccount,
        publicKey,
        Number(amount),
      ),
    );

    const transferSig = await sendTransaction(transaction, connection);

    console.log({ transferSig });
  }

  return (
    <div>
      <form
        className="flex flex-col gap-6 m-4"
        onSubmit={buildTransferTransaction}
      >
        <div>
          <label htmlFor="publicKey">Receiver Public Key</label>
          <input
            type="text"
            id="publicKey"
            value={receiver}
            placeholder="Receiver's Public Key"
            onChange={(e) => setReceiver(e.target.value)}
            className="border-2 border-black p-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="text"
            id="amount"
            value={amount}
            placeholder="Number of Tokens to mint"
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-black p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-300 p-2 rounded-md font-semibold self-center"
        >
          Transfer Token
        </button>
        <span className="-mt-4 text-gray-500">
          Note: This will create token account for your friend (you will pay SOL
          to create account)
        </span>
      </form>
    </div>
  );
}

export default TransferToken;
