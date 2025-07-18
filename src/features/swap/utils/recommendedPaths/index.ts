import { EvmChainIds } from "@/features/protocols/evm/constants/ChainIds";
import { recommendedPathsArbitrum } from "./arbitrum";
// import otros paths por red aquí

export const recommendedPaths: Record<number, Record<string, string[]>> = {
  [EvmChainIds.ARBITRUM]: recommendedPathsArbitrum,
};
