"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "../stores/walletStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ConnectWalletButton() {
  const { setIsConnectModalOpen } = useWalletStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Button
        onClick={() => setIsConnectModalOpen(true)}
        className="bg-primary text-black hover:bg-primary-hover font-semibold rounded-full"
      >
        {isMobile ? "Connect" : "Connect Wallet"}
      </Button>
    </>
  );
}
