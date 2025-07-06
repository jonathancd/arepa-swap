import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultNetworkByProtocol } from "@/features/protocols/utils/protocolsUtils";

export function useSyncNetworkWithWallet() {
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();
  const { connectedWallet, protocol } = useWalletStore();

  useEffect(() => {
    if (!selectedNetwork && protocol) {
      const defaultNetwork = getDefaultNetworkByProtocol(protocol);
      if (defaultNetwork) setSelectedNetwork(defaultNetwork);
    }

    const updateNetwork = async () => {
      const network = await connectedWallet?.getNetwork?.();
      if (network) setSelectedNetwork(network);
    };

    connectedWallet?.onChainChanged?.(() => {
      updateNetwork();
    });

    return () => {
      connectedWallet?.offListeners?.();
    };
  }, [selectedNetwork, protocol]);
}
