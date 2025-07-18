import { useEffect, useRef, useState } from "react";
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
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const estimate = async () => {
    if (!swapAdapter || !tokenIn?.address || !tokenOut?.address || !amountIn) {
      setEstimatedOut(null);
      return;
    }
    try {
      setEstimating(true);
      setError(null);
      const result = await swapAdapter.estimateSwap({
        account: account ?? "",
        tokenIn,
        tokenOut,
        amountIn,
        slippage: 0.005,
      });
      setEstimatedOut(result.amountOutFormatted);
    } catch (err) {
      setError("Failed to estimate swap");
      console.log(err);
      setEstimatedOut(null);
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    estimate(); // Primera estimación inmediata
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (swapAdapter && tokenIn && tokenOut && amountIn) {
      pollingRef.current = setInterval(estimate, 8000); // cada 8 segundos
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapAdapter, tokenIn, tokenOut, amountIn, account]);

  return { estimatedOut, estimating, error, forceEstimate: estimate };
}
