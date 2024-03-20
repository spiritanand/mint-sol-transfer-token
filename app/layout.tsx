import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
// import WalletProviders from "./WalletProviders";

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
        <WalletProviders>
          <Header />
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
