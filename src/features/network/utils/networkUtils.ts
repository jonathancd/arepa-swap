import { NetworkRegistry } from "../constants/networkRegistry";

export const getSupportedNetworks = () => NetworkRegistry;

export const findNetworkById = (id: number) =>
  NetworkRegistry.find((n) => n.id === id) || null;

export const findNetworkByHex = (hex: string) =>
  NetworkRegistry.find((n) => n.chainIdHex === hex) || null;

export const getChainNameById = (id: string): string =>
  findNetworkById(Number(id))?.name ?? "unknown";

export const getEvmChainById = (id: string) =>
  findNetworkById(Number(id))?.evmChain ?? null;
