import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IEvmNetwork } from "../types/IEvmNetwork";
import { Protocol } from "../../constants/Protocol";

export const EvmNetworkRegistry: IEvmNetwork[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/icons/networks/ethereum.svg",
    protocol: Protocol.EVM,
    chainIdHex: "0x1",
    evmChain: EvmChain.ETHEREUM,
  },
  {
    id: 56,
    name: "BSC",
    icon: "/icons/networks/bsc.svg",
    protocol: Protocol.EVM,
    chainIdHex: "0x38",
    evmChain: EvmChain.BSC,
  },
  {
    id: 137,
    name: "Polygon",
    icon: "/icons/networks/polygon.svg",
    protocol: Protocol.EVM,
    chainIdHex: "0x89",
    evmChain: EvmChain.POLYGON,
  },
];
