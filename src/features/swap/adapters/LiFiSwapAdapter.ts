import { BaseSwapAdapter } from "./BaseSwapAdapter";
import { SwapParams, SwapEstimate } from "../types/ISwapAdapter";

export class LiFiSwapAdapter extends BaseSwapAdapter {
  async estimateSwap(params: SwapParams): Promise<SwapEstimate> {
    const { tokenIn, tokenOut, amountIn } = params;
    // amountIn debe estar en unidades mínimas (wei, etc.)
    const amountInParsed = BigInt(
      Math.floor(Number(amountIn) * 10 ** tokenIn.decimals)
    ).toString();
    const url = `https://li.quest/v1/quote?fromChain=${tokenIn.chainId}&fromToken=${tokenIn.address}&toChain=${tokenOut.chainId}&toToken=${tokenOut.address}&fromAmount=${amountInParsed}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Li.Fi quote failed");
    const data = await res.json();
    // El resultado está en units mínimas, hay que formatear
    const amountOut = data.estimate?.toAmount;
    const amountOutFormatted = amountOut
      ? (Number(amountOut) / 10 ** tokenOut.decimals).toString()
      : "0";
    return {
      amountOut,
      amountOutFormatted,
      route:
        data.estimate?.route?.steps?.map(
          (step: any) => step.toolDetails?.name
        ) ?? [],
      priceImpact: undefined,
    };
  }

  async executeSwap(): Promise<string> {
    throw new Error(
      "Not implemented: use Li.Fi frontend or /swap endpoint for execution"
    );
  }
}
