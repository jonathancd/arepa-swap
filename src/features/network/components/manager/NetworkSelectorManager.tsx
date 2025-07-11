import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NetworkSelectorDrawer } from "../drawer/NetworkSelectorDrawer";
import { NetworkSelectorDialog } from "../modal/NetworkSelectorDialog";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useAvailableNetworks } from "../../hooks/useAvailableNetworks";
import { useNetworkStore } from "../../stores/networkStore";
import { INetwork } from "@/features/protocols/types/INetwork";
import { INetworkSelectorProps } from "../../types/INetworkSelector";

export function NetworkSelectorManager() {
  const networks: INetwork[] = useAvailableNetworks();
  const { account, wallets } = useWalletStore();
  const { isNetworkModalOpen, closeNetworkModal, setSelectedNetwork } =
    useNetworkStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!account) return null;

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
