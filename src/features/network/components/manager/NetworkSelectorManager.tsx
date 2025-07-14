import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NetworkSelectorDrawer } from "../drawer/NetworkSelectorDrawer";
import { NetworkSelectorDialog } from "../modal/NetworkSelectorDialog";
import { useAvailableNetworks } from "../../hooks/useAvailableNetworks";
import { useNetworkStore } from "../../stores/networkStore";
import { INetwork } from "@/features/protocols/types/INetwork";
import { INetworkSelectorProps } from "../../types/INetworkSelector";
import { walletRegistry } from "@/features/wallet/registry/walletRegistry";

export function NetworkSelectorManager() {
  const wallets = walletRegistry.getAll();
  const networks: INetwork[] = useAvailableNetworks();
  const { isNetworkModalOpen, closeNetworkModal, setSelectedNetwork } =
    useNetworkStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSelect = async (networkId: number) => {
    const network: INetwork | undefined = networks.find(
      (n) => n.id === networkId
    );
    if (!network) return;

    const connected = wallets.find((w) => w.isAvailable());
    if (!connected) return;

    try {
      await connected.switchNetwork(network.chainIdHex);
      setSelectedNetwork(network);
      closeNetworkModal();
      console.log("Switched to:", network.name);
    } catch (err) {
      console.error("Failed to switch network", err);
    }
  };

  const sharedProps: INetworkSelectorProps = {
    isMobile,
    networks,
    open: isNetworkModalOpen,
    handleSelect,
    onOpenChange: closeNetworkModal,
  };

  return isMobile ? (
    <NetworkSelectorDrawer {...sharedProps} />
  ) : (
    <NetworkSelectorDialog {...sharedProps} />
  );
}
