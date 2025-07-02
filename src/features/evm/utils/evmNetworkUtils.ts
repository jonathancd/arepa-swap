import { EvmNetworkRegistry } from "../constants/evmNetworksRegistry";

export const findEvmNetworkById = (id: number) =>
  EvmNetworkRegistry.find((n) => n.id === id) || null;

export const findEvmNetworkByHex = (hex: string) =>
  EvmNetworkRegistry.find((n) => n.chainIdHex === hex) || null;
