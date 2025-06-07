import { EvmChain } from "@moralisweb3/common-evm-utils";

export interface INetwork {
  id: number;
  name: string;
  chainIdHex: string; // e.g., '0x1'
  icon: string;
  evmChain: EvmChain;
}
