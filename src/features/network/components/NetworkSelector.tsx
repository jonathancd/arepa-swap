"use client";

import {
  getSupportedNetworks,
  findNetworkById,
  findNetworkByHex,
} from "../lib/NetworkRegistry";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { fetchNetworkTokens } from "@/features/wallet/utils/fetchNetworkTokens";

export function NetworkSelector() {
  const networks = getSupportedNetworks();
  const defaultNetwork = networks[0]; // Ethereum by default
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();

  const { account, wallets, setNetworkTokenBalances } = useWalletStore();

  useEffect(() => {
    setSelectedNetwork(defaultNetwork);

    const handleChainChanged = (chainId: string) => {
      const matched = findNetworkByHex(chainId);
      if (matched) setSelectedNetwork(matched);
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account && selectedNetwork) {
      fetchNetworkTokens(account, selectedNetwork.id.toString()).then(
        setNetworkTokenBalances
      );
    }
  }, [account, selectedNetwork]);

  const handleSelect = async (networkId: number) => {
    const network = findNetworkById(networkId);
    if (!network) return;

    const connected = wallets.find((w) => w.isAvailable());
    if (!connected) return;

    try {
      await connected.switchNetwork(network.chainIdHex);
      setSelectedNetwork(network);
      console.log("Switched to:", network.name);
    } catch (err) {
      console.error("Failed to switch network", err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedNetwork && (
            <>
              <Image
                src={selectedNetwork.icon}
                alt={selectedNetwork.name}
                width={20}
                height={20}
              />
              <span>{selectedNetwork.name}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          {networks.map((net) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={net.id}
              onClick={() => handleSelect(net.id)}
              className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-muted"
            >
              <Image src={net.icon} alt={net.name} width={20} height={20} />
              <span>{net.name}</span>
            </motion.div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
