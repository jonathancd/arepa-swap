// https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02

import { Protocol } from "@/features/protocols/constants/Protocol";

/**
 * Registry of router addresses per protocol and network ID.
 * Used to dynamically initialize swap adapters.
 *
 * For EVM-based protocols, the networkId corresponds to chain ID (e.g. 1 = Ethereum Mainnet).
 * For Solana or other protocols, networkId can represent an internal mapping (e.g. 0 = Mainnet).
 */

export const SwapRouters: Record<Protocol, Record<number, string>> = {
  [Protocol.EVM]: {
    1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Ethereum Mainnet - Uniswap V2
    56: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // BSC Mainnet - PancakeSwap V2
    137: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // Polygon - QuickSwap
  },
  // [Protocol.SOLANA]: {
  // In the future: 0: "Jupiter placeholder or config URI"
  // },
};
