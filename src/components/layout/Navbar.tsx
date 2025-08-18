"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { LangDropdown } from "./LangDropdown";
import { MobileMenu } from "./MobileMenu";
import { NetworkSelector } from "@/features/network/components/NetworkSelector";
import { WalletButtonManager } from "@/features/wallet/components/managers/WalletButtonManager";

export default function Navbar() {
  return (
    <header className="w-full border-b border-primary bg-surface">
      <nav className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-md font-logo font-bold text-primary hover:text-primary-hover"
        >
          ArepaSwap
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* <ModeToggle />
          <LangDropdown /> */}
          <NetworkSelector />
          <WalletButtonManager />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 md:hidden">
          <MobileMenu />
          <NetworkSelector />
          <WalletButtonManager />
        </div>
      </nav>
    </header>
  );
}
