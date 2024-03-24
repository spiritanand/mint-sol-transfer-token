"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Movie } from "@/models/Movie";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useState } from "react";

const MOVIE_REVIEW_PROGRAM_ID = "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";
const programId = new PublicKey(MOVIE_REVIEW_PROGRAM_ID);

function Page() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [movies, setMovies] = useState(Movie.mocks);

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const movieBuffer = movie.serialize();

    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(movie.title)],
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    );
    console.log({ pda: pda.toString() });

    const transaction = new Transaction();
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: movieBuffer,
      programId,
    });
    transaction.add(instruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
      );
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const movie = new Movie("2 States", 3.5, "Romantic");

    await handleTransactionSubmit(movie);
  };

  function getAllAcc() {
    connection.getProgramAccounts(programId).then((accounts) => {
      const fetchedMovies = accounts.map(({ pubkey, account }) => {
        return Movie.deserialize(account.data);
      });

      if (fetchedMovies)
        setMovies(fetchedMovies.filter((movie) => !!movie) as Movie[]);
    });
  }

  return (
    <>
      <button onClick={handleSubmit} style={{ display: "block" }}>
        Send Review
      </button>
      <button
        onClick={getAllAcc}
        style={{
          display: "block",
          margin: "auto",
        }}
      >
        Get All Acc
      </button>

      {movies.map((movie) => (
        <div
          key={`${movie.title}${movie.description}${movie.rating}`}
          style={{
            marginTop: "2rem",
            margin: "3rem",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {movie.title}
          </h2>
          <p
            style={{
              color: "gray",
              fontSize: "0.9rem",
            }}
          >
            {movie.description}
          </p>
          <p
            style={{
              color: (movie.rating ?? 0) > 3.5 ? "green" : "red",
            }}
          >
            Rating: {movie.rating}
          </p>
        </div>
      ))}
    </>
  );
}

export default Page;
