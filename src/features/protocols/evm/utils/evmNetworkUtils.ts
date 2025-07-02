import { EvmNetworkRegistry } from "../constants/evmNetworkRegistry";

export const findEvmNetworkByid = (id: number) =>
  EvmNetworkRegistry.find((n) => n.id === id) || null;

export const findEvmNetworkByHex = (hex: string) =>
  EvmNetworkRegistry.find((n) => n.chainIdHex === hex) || null;

/**
 * FOR CHECKING
 5. Si necesitas buscar cualquier red, desde cualquier parte:


import { NetworkRegistry } from "../protocols/registry";
import { IBaseNetwork } from "../protocols/types/IBaseNetwork";

export const findNetworkById = (id: number): IBaseNetwork | null =>
  NetworkRegistry.find((n) => n.id === id) || null;

export const getChainNameById = (id: number): string =>
  findNetworkById(id)?.name ?? "unknown";
 */
