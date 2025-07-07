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
        className="bg-primary text-black hover:bg-primary-hover font-semibold"
      >
        Connect Wallet
      </Button>
      <WalletConnectModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
