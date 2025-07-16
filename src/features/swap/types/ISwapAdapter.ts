export interface SwapParams {
  account: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage: number;
  path?: string[];
}

export interface SwapEstimate {
  amountOut: string;
  amountOutFormatted: string;
  route?: string[];
  priceImpact?: string;
}

export interface ApproveParams {
  account: string;
  tokenAddress: string;
  spender: string;
  amount: string;
}

export interface ISwapAdapter {
  estimateSwap(params: SwapParams): Promise<SwapEstimate>;
  executeSwap(params: SwapParams): Promise<string>; // returns tx hash
  approve?(params: ApproveParams): Promise<boolean>;
}
