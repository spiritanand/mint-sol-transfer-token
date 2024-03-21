"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export const DisplayBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed",
    );

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info?.lamports);
    });
  }, [connection, publicKey]);

  return (
    <p className="text-xs">
      {publicKey && balance && balance >= 0
        ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL`
        : ""}
    </p>
  );
};
