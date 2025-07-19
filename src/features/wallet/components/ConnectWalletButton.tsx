"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "../stores/walletStore";

export function ConnectWalletButton() {
  const { setIsConnectModalOpen } = useWalletStore();

  return (
    <>
      <Button
        onClick={() => setIsConnectModalOpen(true)}
        className="bg-primary text-black hover:bg-primary-hover font-semibold rounded-full"
      >
        Connect Wallet
      </Button>
    </>
  );
}
