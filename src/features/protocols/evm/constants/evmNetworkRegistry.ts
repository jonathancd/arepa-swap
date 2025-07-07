import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IEvmNetwork } from "../types/IEvmNetwork";
import { Protocol } from "../../constants/Protocol";

const baseUrl = "/icons/chains";

export const EvmNetworkRegistry: IEvmNetwork[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: `${baseUrl}/1.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x1",
    evmChain: EvmChain.ETHEREUM,
  },
  {
    id: 56,
    name: "BSC",
    icon: `${baseUrl}/56.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0x38",
    evmChain: EvmChain.BSC,
  },
  // {
  //   id: 137,
  //   name: "Polygon",
  //   icon: "/icons/chains/137.webp",
  //   protocol: Protocol.EVM,
  //   chainIdHex: "0x89",
  //   evmChain: EvmChain.POLYGON,
  // },
  {
    id: 42161,
    name: "Arbitrum",
    icon: `${baseUrl}/42161.png`,
    protocol: Protocol.EVM,
    chainIdHex: "0xa4b1",
    evmChain: EvmChain.ARBITRUM,
  },
];
