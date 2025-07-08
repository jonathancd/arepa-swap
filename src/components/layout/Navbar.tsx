"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { LangDropdown } from "./LangDropdown";
import { MobileMenu } from "./MobileMenu";
import { NetworkSelector } from "@/features/network/components/NetworkSelector";
import { WalletConnectManager } from "@/features/wallet/components/WalletConnectManager";

export default function Navbar() {
  return (
    <header className="w-full border-b border-primary bg-surface">
      <nav className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-7xl mx-auto">
        {/* Logo / Title */}
        <Link
          href="/"
          className="text-lg font-bold text-primary hover:text-primary-hover"
        >
          ArepaSwap
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <ModeToggle />
          <LangDropdown />
          <NetworkSelector />
          <WalletConnectManager />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 md:hidden">
          <MobileMenu />
          <NetworkSelector />
          <WalletConnectManager />
        </div>
      </nav>
    </header>
  );
}
