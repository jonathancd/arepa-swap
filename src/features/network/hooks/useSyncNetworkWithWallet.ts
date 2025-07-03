import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultNetworkByProtocol } from "@/features/protocols/utils/protocolsUtils";
import { findEvmNetworkByHex } from "@/features/protocols/evm/utils/evmNetworkUtils";

export function useSyncNetworkWithWallet() {
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();
  const { protocol } = useWalletStore();

  useEffect(() => {
    if (!selectedNetwork && protocol) {
      console.log("Set new default network");
      const defaultNetwork = getDefaultNetworkByProtocol(protocol);
      if (defaultNetwork) setSelectedNetwork(defaultNetwork);
    }

    const handleChainChanged = (chainId: string) => {
      const matched = findEvmNetworkByHex(chainId);
      if (matched) setSelectedNetwork(matched);
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [selectedNetwork, protocol]);
}
