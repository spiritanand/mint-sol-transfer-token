import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletProviders = dynamic(() => import("@/app/WalletProviders"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOL Client Basics",
  description: "Why not SOLve?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
