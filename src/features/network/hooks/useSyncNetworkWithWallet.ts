import { useEffect, useRef } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultNetworkByProtocol } from "@/features/protocols/utils/protocolsUtils";

export function useSyncNetworkWithWallet() {
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();
  const { connectedWallet, protocol } = useWalletStore();

  // Referencia al wallet anterior para evitar duplicar listeners
  const previousWalletRef = useRef<typeof connectedWallet | null>(null);

  useEffect(() => {
    console.log("useSyncNetworkWithWallet");
    if (!connectedWallet) return;

    // Si no hay red seleccionada, usamos la red por defecto del protocolo
    if (!selectedNetwork && protocol) {
      const defaultNetwork = getDefaultNetworkByProtocol(protocol);
      if (defaultNetwork) setSelectedNetwork(defaultNetwork);
    }

    const updateNetwork = async () => {
      const network = await connectedWallet.getNetwork?.();
      if (network) setSelectedNetwork(network);
    };

    const handler = () => updateNetwork();

    // Limpiamos el listener del wallet anterior antes de registrar uno nuevo
    previousWalletRef.current?.offListeners?.();
    connectedWallet.onChainChanged?.(handler);
    previousWalletRef.current = connectedWallet;

    return () => {
      connectedWallet?.offListeners?.();
    };
  }, [connectedWallet, selectedNetwork, protocol]);
}
