import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { Protocol } from "@/features/protocols/constants/Protocol";

export function useDefaultProtocol() {
  const { protocol, setProtocol, connectedWallet } = useWalletStore();
  useEffect(() => {
    if (!connectedWallet && !protocol) {
      setProtocol(Protocol.EVM);
    }
  }, [connectedWallet, protocol, setProtocol]);
}
