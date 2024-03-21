"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DisplayBalance } from "@/components/DisplayBalance";

function Header() {
  return (
    <header>
      <WalletMultiButton />
      <DisplayBalance />
    </header>
  );
}

export default Header;
