import {
  ISwapAdapter,
  SwapParams,
  SwapEstimate,
  ApproveParams,
} from "../types/ISwapAdapter";

/**
 * Abstract base class for all swap adapters.
 * Provides a common interface for estimating and executing swaps,
 * regardless of protocol (EVM, Solana, etc).
 */
export abstract class BaseSwapAdapter implements ISwapAdapter {
  abstract estimateSwap(params: SwapParams): Promise<SwapEstimate>;
  abstract executeSwap(params: SwapParams): Promise<string>;
  approve?(params: ApproveParams): Promise<boolean>;
}
