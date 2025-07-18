import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultNetworkByProtocol } from "@/features/protocols/utils/protocolsUtils";
import { Protocol } from "@/features/protocols/constants/Protocol";

export function useDefaultNetwork() {
  const { protocol, connectedWallet } = useWalletStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();

  useEffect(() => {
    if (!connectedWallet && !selectedNetwork) {
      const proto = protocol ?? Protocol.EVM;
      const defaultNetwork = getDefaultNetworkByProtocol(proto);
      if (defaultNetwork) setSelectedNetwork(defaultNetwork);
    }
  }, [connectedWallet, selectedNetwork, protocol, setSelectedNetwork]);
}
