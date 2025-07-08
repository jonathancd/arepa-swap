"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useWalletStore } from "@/features/wallet/stores/walletStore";

export function NetworkSelector() {
  const { account } = useWalletStore();
  const { selectedNetwork, openNetworkModal } = useNetworkStore();

  if (!account || !selectedNetwork) return;

  return (
    <Button
      onClick={openNetworkModal}
      variant="outline"
      className="flex items-center gap-2 cursor-pointer hover:opacity-[0.6]"
    >
      <Image
        src={selectedNetwork.icon}
        alt={selectedNetwork.name}
        width={20}
        height={20}
      />
      <span>{selectedNetwork.name}</span>
    </Button>
  );
}
