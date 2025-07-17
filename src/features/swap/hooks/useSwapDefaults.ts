import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultTokensForNetwork } from "@/features/token/utils/getDefaultTokens";
import { SwapAdapterFactory } from "../adapters/swapAdapterFactory";

export function useSwapDefaults() {
  const { connectedWallet } = useWalletStore();
  const { selectedNetwork } = useNetworkStore();
  const { setFromToken, setToToken, setNetworks, setSwapAdapter } =
    useSwapStore();

  useEffect(() => {
    const init = async () => {
      if (!selectedNetwork) return;

      const defaults = getDefaultTokensForNetwork(selectedNetwork.id);
      if (!defaults) return;

      setFromToken(defaults.tokenIn);
      setToToken(defaults.tokenOut);
      setNetworks(selectedNetwork);

      if (selectedNetwork) {
        const signer = connectedWallet
          ? await connectedWallet.getSigner()
          : undefined;
        const adapter = await SwapAdapterFactory({
          network: selectedNetwork,
          signer,
        });
        setSwapAdapter(adapter);
      }
    };

    init();
  }, [
    connectedWallet,
    selectedNetwork,
    setFromToken,
    setToToken,
    setNetworks,
    setSwapAdapter,
  ]);
}
