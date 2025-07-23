// NOTA IMPORTANTE:
// Actualmente, el swapAdapter solo depende de la red (selectedNetwork), el modo (swapMode) y la wallet conectada (connectedWallet).
// Pero existen protocolos o routers (por ejemplo, algunos DEX agregadores o swaps cross-chain) donde el adapter puede depender también de los tokens seleccionados (tokenIn, tokenOut),
// ya que el contrato/router puede cambiar según el par de tokens o la ruta óptima.
// Si en el futuro se implemento algun mecanismo donde el adapter depende de los tokens, habra que recrear el adapter también al cambiar tokenIn/tokenOut.

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useTokenBalanceFromStore } from "@/features/token/hooks/useTokenBalanceFromStore";
import { useTokenPrice } from "@/features/token/hooks/useTokenPrice";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapEstimation } from "./useSwapEstimation";
import { IToken } from "@/features/token/types/IToken";
import { formatNumber } from "@/lib/formatters/formatNumber";
import { SwapAdapterFactory } from "../adapters/swapAdapterFactory";

export function useSwapForm() {
  const availableNetworks = useAvailableNetworks();
  const { account, setIsConnectModalOpen } = useWalletStore();
  const {
    config,
    setFromToken,
    setToToken,
    swapTokens,
    swapMode,
    setSwapAdapter,
  } = useSwapStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();
  const { connectedWallet } = useWalletStore();

  const [amountIn, setAmountInRaw] = useState("");
  const [amountOut, setAmountOutRaw] = useState("");
  const [editingField, setEditingField] = useState<"in" | "out" | null>(null);
  const [isTokenInFocused, setIsTokenInFocused] = useState(false);

  // Handler para amountIn (tokenOut se limpia automáticamente)
  const setAmountIn = (value: string) => {
    setAmountInRaw(value);
    setAmountOutRaw("");
  };

  useEffect(() => {
    setAmountInRaw("");
    setAmountOutRaw("");
  }, [selectedNetwork?.id]);

  const [debouncedAmountIn] = useDebounce(amountIn, 400);

  // Tokens y precios
  const tokenIn = config.fromToken;
  const tokenOut = config.toToken;
  const priceIn = useTokenPrice(tokenIn);
  const priceOut = useTokenPrice(tokenOut);
  const tokenInBalance = Number(useTokenBalanceFromStore(tokenIn));
  const tokenOutBalance = Number(useTokenBalanceFromStore(tokenOut));

  // Estimación de swap
  const { estimatedOut, estimating, error } = useSwapEstimation({
    swapAdapter: config.swapAdapter,
    tokenIn,
    tokenOut,
    amountIn: debouncedAmountIn,
    account,
  });

  // Calcular valores USD
  const tokenInUsd = useMemo(() => {
    if (!priceIn || !amountIn) return null;
    return (parseFloat(amountIn) * priceIn).toFixed(2);
  }, [priceIn, amountIn]);

  const tokenOutUsd = useMemo(() => {
    if (!priceOut) return null;
    const amount = estimatedOut || amountOut;
    if (!amount) return null;
    return (parseFloat(amount) * priceOut).toFixed(2);
  }, [priceOut, estimatedOut, amountOut]);

  // Validaciones de balance
  const insufficientBalanceIn = useMemo(() => {
    if (!tokenIn || !amountIn || !tokenInBalance) return false;
    return parseFloat(amountIn) > tokenInBalance;
  }, [amountIn, tokenIn, tokenInBalance]);

  const insufficientBalanceOut = useMemo(() => {
    if (!tokenOut || !amountOut || !tokenOutBalance) return false;
    return parseFloat(amountOut) > tokenOutBalance;
  }, [amountOut, tokenOut, tokenOutBalance]);

  // Determinar si el swap está deshabilitado
  const swapDisabled = useMemo(() => {
    if (!account) return false;
    if (estimating) return true;
    if (!estimatedOut) return true;
    if (insufficientBalanceIn || insufficientBalanceOut) return true;
    return false;
  }, [
    account,
    estimating,
    estimatedOut,
    insufficientBalanceIn,
    insufficientBalanceOut,
  ]);

  // Handlers
  const handleSwapTokens = async () => {
    swapTokens();
    setAmountInRaw("");
    setAmountOutRaw("");
    // recrea el adapter aquí también
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

  const handleTokenClick = (field: "in" | "out" | null) => {
    setEditingField(field);
  };

  const handleSelectToken = (token: IToken) => {
    if (!editingField) return;

    if (editingField === "in") {
      if (token.chainId !== selectedNetwork?.id) {
        const newNetwork = availableNetworks.find(
          (n) => n.id === token.chainId
        );
        if (newNetwork) {
          setSelectedNetwork(newNetwork);
        }
      }
      setFromToken(token);
    }

    if (editingField === "out") {
      setToToken(token);
    }

    setEditingField(null);
  };

  const handleSwap = async () => {
    if (!config.swapAdapter || !account || !tokenIn || !tokenOut || !amountIn)
      return;

    try {
      const tx = await config.swapAdapter.executeSwap({
        account,
        tokenIn,
        tokenOut,
        amountIn,
        slippage: 0.005,
      });
      alert(`Swap executed! TX: ${tx}`);
    } catch (err) {
      console.error("Swap error", err);
      alert("Swap failed.");
    }
  };

  const handleConnectWallet = () => {
    setIsConnectModalOpen(true);
  };

  // Actualizar amountOut cuando cambia la estimación
  const displayAmountOut = useMemo(() => {
    if (estimatedOut) {
      return formatNumber(Number(estimatedOut), { decimals: 4 });
    }
    return amountOut;
  }, [estimatedOut, amountOut]);

  // amountIn siempre es lo que el usuario escribe
  const displayAmountIn = amountIn;

  useEffect(() => {
    let cancelled = false;
    const setupAdapter = async () => {
      if (!selectedNetwork) return;
      const signer = connectedWallet
        ? await connectedWallet.getSigner()
        : undefined;
      const adapter = await SwapAdapterFactory({
        network: selectedNetwork,
        signer,
        swapMode,
      });
      if (!cancelled) setSwapAdapter(adapter);
    };
    setupAdapter();
    return () => {
      cancelled = true;
    };
  }, [selectedNetwork, swapMode, connectedWallet, setSwapAdapter]);

  return {
    amountIn: displayAmountIn,
    amountOut: displayAmountOut,
    editingField,
    isTokenInFocused,

    tokenIn,
    tokenOut,
    tokenInBalance,
    tokenOutBalance,
    tokenInUsd,
    tokenOutUsd,
    selectedNetwork,

    insufficientBalanceIn,
    insufficientBalanceOut,
    swapDisabled,

    estimating,
    error,

    setAmountIn,
    setIsTokenInFocused,
    handleSwapTokens,
    handleTokenClick,
    handleSelectToken,
    handleSwap,
    handleConnectWallet,
  };
}
