import { EvmNetworkRegistry } from "./evm/constants/evmNetworkRegistry";
import { IBaseNetwork } from "./types/IBaseNetwork";

export const GlobalNetworkRegistry: IBaseNetwork[] = [...EvmNetworkRegistry];
