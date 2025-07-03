"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnectModal } from "@/features/wallet/components/WalletConnectModal";
import { NetworkSelector } from "@/features/network/components/NetworkSelector";
import { WalletStatusPopover } from "@/features/wallet/components/WalletStatusPopover";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { BrowserProvider, formatEther } from "ethers";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { account, wallets, setAccount, setBalance, setProtocol } =
    useWalletStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    console.log("entra en el useEffect");
    const lastProvider = localStorage.getItem("wallet-provider");
    if (!lastProvider) return;

    const connected = wallets.find(
      (w) => w.id === lastProvider && w.isAvailable()
    );
    if (!connected) return;

    const fetchAccountInfo = async () => {
      if (window.ethereum) {
        const acc = await connected.getAccount();
        const provider = new BrowserProvider(window.ethereum);
        const bal = acc ? await provider.getBalance(acc) : null;

        setAccount(acc);
        setBalance(bal ? parseFloat(formatEther(bal)).toFixed(4) : null);
        setProtocol(connected.protocol);
      }
    };

    fetchAccountInfo();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", fetchAccountInfo);
      window.ethereum.on("chainChanged", fetchAccountInfo);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", fetchAccountInfo);
        window.ethereum.removeListener("chainChanged", fetchAccountInfo);
      }
    };
  }, [wallets]); // los metodos del store no cambian de referencia asi que no es necesario colocarlos como dependencias.
  // en desarrollo el useEffect se dispara dos veces.

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur shadow-md" : "bg-background"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="text-2xl font-bold tracking-tight text-primary">
          ArepaSwap
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/swap" className="hover:text-primary">
            Swap
          </Link>
          <Link href="/tokens" className="hover:text-primary">
            Tokens
          </Link>
          <Link href="/staking" className="hover:text-primary">
            Staking
          </Link>
          <Link href="/tools/security-check" className="hover:text-primary">
            Security
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NetworkSelector />
          {account ? (
            <WalletStatusPopover />
          ) : (
            <>
              <Button onClick={() => setModalOpen(true)} size="sm">
                Connect Wallet
              </Button>
              <WalletConnectModal
                open={modalOpen}
                onOpenChange={setModalOpen}
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
