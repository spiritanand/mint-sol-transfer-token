"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Header() {
  return (
    <header>
      <WalletMultiButton />
    </header>
  );
}

export default Header;
