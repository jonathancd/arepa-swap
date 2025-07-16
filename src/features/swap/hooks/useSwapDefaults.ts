import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "../stores/swapStore";
import { getDefaultTokensForNetwork } from "@/features/token/utils/getDefaultTokens";
import { SwapAdapterFactory } from "../adapters/swapAdapterFactory";

/**
 * Initializes swap defaults when wallet and network are available:
 * - Sets tokenIn and tokenOut from registry
 * - Creates the appropriate adapter via factory and sets it in the store
 */
export function useSwapDefaults() {
  const { connectedWallet } = useWalletStore();
  const { tokenIn, tokenOut, setTokenIn, setTokenOut, setActiveSwapAdapter } =
    useSwapStore();

  useEffect(() => {
    const init = async () => {
      if (!connectedWallet) return;

      const network = await connectedWallet.getNetwork();
      if (!network) return;

      // 🪙 Set default tokens only if not already set
      if (!tokenIn || !tokenOut) {
        const defaults = getDefaultTokensForNetwork(network.id);
        if (defaults) {
          setTokenIn(defaults.tokenIn);
          setTokenOut(defaults.tokenOut);
        }
      }

      // Set adapter
      const adapter = await SwapAdapterFactory(connectedWallet);
      setActiveSwapAdapter(adapter);
    };

    init();
  }, [
    connectedWallet,
    tokenIn,
    tokenOut,
    setTokenIn,
    setTokenOut,
    setActiveSwapAdapter,
  ]);
}
