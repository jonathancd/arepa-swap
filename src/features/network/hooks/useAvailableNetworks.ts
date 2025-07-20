import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { GlobalNetworkRegistry } from "@/features/protocols/constants/GlobalNetworkRegistry";
import { INetwork } from "@/features/protocols/types/INetwork";

export function useAvailableNetworks(): INetwork[] {
  const { protocol } = useWalletStore();
  const fallbackProtocol = protocol ?? "EVM";

  return GlobalNetworkRegistry.filter(
    (net) =>
      net.protocol.toLocaleLowerCase() === fallbackProtocol.toLocaleLowerCase()
  );
}
