import { atom } from "jotai";

export const tokenMint = atom("");
export const readOnlyAtom = atom((get) => get(tokenMint));
