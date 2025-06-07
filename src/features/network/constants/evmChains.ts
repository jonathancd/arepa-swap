import { EvmChain } from "@moralisweb3/common-evm-utils";

export const SupportedChains = {
  ethereum: {
    id: "1",
    name: "ethereum",
    chain: EvmChain.ETHEREUM,
  },
  bsc: {
    id: "56",
    name: "bsc",
    chain: EvmChain.BSC,
  },
  polygon: {
    id: "137",
    name: "polygon",
    chain: EvmChain.POLYGON,
  },
} as const;
