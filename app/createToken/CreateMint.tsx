"use client";

import * as token from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";
import { tokenMintAddress } from "@/atoms/token";

function CreateMint() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, publicKey } = useWallet();

  const [tokenMint, setTokenMint] = useAtom(tokenMintAddress);

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

    // creating the token mint
    await sendTransaction(transaction, connection, {
      signers: [tokenMintKeypair],
    });

    setTokenMint(tokenMintKeypair.publicKey);
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <button
        onClick={buildCreateMintTransaction}
        className="bg-blue-300 p-2 rounded-md font-semibold"
      >
        Create Token Mint
      </button>

      <form className="flex items-center gap-2 m-4 self-stretch">
        <label htmlFor="tokenMint">Token Mint Address</label>
        <input
          type="text"
          id="tokenMint"
          defaultValue={tokenMint?.toString()}
          onChange={(e) => setTokenMint(new web3.PublicKey(e.target.value))}
          className="border-2 border-black p-2 flex-1"
        />
      </form>
    </div>
  );
}

export default CreateMint;
