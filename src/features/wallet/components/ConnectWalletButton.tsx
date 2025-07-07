"use client";

import { Button } from "@/components/ui/button";
import { WalletConnectModal } from "@/features/wallet/components/WalletConnectModal";
import { useState } from "react";

export function ConnectWalletButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-[var(--primary)] text-black hover:bg-[var(--primary-hover)] font-semibold"
      >
        Connect Wallet
      </Button>
      <WalletConnectModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
