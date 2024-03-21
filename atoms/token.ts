import { atom } from "jotai";
import { PublicKey } from "@solana/web3.js";

export const tokenMintAddress = atom<PublicKey | undefined>(undefined);
export const readOnlyAtom = atom((get) => get(tokenMintAddress));
