import { useEffect } from "react";
import { useConnectorManager } from "./useConnectorManager";
import { EthereumAdapter } from "@/features/chains/adapters/EthereumAdapter";
import { BSCAdapter } from "@/features/chains/adapters/BSCAdapter";

export function useEthereumEvents() {
  const { account, isConnected, setSelectedChainId, setChainAdapter } =
    useConnectorManager();

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleChainChanged = async (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      console.log("MetaMask manually changed to chaing: ", newChainId);

      setSelectedChainId(newChainId);

      if (newChainId === 1) {
        setChainAdapter(new EthereumAdapter());
      } else if (newChainId === 56) {
        setChainAdapter(new BSCAdapter());
      } else {
        console.log("No adapter configured for this chain: ", newChainId);
        setChainAdapter(null);
      }

      // we can reset the account for security reassons
      if (!account || !isConnected) return;

      // MetaMask should keep the connection, we can keep showing the data
    };

    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, isConnected, setChainAdapter, setSelectedChainId]);
}
