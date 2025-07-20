import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { useInitializationStore } from "@/stores/initializationStore";

export function useDefaultProtocol() {
  const { protocol, setProtocol, connectedWallet } = useWalletStore();
  const { setProtocolInitialized } = useInitializationStore();

  useEffect(() => {
    if (!connectedWallet && !protocol) {
      setProtocol(Protocol.EVM);
    }

    if (protocol) {
      setProtocolInitialized();
    }
  }, [connectedWallet, protocol, setProtocol, setProtocolInitialized]);
}
