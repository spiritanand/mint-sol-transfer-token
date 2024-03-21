"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { DisplayBalance } from "@/components/DisplayBalance";

function Header() {
  return (
    <header className="p-4 border-b border-gray-300 mb-8">
      <nav className="flex justify-between list-none">
        <li className="font-black text-5xl">
          <span className="bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-600 text-transparent mr-2 p-1">
            SOL
          </span>
          Token Minter
        </li>
        <li className="flex flex-col items-center">
          <WalletMultiButton />
          <DisplayBalance />
        </li>
      </nav>
    </header>
  );
}

export default Header;
