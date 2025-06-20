"use client";

import { useEffect } from "react";
import { MetaMaskConnector } from "@/features/wallet/services/MetaMaskConnector";
import { useWalletStore } from "@/features/wallet/hooks/useWalletStore";

import Link from "next/link";
import { WalletConnectButton } from "../ui/WalletConnectButton";

import { ChainSelector } from "@/features/chains/components/ChainSelector";
import { WalletSelector } from "@/features/wallet/components/WalletSelector";

export function Navbar() {
  const { setWalletConnector } = useWalletStore();

  // useEffect(() => {
  //   console.log("useEffect in Navbar");
  //   const connector = new MetaMaskConnector();

  //   if (connector.isPreviouslyConnected()) {
  //     setWalletConnector(connector);
  //     useWalletStore.getState().connectWallet(); // delegar todo
  //   }
  // }, [setWalletConnector]);

  useEffect(() => {
    console.log("useEffect in Navbar");
    const connector = new MetaMaskConnector();

    if (connector.isPreviouslyConnected()) {
      setWalletConnector(connector);
      // Delega al hook useEffect en WalletPage que llama connectWallet
    }
  }, [setWalletConnector]);

  return (
    <header className="w-full border-b bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="bg-red-500 text-3xl font-bold">Navbar</div>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Arepa Swap
          </Link>
          <Link href="/wallet" className="hover:underline">
            Wallet
          </Link>
          <Link href="/swap" className="hover:underline">
            Swap
          </Link>
          <Link href="/tokens" className="hover:underline">
            Tokens
          </Link>
          <Link href="/staking" className="hover:underline bg-blue-600">
            Staking
          </Link>
        </div>
        <div className="flex gap-4">
          {/* <WalletConnectButton /> */}
          <ChainSelector />
          <WalletSelector />
        </div>
      </nav>
    </header>
  );
}
