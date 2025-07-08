"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import Image from "next/image";
import { motion } from "framer-motion";

export function NetworkSelectorModal() {
  const networks = useAvailableNetworks();
  const { isNetworkModalOpen, setSelectedNetwork, closeNetworkModal } =
    useNetworkStore();
  const { account, wallets } = useWalletStore();

  if (!account || networks.length === 0) return null;
  // In React, it's idiomatic to let the component decide if it should render.
  // Returning `null` here prevents mounting the modal if there's no wallet or networks available.
  // This is equivalent to `v-if` in Vue, but keeps the responsibility inside the component.

  const handleSelect = async (networkId: number) => {
    const network = networks.find((n) => n.id === networkId);
    if (!network) return;

    const connected = wallets.find((w) => w.isAvailable());
    if (!connected) return;

    try {
      await connected.switchNetwork(network.chainIdHex);
      setSelectedNetwork(network);
      closeNetworkModal();
      console.log("Switched to:", network.name);
    } catch (err) {
      console.error("Failed to switch network", err);
    }
  };

  return (
    <Dialog open={isNetworkModalOpen} onOpenChange={closeNetworkModal}>
      <DialogContent className="max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Select a Network</h2>
        <div className="grid gap-2">
          {networks.map((net) => (
            <motion.button
              key={net.id}
              onClick={() => handleSelect(net.id)}
              className="flex items-center gap-3 p-3 rounded-lg border bg-surface hover:bg-muted transition-colors"
            >
              <Image src={net.icon} alt={net.name} width={24} height={24} />
              <span className="text-sm font-medium">{net.name}</span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
