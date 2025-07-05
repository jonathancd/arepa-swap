"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnectModal } from "@/features/wallet/components/WalletConnectModal";
import { NetworkSelector } from "@/features/network/components/NetworkSelector";
import { WalletStatusPopover } from "@/features/wallet/components/WalletStatusPopover";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { account } = useWalletStore();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

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

        {/* <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/swap" className="hover:text-primary">
            Swap
          </Link>
          <Link href="/tokens" className="hover:text-primary">
            Tokens
          </Link>
          <Link href="/staking" className="hover:text-primary">
            Staking
          </Link>
        </div> */}

        <div className="flex items-center gap-4">
          <NetworkSelector />
          {account ? (
            <WalletStatusPopover />
          ) : (
            <>
              {/* <Button onClick={() => setModalOpen(true)} size="sm">
                Connect Wallet
              </Button> */}
              {/* <div className="bg-background text-text p-4 rounded-2xl shadow-card">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-primary hover:bg-primaryHover text-black font-semibold px-4 py-2 rounded-xl"
                >
                  Connect Wallet
                </button>
              </div> */}
              <div className="bg-[var(--background)] text-[var(--foreground)]">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black px-4 py-2 rounded-xl"
                >
                  Connect Wallet
                </button>
              </div>
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
