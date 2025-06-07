import { useEffect } from "react";
import { useWalletStore } from "./useWalletStore";
import { CHAIN_REGISTRY } from "@/features/chains/registry/chainRegistry";

export function useSyncChainAdapter() {
  const { selectedChainId, setChainAdapter } = useWalletStore();

  useEffect(() => {
    console.log("aja en useSynchChainAdapter...");
    const adapterFactory = CHAIN_REGISTRY[selectedChainId]?.adapter;

    if (adapterFactory) {
      setChainAdapter(adapterFactory());
    } else {
      console.log("No adapter registered for selected chain", selectedChainId);
    }
  }, [selectedChainId, setChainAdapter]);
}
