import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IEvmNetwork } from "../types/IEvmNetwork";

export const EvmNetworkRegistry: IEvmNetwork[] = [
  {
    id: 1,
    name: "Ethereum",
    chainIdHex: "0x1",
    icon: "/icons/networks/ethereum.svg",
    evmChain: EvmChain.ETHEREUM,
    type: "evm",
  },
  {
    id: 56,
    name: "BSC",
    chainIdHex: "0x38",
    icon: "/icons/networks/bsc.svg",
    evmChain: EvmChain.BSC,
    type: "evm",
  },
  {
    id: 137,
    name: "Polygon",
    chainIdHex: "0x89",
    icon: "/icons/networks/polygon.svg",
    evmChain: EvmChain.POLYGON,
    type: "evm",
  },
];
