import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultNetworkByProtocol } from "@/features/protocols/utils/protocolsUtils";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { useInitializationStore } from "@/stores/initializationStore";

export function useDefaultNetwork() {
  const { protocol, connectedWallet } = useWalletStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();
  const { setNetworkInitialized } = useInitializationStore();

  useEffect(() => {
    // Solo establecer red por defecto si no hay wallet conectado y no hay red seleccionada
    if (!connectedWallet && !selectedNetwork) {
      const proto = protocol ?? Protocol.EVM;
      const defaultNetwork = getDefaultNetworkByProtocol(proto);
      if (defaultNetwork) {
        setSelectedNetwork(defaultNetwork);
      }
    }

    if (selectedNetwork) {
      setNetworkInitialized();
    }
  }, [
    connectedWallet,
    selectedNetwork,
    protocol,
    setSelectedNetwork,
    setNetworkInitialized,
  ]);
}
