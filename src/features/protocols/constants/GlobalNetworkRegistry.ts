import { EvmNetworkRegistry } from "../evm/constants/evmNetworkRegistry";
import { INetwork } from "../types/INetwork";

export const GlobalNetworkRegistry: INetwork[] = [...EvmNetworkRegistry];
