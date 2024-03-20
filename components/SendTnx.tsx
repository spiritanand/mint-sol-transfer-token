"use client";

import { FormEvent, useState } from "react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function SendTnx() {
  const [value, setValue] = useState(0);
  const [recAddress, setRecAddress] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  async function handleSendSol(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!publicKey || !connection) {
      console.log("Wallet not connected");
      return;
    }

    if (!value || value <= 0 || isNaN(value)) {
      console.log("Invalid value");
      return;
    }

    if (!recAddress) {
      console.log("Invalid recipient address");
      return;
    }

    const transaction = new web3.Transaction();
    const recipientPubKey = new web3.PublicKey(recAddress);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * value,
    });

    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
    });
  }

  return (
    <form onSubmit={handleSendSol} className="flex flex-col">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="border border-black"
      />
      <textarea
        value={recAddress}
        onChange={(e) => setRecAddress(e.target.value)}
        className="border border-black"
      />
      <button type="submit">SEND</button>
    </form>
  );
}

export default SendTnx;
