import { EvmChainIds } from "@/features/protocols/evm/constants/ChainIds";

export const recommendedPathsArbitrum: Record<string, string[]> = {
  // USDT -> WETH
  "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9-0x82af49447d8a07e3bd95bd0d56f35241523fbab1":
    [
      "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
      "0xaf88d065e77c8C2239327C5EDb3A432268e5831", // USDC
      "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", // WETH
    ],
  // WETH -> USDT
  "0x82af49447d8a07e3bd95bd0d56f35241523fbab1-0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9":
    [
      "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", // WETH
      "0xaf88d065e77c8C2239327C5EDb3A432268e5831", // USDC
      "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
    ],
  // ...otros paths
};
