import { useEffect } from "react";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { getDefaultTokensForNetwork } from "@/features/token/utils/getDefaultTokens";
import { SwapAdapterFactory } from "../adapters/swapAdapterFactory";
import { useInitializationStore } from "@/stores/initializationStore";

export function useSwapDefaults() {
  const { connectedWallet, account } = useWalletStore();
  const { selectedNetwork } = useNetworkStore();
  const { setFromToken, setToToken, setNetworks, setSwapAdapter, swapMode } =
    useSwapStore();
  const {
    protocolInitialized,
    networkInitialized,
    walletRestored,
    canProceedToSwap,
  } = useInitializationStore();

  useEffect(() => {
    const init = async () => {
      if (!canProceedToSwap()) {
        return;
      }

      if (!selectedNetwork) {
        return;
      }

      // Si el modo es ethers o 1inch, reinicia los tokens y redes si hay cross-chain
      if ((swapMode === "ethers" || swapMode === "1inch") && selectedNetwork) {
        setFromToken(null);
        setToToken(null);
        setNetworks(selectedNetwork);
      }

      const defaults = getDefaultTokensForNetwork(selectedNetwork.id);
      if (!defaults) {
        return;
      }

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
          swapMode,
        });

        setSwapAdapter(adapter);
      }
    };

    init();
  }, [
    account,
    connectedWallet,
    selectedNetwork,
    swapMode,
    protocolInitialized,
    networkInitialized,
    walletRestored,
    setFromToken,
    setToToken,
    setNetworks,
    setSwapAdapter,
    canProceedToSwap,
  ]);
}
