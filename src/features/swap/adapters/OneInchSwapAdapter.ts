import { BaseSwapAdapter } from "./BaseSwapAdapter";
import { SwapParams, SwapEstimate } from "../types/ISwapAdapter";

export class OneInchSwapAdapter extends BaseSwapAdapter {
  private chainId: number;
  constructor(chainId: number) {
    super();
    this.chainId = chainId;
  }

  async estimateSwap(params: SwapParams): Promise<SwapEstimate> {
    const { tokenIn, tokenOut, amountIn } = params;
    // amountIn debe estar en unidades mínimas (wei, etc.)
    const amountInParsed = BigInt(
      Math.floor(Number(amountIn) * 10 ** tokenIn.decimals)
    ).toString();
    const url = `https://api.1inch.io/v5.2/${this.chainId}/quote?fromTokenAddress=${tokenIn.address}&toTokenAddress=${tokenOut.address}&amount=${amountInParsed}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("1inch quote failed");
    const data = await res.json();
    // El resultado está en unidades mínimas, hay que formatear
    const amountOut = data.toTokenAmount;
    const amountOutFormatted = (
      Number(amountOut) /
      10 ** tokenOut.decimals
    ).toString();
    return {
      amountOut,
      amountOutFormatted,
      route: data.protocols?.[0]?.map((hop: any) => hop[0].name) ?? [],
      priceImpact: data.estimatedGas ? undefined : undefined,
    };
  }

  async executeSwap(): Promise<string> {
    throw new Error(
      "Not implemented: use 1inch frontend or /swap endpoint for execution"
    );
  }
}
