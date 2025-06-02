import { SwapParams } from "@/lib/types/swap";
import { TxReceipt } from "@/lib/types/transaction";

export interface ISwapper {
  approve(token: string, amount: bigint): Promise<void>;
  swapExactTokensForTokens(params: SwapParams): Promise<TxReceipt>;
}
