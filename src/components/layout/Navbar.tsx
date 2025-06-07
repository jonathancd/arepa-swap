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

  const { account, wallets, disconnectWallet, setAccount, setBalance } =
    useWalletStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    const fetchAccountInfo = async () => {
      console.log("accountsChanged o chainChanged");
      const connected = wallets.find((w) => w.isAvailable());
      if (connected && window.ethereum) {
        const acc = await connected.getAccount();
        const provider = new BrowserProvider(window.ethereum);
        const bal = acc ? await provider.getBalance(acc) : null;
        // setAccount(acc);
        console.log({ account, acc });
        if (account !== acc) {
          setAccount(acc);
        }

        setBalance(bal ? parseFloat(formatEther(bal)).toFixed(4) : null);
      } else {
        disconnectWallet();
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
  }, [wallets, disconnectWallet, setAccount, setBalance]);

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
