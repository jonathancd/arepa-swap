import { EvmChain } from "@moralisweb3/common-evm-utils";

export interface IEvmNetwork {
  id: number;
  name: string;
  chainIdHex: string;
  icon: string;
  evmChain: EvmChain;
  type: "evm";
}
