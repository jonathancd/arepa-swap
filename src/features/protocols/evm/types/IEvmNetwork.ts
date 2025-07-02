import { EvmChain } from "@moralisweb3/common-evm-utils";
import { IBaseNetwork } from "../../types/IBaseNetwork";

export interface IEvmNetwork extends IBaseNetwork {
  chainIdHex: string;
  evmChain: EvmChain;
}
