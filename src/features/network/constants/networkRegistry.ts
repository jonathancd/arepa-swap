// import { EvmChain } from "@moralisweb3/common-evm-utils";
// import { INetwork } from "../types/INetwork";

// export const NetworkRegistry: INetwork[] = [
//   {
//     id: 1,
//     name: "Ethereum",
//     chainIdHex: "0x1",
//     icon: "/icons/networks/ethereum.svg",
//     evmChain: EvmChain.ETHEREUM,
//   },
//   {
//     id: 56,
//     name: "BSC",
//     chainIdHex: "0x38",
//     icon: "/icons/networks/bsc.svg",
//     evmChain: EvmChain.BSC,
//   },
//   {
//     id: 137,
//     name: "Polygon",
//     chainIdHex: "0x89",
//     icon: "/icons/networks/polygon.svg",
//     evmChain: EvmChain.POLYGON,
//   },
// ];

import { INetwork } from "../types/INetwork";
import { EvmNetworkRegistry } from "@/features/evm/constants/evmNetworksRegistry";

export const NetworkRegistry: INetwork[] = [...EvmNetworkRegistry]; // + otherNetworkTypes
