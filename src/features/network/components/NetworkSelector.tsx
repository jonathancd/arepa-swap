"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { ChevronDown } from "lucide-react";

export function NetworkSelector() {
  const { account } = useWalletStore();
  const { selectedNetwork, openNetworkModal } = useNetworkStore();

  if (!account || !selectedNetwork) return;

  return (
    <Button
      onClick={openNetworkModal}
      variant="outline"
      className="h-[32px] pl-[36px] pr-[12px] relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
    >
      <div className="absolute left-0 w-[32px]">
        <Image
          src={selectedNetwork.icon}
          alt={selectedNetwork.name}
          width={100}
          height={20}
          className="rounded"
        />
      </div>
      <div className="hidden sm:inline-flex truncate">
        {selectedNetwork.name}
      </div>
      <div className="ml-auto text-white">
        <ChevronDown />
      </div>
    </Button>
  );
}
