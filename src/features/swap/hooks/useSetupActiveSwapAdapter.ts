import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "../stores/swapStore";
import { SwapRouters } from "../constants/SwapRouters";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { UniswapV2SwapAdapter } from "../adapters/UniswapV2SwapAdapter";

/**
 * Reactively sets the active swap adapter when the connected wallet changes.
 * Ensures the correct adapter is configured based on protocol + network + signer.
 */
export function useSetupActiveSwapAdapter() {
  const { connectedWallet } = useWalletStore();
  const { setActiveSwapAdapter } = useSwapStore();

  useEffect(() => {
    const setupAdapter = async () => {
      if (!connectedWallet) {
        setActiveSwapAdapter(null);
        return;
      }

      const protocol = connectedWallet.protocol;
      const network = await connectedWallet.getNetwork();
      const signer = await connectedWallet.getSigner();

      if (!network || !signer) {
        setActiveSwapAdapter(null);
        return;
      }

      const router = SwapRouters[protocol]?.[network.id];
      if (!router) {
        setActiveSwapAdapter(null);
        return;
      }

      // For now, only UniswapV2 is supported for EVM protocols
      if (protocol === Protocol.EVM) {
        const adapter = new UniswapV2SwapAdapter(router, signer);
        setActiveSwapAdapter(adapter);
        return;
      }

      // Future: handle other protocols (Solana)
      setActiveSwapAdapter(null);
    };

    setupAdapter();
  }, [connectedWallet, setActiveSwapAdapter]);
}
