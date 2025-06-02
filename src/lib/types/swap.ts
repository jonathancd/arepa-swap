export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  recipient: string;
  slippage: number;
  deadline: number;
}
