import { ISwapMode } from "../types/ISwapMode";

export interface SwapModeMeta {
  key: ISwapMode;
  label: string;
  description: string;
  supportsCrossChain: boolean;
}

export const SWAP_MODES: SwapModeMeta[] = [
  {
    key: "ethers",
    label: "Ethers",
    description: "Manual, solo intra-chain",
    supportsCrossChain: false,
  },
  {
    key: "1inch",
    label: "1inch",
    description: "Mejor ruta intra-chain",
    supportsCrossChain: false,
  },
  {
    key: "lifi",
    label: "Li.Fi",
    description: "Cross-chain",
    supportsCrossChain: true,
  },
];
