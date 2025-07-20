import { useEffect, useState } from "react";
import { ISwapAdapter } from "../types/ISwapAdapter";
import { IToken } from "@/features/token/types/IToken";

interface UseSwapEstimationParams {
  swapAdapter: ISwapAdapter | null;
  tokenIn: IToken | null;
  tokenOut: IToken | null;
  amountIn: string;
  account: string | null;
}

export function useSwapEstimation({
  swapAdapter,
  tokenIn,
  tokenOut,
  amountIn,
  account,
}: UseSwapEstimationParams) {
  const [estimatedOut, setEstimatedOut] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = async () => {
    console.log("[useSwapEstimation] Starting estimation:", {
      hasSwapAdapter: !!swapAdapter,
      tokenIn: tokenIn?.symbol,
      tokenOut: tokenOut?.symbol,
      amountIn,
    });

    // Validar datos requeridos
    if (!swapAdapter || !tokenIn?.address || !tokenOut?.address) {
      console.log(
        "[useSwapEstimation] Missing required data, skipping estimation"
      );
      setEstimatedOut(null);
      setError(null);
      return;
    }

    // Validar que tenemos un monto válido
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setEstimatedOut(null);
      setError(null);
      return;
    }

    try {
      setEstimating(true);
      setError(null);

      console.log("[useSwapEstimation] Estimating OUT from IN:", {
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        amountIn,
      });

      const result = await swapAdapter.estimateSwap({
        account: account ?? "",
        tokenIn,
        tokenOut,
        amountIn,
        slippage: 0.005,
      });

      setEstimatedOut(result.amountOutFormatted);
      console.log(
        "[useSwapEstimation] Estimation result:",
        result.amountOutFormatted
      );
    } catch (err) {
      console.error("[useSwapEstimation] Estimation error:", err);
      setError("Failed to estimate swap");
      setEstimatedOut(null);
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    // Solo estimar si tenemos datos válidos y un monto > 0
    if (
      swapAdapter &&
      tokenIn?.address &&
      tokenOut?.address &&
      amountIn &&
      parseFloat(amountIn) > 0
    ) {
      estimate();
    } else {
      // Limpiar estimaciones si no hay datos válidos
      setEstimatedOut(null);
      setEstimating(false);
      setError(null);
    }
  }, [swapAdapter, tokenIn?.address, tokenOut?.address, amountIn, account]);

  return {
    estimatedOut,
    estimating,
    error,
    forceEstimate: estimate,
  };
}
