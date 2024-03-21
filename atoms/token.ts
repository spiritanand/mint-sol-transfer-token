import { atom } from "jotai";
import { PublicKey } from "@solana/web3.js";

export const tokenMintAddress = atom<PublicKey | undefined>(undefined);
export const getTokenMint = atom((get) => get(tokenMintAddress));

export const tokenAccountAddress = atom<PublicKey | undefined>(undefined);
export const getTokenAccount = atom((get) => get(tokenAccountAddress));
