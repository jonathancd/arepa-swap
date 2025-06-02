import { useEffect } from "react";
import { useConnectorManager } from "./useConnectorManager";
import { EthereumAdapter } from "@/features/chains/adapters/EthereumAdapter";
import { BSCAdapter } from "@/features/chains/adapters/BSCAdapter";
import { switchToNetwork } from "../utils/switchToNetwork";

export function useSyncChainAdapter() {
  const {
    selectedChainId,
    setChainAdapter,
    isConnected,
    connectWallet,
    walletConnector,
  } = useConnectorManager();

  useEffect(() => {
    const sync = async () => {
      await switchToNetwork(selectedChainId);

      if (selectedChainId === 1) {
        setChainAdapter(new EthereumAdapter());
      } else if (selectedChainId === 56) {
        setChainAdapter(new BSCAdapter());
      } else {
        setChainAdapter(null);
      }

      if (isConnected && walletConnector) {
        await connectWallet();
      }
    };

    sync();
  }, [selectedChainId]);
}
